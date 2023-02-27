import type { APIContext } from "astro";
import {
    S3Client,
    HeadObjectCommand,
    GetObjectCommand,
    NotFound,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Innertube } from "youtubei.js";

const Bucket = "synthetic-beauty-audio-cache";
const expiresIn = 7 * 24 * 60 * 60;

export async function get(ctx: APIContext) {
    const youtube = await Innertube.create();
    const client = new S3Client({ region: "us-east-1" });

    const id = ctx.params.id!;

    const Key = `${id}.mp4`;

    try {
        const headCommand = new HeadObjectCommand({ Bucket, Key });
        const {} = await client.send(headCommand);
    } catch (err) {
        if (err instanceof NotFound) {
            const Body = await youtube.download(id, {
                type: "audio",
                quality: "best",
                format: "mp4",
            });
            const uploadS3 = new Upload({
                client,
                params: { Bucket, Key, Body },
            });

            await uploadS3.done();
        } else {
            throw err;
        }
    }

    const getCommand = new GetObjectCommand({ Bucket, Key });
    const url = await getSignedUrl(client, getCommand, { expiresIn });

    return new Response(JSON.stringify({ url, expiresIn }), {
        status: 200,
        statusText: "OK",
        headers: {
            "Content-Type": "application/json",
        },
    });
}
