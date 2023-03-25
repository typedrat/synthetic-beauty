// eslint-disable-next-line unicorn/prefer-node-protocol
import { Writable } from "stream";
import type { PartialHandler } from "@hattip/compose";
import { compose } from "@hattip/compose";
import { cookie } from "@hattip/cookie";
import type { CookieSerializeOptions } from "cookie";
import * as ReactDOMServer from "react-dom/server";
import { renderPage } from "vite-plugin-ssr";

const hasRenderToReadableStream = Boolean(ReactDOMServer.renderToReadableStream);

const appHandler: PartialHandler = async (ctx) => {
    //
    const request = ctx.request;
    const urlOriginal = new URL(request.url).pathname;
    const userAgent = request.headers.get("User-Agent");

    const pageContextInit = {
        cookies: ctx.cookie,
        setCookie(name: string, value: string, options?: CookieSerializeOptions): void {
            ctx.setCookie(name, value, options);
        },
        getRequestHeader(name: string): string | undefined {
            if (name.toLowerCase() === "host") {
                return ctx.url.hostname;
            } else {
                return request.headers.get(name) || undefined;
            }
        },
        urlOriginal,
        userAgent,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;

    if (httpResponse) {
        const { statusCode, contentType } = httpResponse;

        if (hasRenderToReadableStream) {
            return new Response(httpResponse.getReadableWebStream(), {
                status: statusCode,
                headers: { "Content-Type": contentType },
            });
        } else {
            const { readable, writable } = new TransformStream();
            httpResponse.pipe(Writable.fromWeb(writable));

            return new Response(readable, {
                status: statusCode,
                headers: { "Content-Type": contentType },
            });
        }
    } else {
        ctx.passThrough();
    }
};

export const handler = compose(cookie(), appHandler);
export default handler;
