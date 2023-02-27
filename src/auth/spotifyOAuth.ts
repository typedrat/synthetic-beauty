export const loginNonce = "csrf-nonce";
export const sessionNonce = "state-nonce";
export const sessionToken = "state-token";

function getClientId(): string {
    if (!import.meta.env.SSR) {
        throw new Error("Can't access server secrets from the client!");
    }

    const clientId = import.meta.env.SPOTIFY_CLIENT_ID;

    if (clientId === undefined || clientId.length === 0) {
        throw new Error("SPOTIFY_CLIENT_ID is empty!");
    }

    return clientId;
}

function getClientSecret(): string {
    if (!import.meta.env.SSR) {
        throw new Error("Can't access server secrets from the client!");
    }

    const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;

    if (clientSecret === undefined || clientSecret.length === 0) {
        throw new Error("SPOTIFY_CLIENT_ID is empty!");
    }

    return clientSecret;
}

export interface LoginToken {
    redirectTo: string;
}

export function loginTokenValidator(token: unknown): token is LoginToken {
    return (
        typeof token === "object" &&
        token !== null &&
        "redirectTo" in token &&
        typeof token.redirectTo === "string"
    );
}

///

function getRedirectURI() {
    return new URL(
        "/auth/spotify_redirect",
        import.meta.env.PROD
            ? "https://synthetic.beauty"
            : "http://localhost:3000"
    );
}

export function generateAuthorizationURL(
    scopes: string[],
    state?: string
): URL {
    let params = new URLSearchParams({
        client_id: getClientId(),
        response_type: "code",
        redirect_uri: getRedirectURI().toString(),
        scope: scopes.join(" "),
    });

    if (state) {
        params.append("state", state);
    }

    return new URL(`https://accounts.spotify.com/authorize?${params}`);
}

///

import Base64 from "base64-js";

export function generateTokenRequest(code: string) {
    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: getRedirectURI().toString(),
    });

    const authSlug = Base64.fromByteArray(
        new TextEncoder().encode(`${getClientId()}:${getClientSecret()}`)
    );

    return { body, authSlug };
}

export interface TokenRequestResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export function tokenRequestResponseValidator(
    resp: unknown
): resp is TokenRequestResponse {
    return (
        typeof resp === "object" &&
        resp !== null &&
        "access_token" in resp &&
        typeof resp.access_token === "string" &&
        "refresh_token" in resp &&
        typeof resp.refresh_token === "string" &&
        "expires_in" in resp &&
        typeof resp.expires_in === "number"
    );
}

///

export interface SessionData {
    spotifyAccessToken: string;
    spotifyRefreshToken: string;
    expiration: number;
}

export function sessionDataValidator(data: unknown): data is SessionData {
    return (
        typeof data == "object" &&
        data !== null &&
        "spotifyAccessToken" in data &&
        typeof data.spotifyAccessToken === "string" &&
        "spotifyRefreshToken" in data &&
        typeof data.spotifyRefreshToken === "string" &&
        "expiration" in data &&
        typeof data.expiration === "number"
    );
}
