import type { PageContext } from "./types";

export function getPageTitle(pageContext: Pick<PageContext, "exports">): string {
    const title = pageContext.exports.documentProps?.title;
    return title ? `${title} | Synthetic Beauty` : "Synthetic Beauty";
}

export function getPageDescription(pageContext: Pick<PageContext, "exports">): string {
    return (
        pageContext.exports.documentProps?.description ??
        "Synthetic Beauty is a website for creating programmatic music visualizers."
    );
}
