import type { APIContext } from "astro";

export async function get(ctx: APIContext) {
    let readableParams: string[] = [];

    ctx.url.searchParams.forEach((v, k) => readableParams.push(`${k} = ${v}`));

    return {
        body: readableParams.join("\n"),
    };
}
