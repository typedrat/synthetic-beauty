import cloudflareWorkersAdapter from "@hattip/adapter-cloudflare-workers";
import { handler } from "./handler";

export default {
    fetch: cloudflareWorkersAdapter(handler),
};
