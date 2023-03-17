import * as React from "react";
import { LayoutDefault } from "../layouts/default";
import { PageContextProvider } from "./use-page-context";
import type { PageContext } from "./types";

import "@unocss/reset/tailwind-compat.css";
import "virtual:uno.css";

export function wrappedPage(pageContext: PageContext): JSX.Element {
    const { Page, pageProps } = pageContext;
    const Layout = pageContext.exports.layout ?? LayoutDefault;

    return (
        <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>
                <Layout>
                    <Page {...pageProps} />
                </Layout>
            </PageContextProvider>
        </React.StrictMode>
    );
}
