import type { AstroAuthConfig } from "./server";

export const authConfig: AstroAuthConfig = {
    providers: [],
    debug: import.meta.env.DEV,
};
