import Base64 from "base64-js";

export function getEncryptionKey(): Uint8Array {
    if (import.meta.env.SSR) {
        const key = Base64.toByteArray(import.meta.env.ENCRYPTION_SECRET || "");
        return key;
    } else {
        throw new Error("Can't access server secrets from the client!");
    }
}
