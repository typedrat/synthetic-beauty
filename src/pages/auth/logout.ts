import type { APIContext } from "astro";

import { sessionNonce, sessionToken } from "auth/spotifyOAuth";

export function get(ctx: APIContext) {
    ctx.cookies.delete(sessionNonce);
    ctx.cookies.delete(sessionToken);

    return ctx.redirect("/", 302);
}
