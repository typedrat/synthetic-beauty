import type { APIContext } from "astro";
import ky from "ky-universal";

import { generateToken, validateToken } from "auth/tokens";
import {
    SessionData,
    generateTokenRequest,
    loginNonce,
    loginTokenValidator,
    sessionNonce,
    sessionToken,
    tokenRequestResponseValidator,
} from "auth/spotifyOAuth";
import dayjs from "dayjs";

export async function get(ctx: APIContext): Promise<Response> {
    const site = ctx.site!.toString();
    const nonce = ctx.cookies.get(loginNonce).value;
    ctx.cookies.delete(loginNonce);
    const token = ctx.url.searchParams.get("state");

    const state = await validateToken(
        site,
        nonce || "",
        token || "",
        loginTokenValidator
    );

    if (!state) {
        console.warn("Invalid login CSRF nonce");
        return ctx.redirect("/", 302);
    }

    const { redirectTo } = state;

    ///

    const code = ctx.url.searchParams.get("code") || "";
    const { body, authSlug } = generateTokenRequest(code);

    const tokenResponse = await ky("https://accounts.spotify.com/api/token", {
        method: "POST",
        body,
        headers: {
            Authorization: `Basic ${authSlug}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const response = await tokenResponse.json();

    if (tokenRequestResponseValidator(response)) {
        const sessionExpiration = dayjs().add(30, "days");
        const tokenExpiration = dayjs().add(response.expires_in, "seconds");
        const sessionData: SessionData = {
            spotifyAccessToken: response.access_token,
            spotifyRefreshToken: response.refresh_token,
            expiration: tokenExpiration.unix(),
        };

        const { nonce, token } = await generateToken(
            ctx.site!.toString(),
            sessionExpiration.unix(),
            sessionData
        );

        ctx.cookies.set(sessionNonce, nonce, {
            expires: sessionExpiration.toDate(),
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
        });

        ctx.cookies.set(sessionToken, token, {
            expires: sessionExpiration.toDate(),
            secure: true,
            sameSite: "strict",
            path: "/",
        });

        return ctx.redirect(redirectTo, 302);
    } else {
        console.error("Invalid response from Spotify:", response);
        throw Error("Invalid response from Spotify");
    }
}
