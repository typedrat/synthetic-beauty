import { AstroAuth, authConfig } from "auth";

export const { get, post } = AstroAuth(authConfig);
