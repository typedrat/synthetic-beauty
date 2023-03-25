import { renderToStream } from "react-streaming/server";
import type { Optional } from "utility-types";
import { escapeInject } from "vite-plugin-ssr";
import type { PageContextServer } from "./types";
import { getPageDescription, getPageTitle } from "./get-page-info";
import { wrappedPage } from "./wrapped-page";

export const passToClient = ["$$typeof", "pageProps", "documentProps", "routeParams"];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function render(pageContext: Optional<PageContextServer, "Page">) {
    const { userAgent } = pageContext;

    let pageHtmlStream;
    if (pageContext.Page) {
        const page = await wrappedPage(pageContext as PageContextServer);

        pageHtmlStream = await renderToStream(page, { userAgent });
    } else {
        pageHtmlStream = "";
    }

    const title = getPageTitle(pageContext);
    const desc = getPageDescription(pageContext);

    const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="${desc}" />
            <title>${title}</title>
    
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#fbb023" />
            <meta name="msapplication-TileColor" content="#fbb023" />
            <meta name="theme-color" content="#fbb023" />
        </head>
        <body>
            <div id="page-view" style="display: contents;">${pageHtmlStream}</div>
            <script>
                (function () {
                    const root = document.getElementById("page-view");
                    const isDarkMode = JSON.parse(localStorage.getItem("usehooks-ts-dark-mode")) ??
                        window.matchMedia("(prefers-color-scheme: dark)").matches;
                
                    if (isDarkMode) {
                        root.classList.add("dark-theme");
                    } else {
                        root.classList.remove("dark-theme");
                    }
                })();
            </script>
        </body>
    </html>`;

    return { documentHtml };
}
