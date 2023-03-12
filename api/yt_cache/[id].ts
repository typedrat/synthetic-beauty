import { json, RequestContext } from "@vercel/edge";
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

function getId(request: Request): string {
    const params = new URL(request.url).searchParams;

    const id = params.get("id");
    if (typeof id !== "string") {
        throw new Error(`Invalid source ID: ${id}`);
    }

    return id;
}

export default async function handler(
    request: Request,
    context: RequestContext
): Promise<Response> {
    if (!Bucket) {
        throw new Error("AUDIO_CACHE_BUCKET_NAME should not be undefined!");
    }

    const id = getId(request);
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

    return json({ url, expiresIn });
}

export const config = { runtime: "edge" };
