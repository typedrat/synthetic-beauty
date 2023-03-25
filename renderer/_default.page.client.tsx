import type { Root } from "react-dom/client";
import { createRoot, hydrateRoot } from "react-dom/client";
import { getPageTitle } from "./get-page-info";
import type { PageContextClient } from "./types";
import { wrappedPage } from "./wrapped-page";

import "virtual:unocss-devtools";

export const clientRouting = true;
export const hydrationCanBeAborted = true;

let root: Root | undefined;
export async function render(pageContext: PageContextClient): Promise<void> {
    const page = await wrappedPage(pageContext);
    const container = document.getElementById("page-view");

    if (!container) {
        throw new Error("Couldn't locate application container!");
    }

    if (container.innerHTML !== "" && pageContext.isHydration) {
        root = hydrateRoot(container, page);
    } else {
        if (!root) {
            root = createRoot(container);
        }

        root.render(page);
    }

    document.title = getPageTitle(pageContext);
}

export function onHydrationEnd(): void {
    console.log("Hydration finished; page is now interactive.");
}
export function onPageTransitionStart(): void {
    console.log("Page transition start");
    document.querySelector("body")?.classList.add("page-is-transitioning");
}
export function onPageTransitionEnd(): void {
    console.log("Page transition end");
    document.querySelector("body")?.classList.remove("page-is-transitioning");
}
