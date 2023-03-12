import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
    S3Client,
    HeadObjectCommand,
    GetObjectCommand,
    NotFound,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Innertube } from "youtubei.js";

const Bucket = process.env.AUDIO_CACHE_BUCKET_NAME;
const expiresIn = 7 * 24 * 60 * 60;

const client = new S3Client({});
const youtube = await Innertube.create();

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (!Bucket) {
        throw new Error("AUDIO_CACHE_BUCKET_NAME should not be undefined!");
    }

    const id = request.query.id;
    if (typeof id !== "string") {
        throw new Error(`Invalid source ID: ${id}`);
    }

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

    response.status(200).json({ url, expiresIn });
}
