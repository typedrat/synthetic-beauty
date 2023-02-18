import Base64 from "base64-js";

export function getEncryptionKey(): Uint8Array {
    const key = Base64.toByteArray(import.meta.env.ENCRYPTION_SECRET || "");
    return key;
}
