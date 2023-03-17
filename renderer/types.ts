import type { PageContextBuiltIn } from "vite-plugin-ssr";
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client/router";

type Page = (pageProps: PageProps) => JSX.Element;
export type PageProps = Record<string, never>;

export interface DocumentProps {
    title?: string;
    description?: string;
}

export interface LayoutArgs {
    children: JSX.Element;
}

export interface PageContextCustom {
    cookies: Record<string, string>;
    Page: Page;
    pageProps?: PageProps;
    urlPathname: string;
    userAgent?: string;
    exports: {
        documentProps?: DocumentProps;
        layout?: (args: LayoutArgs) => JSX.Element;
    };
}

export type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom;
export type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom;

export type PageContext = PageContextClient | PageContextServer;
