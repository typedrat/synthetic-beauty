import { Auth } from "@auth/core";
import type { AuthAction, AuthConfig, Session } from "@auth/core/types";
import type { APIContext } from "astro";

export interface AstroAuthConfig extends AuthConfig {
    /**
     * Defines the base path for the auth routes.
     * @default '/auth'
     */
    prefix?: string;
}

const actions: AuthAction[] = [
    "providers",
    "session",
    "csrf",
    "signin",
    "signout",
    "callback",
    "verify-request",
    "error",
];

const notFound = new Response(null, {
    status: 404,
    statusText: "Not Found",
    headers: {
        "X-Astro-Response": "Not-Found",
    },
});

function AstroAuthHandler(prefix: string, authOptions: AstroAuthConfig) {
    return async (ctx: APIContext): Promise<Response> => {
        const pathname = ctx.url.pathname;
        const action = pathname
            .slice(prefix.length + 1)
            .split("/")[0] as AuthAction;

        if (pathname.startsWith(prefix) && actions.includes(action)) {
            return await Auth(ctx.request, authOptions);
        } else {
            return notFound;
        }
    };
}

export function AstroAuth(config: AstroAuthConfig) {
    const { prefix = "/auth", ...authOptions } = config;

    authOptions.secret ??= import.meta.env.AUTH_SECRET;
    authOptions.trustHost ??= !!(
        import.meta.env.AUTH_TRUST_HOST ?? import.meta.env.DEV
    );

    const handler = AstroAuthHandler(prefix, authOptions);
    return {
        get: handler,
        post: handler,
    };
}
