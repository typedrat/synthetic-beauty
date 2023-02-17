const fakeUrl = new URL("http://invalid/fake_url");

export function isRedirectSafe(redirect: string): boolean {
    const redirectUrl = new URL(redirect, fakeUrl);

    if (redirectUrl.origin !== fakeUrl.origin) {
        console.warn("Redirection isn't relative");
        return false;
    }

    const redirectPathSegments = redirectUrl.pathname.split("/").slice(1, -1);

    if (redirectPathSegments.at(0) === "auth") {
        console.warn("/auth/ URLs are always unsafe");
        return false;
    }

    return true;
}
