export function getClientId(): string {
    const clientId = import.meta.env.SPOTIFY_CLIENT_ID;

    if (clientId === undefined || clientId.length === 0) {
        throw new Error("SPOTIFY_CLIENT_ID is empty!");
    }

    return clientId;
}

export function getVerifier(): string {
    const verifierKey = "spotify_verifier";

    const storedUUID = window.localStorage.getItem(verifierKey);

    if (storedUUID !== null) {
        return storedUUID;
    } else {
        const generatedUUID = crypto.randomUUID();

        window.localStorage.setItem(verifierKey, generatedUUID);
        return generatedUUID;
    }
}

export async function generateChallenge(verifier: string): Promise<string> {
    const bytes = new TextEncoder().encode(verifier);
    const rawHash = await crypto.subtle.digest("SHA-256", bytes);
    const hashArray = Array.from(new Uint8Array(rawHash));
    const hash = hashArray.map((x) => x.toString(16).padStart(2, "0")).join("");
    return hash;
}

export function generateAuthorizationURL(
    client_id: string,
    code_challenge: string,
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
        code_challenge_method: "S256",
        code_challenge,
    });

    if (state) {
        params.append("state", state);
    }

    return new URL(`https://accounts.spotify.com/authorize?${params}`);
}
