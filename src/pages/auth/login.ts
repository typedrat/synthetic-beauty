import type { APIContext } from "astro";
import dayjs from "dayjs";

import { isRedirectSafe } from "auth/isRedirectSafe";
import {
    LoginToken,
    generateAuthorizationURL,
    loginNonce,
    sessionNonce,
    sessionToken,
    sessionDataValidator,
} from "auth/spotifyOAuth";
import { generateToken, validateToken } from "auth/tokens";

export async function get(ctx: APIContext): Promise<Response> {
    let redirectTo = ctx.url.searchParams.get("redirect");

    if (redirectTo === null) {
        redirectTo = "/";
    } else if (!isRedirectSafe(redirectTo)) {
        console.warn("Unsafe redirection sanitized:", redirectTo);
        redirectTo = "/";
    }

    ///

    const site = ctx.site!.toString();

    if (ctx.cookies.has(sessionNonce) && ctx.cookies.has(sessionToken)) {
        const nonce = ctx.cookies.get(sessionNonce).value || "";
        const token = ctx.cookies.get(sessionToken).value || "";

        if (await validateToken(site, nonce, token, sessionDataValidator)) {
            return ctx.redirect(redirectTo, 302);
        }
    }

    ctx.cookies.delete(sessionNonce);
    ctx.cookies.delete(sessionToken);

    ///

    const expiration = dayjs().add(1, "hour");
    const { nonce, token } = await generateToken<LoginToken>(
        site,
        expiration.unix(),
        {
            redirectTo,
        }
    );

    ctx.cookies.set(loginNonce, nonce, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: expiration.toDate(),
    });

    return ctx.redirect(
        generateAuthorizationURL(
            [
                "streaming",
                "user-read-private",
                "user-read-email",
                "user-read-playback-state",
                "user-modify-playback-state",
            ],
            token
        ).toString()
    );
}
