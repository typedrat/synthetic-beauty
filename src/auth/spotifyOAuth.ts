export function getClientId(): string {
    const clientId = import.meta.env.SPOTIFY_CLIENT_ID;

    if (clientId === undefined || clientId.length === 0) {
        throw new Error("SPOTIFY_CLIENT_ID is empty!");
    }

    return clientId;
}

export function generateAuthorizationURL(
    client_id: string,
    state?: string
): URL {
    const redirect_uri = new URL(
        "/auth/spotify_redirect",
        window.location.href
    ).toString();

    let params = new URLSearchParams({
        client_id,
        response_type: "code",
        redirect_uri,
        scope: "streaming user-read-private user-read-email",
    });

    if (state) {
        params.append("state", state);
    }

    return new URL(`https://accounts.spotify.com/authorize?${params}`);
}
