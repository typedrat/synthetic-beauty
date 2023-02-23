import type { APIContext } from "astro";
import dayjs from "dayjs";
import ky from "ky-universal";

import {
    sessionDataValidator,
    sessionNonce,
    sessionToken,
} from "auth/spotifyOAuth";
import { validateToken } from "auth/tokens";

export async function get(ctx: APIContext): Promise<Response> {
    if (ctx.cookies.has(sessionNonce) && ctx.cookies.has(sessionToken)) {
        const site = ctx.site!.toString();
        const nonce = ctx.cookies.get(sessionNonce).value || "";
        const token = ctx.cookies.get(sessionToken).value || "";
        const state = await validateToken(
            site,
            nonce,
            token,
            sessionDataValidator
        );

        console.debug("state:", state);

        if (state) {
            const { spotifyAccessToken, expiration } = state;

            if (dayjs().isAfter(dayjs.unix(expiration))) {
                throw new Error("I can't handle expired credentials yet!");
            }

            const meBlob = await ky
                .get("https://api.spotify.com/v1/me", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${spotifyAccessToken}`,
                    },
                })
                .blob();

            return new Response(meBlob, {
                status: 200,
                statusText: "OK",
                headers: { "Content-Type": "application/json" },
            });
        }
    }

    return new Response(null, {
        status: 401,
        statusText: "Unauthorized",
    });
}
