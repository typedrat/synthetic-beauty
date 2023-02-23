import { EncryptJWT, jwtDecrypt } from "jose";
import { v4 as uuidV4 } from "uuid";

import { getEncryptionKey } from "auth/getEncryptionKey";

export async function generateToken<T extends {}>(
    site: string,
    expiration: string | number,
    state: T
) {
    const nonce = uuidV4();
    const key = getEncryptionKey();

    const token = await new EncryptJWT({
        nonce,
        state: JSON.stringify(state),
    })
        .setProtectedHeader({ alg: "dir", enc: "A256CBC-HS512" })
        .setIssuedAt()
        .setIssuer(site)
        .setAudience(site)
        .setExpirationTime(expiration)
        .encrypt(key);

    return { nonce, token };
}

export async function validateToken<T extends {}>(
    site: string,
    nonce: string,
    token: string,
    validator: (x: {}) => x is T
): Promise<T | undefined> {
    const key = getEncryptionKey();

    const {
        payload: { nonce: payloadNonce, state },
    } = await jwtDecrypt(token, key, {
        issuer: site,
        audience: site,
    });

    const decodedState: unknown = JSON.parse(
        typeof state === "string" ? state : ""
    );

    console.debug("decodedState:", decodedState);

    if (
        nonce === payloadNonce &&
        decodedState !== undefined &&
        decodedState !== null &&
        validator(decodedState)
    ) {
        return decodedState;
    } else {
        return undefined;
    }
}

export function trivialValidator(x: {}): x is {} {
    return true;
}
