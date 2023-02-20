import { action } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";

export type SiteTheme = "light" | "dark" | "auto";
export const siteTheme = persistentAtom<SiteTheme>("siteTheme", "auto");

export const toggleSiteTheme = action(siteTheme, "toggleSiteTheme", (store) => {
    let current = store.get();

    if (!import.meta.env.SSR && current === "auto") {
        const htmlClasses = document.documentElement.classList;

        if (htmlClasses.contains("dark-theme")) {
            current = "dark";
        } else {
            current = "light";
        }
    }

    switch (current) {
        case "light":
            store.set("dark");
            break;
        case "dark":
            store.set("light");
            break;
    }
});
