import cookieParser from "cookie-parser";
import type { RequestHandler } from "express";
import express from "express";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { renderPage } from "vite-plugin-ssr";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = `${__dirname}/..`;

void startServer();

async function startServer(): Promise<void> {
    if (process.env.PROD) {
        throw new Error("Not for production use");
    }

    const viteDevServer = await createServer({
        root,
        server: { middlewareMode: true },
    });
    const app = express();
    app.use(cookieParser());
    app.use(viteDevServer.middlewares);

    app.get("*", (async (req, res, next) => {
        const pageContextInit = {
            cookies: req.cookies as Record<string, string>,
            urlOriginal: req.originalUrl,
            userAgent: req.get("User-Agent"),
        };
        const pageContext = await renderPage(pageContextInit);
        const { httpResponse } = pageContext;

        if (!httpResponse) {
            return next();
        }

        const { statusCode, contentType, earlyHints } = httpResponse;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (res.writeEarlyHints) {
            res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
        }
        res.status(statusCode).type(contentType);
        httpResponse.pipe(res);
    }) as RequestHandler);

    const port = process.env.PORT || 3000;
    app.listen(port);
    console.log(`Server running at http://localhost:${port}`);
}
