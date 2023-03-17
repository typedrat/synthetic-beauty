import { RequestCookies } from "@edge-runtime/cookies";
import type { RequestContext } from "@vercel/edge";
import { renderPage } from "vite-plugin-ssr";

// eslint-disable-next-line import/no-default-export
export default async function ssr(request: Request, _context: RequestContext): Promise<Response> {
    const cookies = new RequestCookies(request.headers);
    const cookiesObject = Object.fromEntries(cookies);

    const pageContextInit = {
        cookies: cookiesObject,
        urlOriginal: request.url,
        userAgent: request.headers.get("User-Agent"),
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;

    if (!httpResponse) {
        throw new Error("Didn't get an HTTP response!");
    }

    const { statusCode: status, contentType } = httpResponse;

    return new Response(httpResponse.getReadableWebStream(), {
        headers: {
            "Content-Type": contentType,
        },
        status,
    });
}
