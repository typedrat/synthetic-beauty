import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createMiddleware as createHattipMiddleware } from "@hattip/adapter-node";
import { createServer as createVite } from "vite";
import handler from "@/server/handler";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = `${__dirname}/..`;

void startServer();

async function startServer(): Promise<void> {
    const app = express();

    if (process.env.NODE_ENV !== "production") {
        const viteDevServer = await createVite({
            root,
            server: { middlewareMode: true },
            appType: "custom",
        });

        app.use(viteDevServer.middlewares);
    } else {
        throw new Error("Not for production use");
    }

    const hattipMiddleware = createHattipMiddleware(handler);
    app.use(hattipMiddleware);

    const port = process.env.PORT || 3000;
    app.listen(port);
    console.log(`Server running at http://localhost:${port}`);
}
