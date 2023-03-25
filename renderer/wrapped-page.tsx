import * as React from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient, createServerSupabaseClient } from "@supabase/auth-helpers-shared";
import { LayoutDefault } from "@/layouts/default";
import { PageContextProvider } from "@/components/page-context-provider";
import type { PageContext } from "./types";

import "@unocss/reset/tailwind-compat.css";
import "virtual:uno.css";

export async function wrappedPage(pageContext: PageContext): Promise<JSX.Element> {
    const { Page, pageProps } = pageContext;
    const Layout = pageContext.exports.layout ?? LayoutDefault;
    const supabaseClient = createSupabaseClient(pageContext);
    const {
        data: { session: initialSession },
    } = await supabaseClient.auth.getSession();

    return (
        <React.StrictMode>
            <SessionContextProvider initialSession={initialSession} supabaseClient={supabaseClient}>
                <PageContextProvider pageContext={pageContext}>
                    <Layout>
                        <Page {...pageProps} />
                    </Layout>
                </PageContextProvider>
            </SessionContextProvider>
        </React.StrictMode>
    );
}

function createSupabaseClient<
    Database = any,
    SchemaName extends string & keyof Database = "public" extends keyof Database ? "public" : string & keyof Database
>(pageContext: PageContext) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (import.meta.env.SSR) {
        const { cookies, setCookie, getRequestHeader } = pageContext;
        return createServerSupabaseClient<Database, SchemaName>({
            supabaseUrl,
            supabaseKey,
            getRequestHeader,
            getCookie: (name) => cookies[name],
            setCookie: (name, value, options) => setCookie(name, value, options),
        });
    } else {
        return createBrowserSupabaseClient<Database, SchemaName>({
            supabaseUrl,
            supabaseKey,
        });
    }
}
