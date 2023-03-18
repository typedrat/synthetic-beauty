import { getAssetFromKV, NotFoundError } from "@cloudflare/kv-asset-handler";
import { parse } from "cookie";
import { renderPage } from "vite-plugin-ssr";

addEventListener("fetch", (event) => {
    event.respondWith(handleEvent(event));
});

async function handleEvent(event: FetchEvent): Promise<Response> {
    try {
        return await getAssetFromKV(event, { cacheControl: { browserTTL: 3600 } });
    } catch (error) {
        if (error instanceof NotFoundError) {
            const request = event.request;

            const cookies = parse(request.headers.get("Cookie") ?? "");
            const urlOriginal = new URL(request.url).pathname;
            const userAgent = request.headers.get("User-Agent");

            const pageContextInit = {
                cookies,
                urlOriginal,
                userAgent,
            };
            const pageContext = await renderPage(pageContextInit);
            const { httpResponse } = pageContext;

            if (httpResponse) {
                const { statusCode, contentType } = httpResponse;

                return new Response(httpResponse.getReadableWebStream(), {
                    status: statusCode,
                    headers: { "Content-Type": contentType },
                });
            }
        } else {
            throw error;
        }
    }

    return new Response("An unexpected error occurred", { status: 500 });
}
