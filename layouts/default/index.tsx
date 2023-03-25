import * as React from "react";
import { useEffect } from "react";
import { useDarkMode } from "usehooks-ts";
import type { LayoutArgs } from "@/renderer/types";
import { NavBar } from "./navbar";

export function LayoutDefault({ children }: LayoutArgs): JSX.Element {
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        const root = document.getElementById("page-view");

        if (root) {
            if (isDarkMode) {
                root.classList.add("dark-theme");
            } else {
                root.classList.remove("dark-theme");
            }
        }
    }, [isDarkMode]);

    return (
        <div className="overflow-x-hidden color-base12 bg-base1 font-sans text-base lg:text-lg xl:text-xl">
            <div className="grid grid-rows-[auto_1fr_auto] min-h-screen sm:container sm:mx-auto">
                <header className="sm:-mx-100vw sm:px-100vw bg-primary3 border-primary9 border-b-0.25em">
                    <NavBar />
                </header>
                <main className="lt-sm:p-x-0.25em">{children}</main>
                <footer className="sm:-mx-100vw sm:px-100vw py border-primary9 border-t-0.25em">
                    <p className="m-b-1em">
                        Made by{" "}
                        <a
                            className="text-primary9 @hover:text-primary12 @hover:underline"
                            href="https://github.com/typedrat"
                            rel="noopener"
                            target="_blank"
                        >
                            Alexis Williams
                        </a>{" "}
                        with{" "}
                        <a
                            className="text-primary9 @hover:text-primary12 @hover:underline"
                            href="https://vite-plugin-ssr.com/"
                            rel="noopener"
                            target="_blank"
                        >
                            vite-plugin-ssr
                        </a>{" "}
                        (and lots of 🥰 and 🐀).
                    </p>
                    <small>
                        <p>
                            <a
                                className="text-primary9 @hover:text-primary12 @hover:underline"
                                href="https://github.com/typedrat/synthetic-beauty"
                                rel="noopener"
                                target="_blank"
                            >
                                The source code
                            </a>{" "}
                            is available under the terms of the{" "}
                            <a
                                className="text-primary9 @hover:text-primary12 @hover:underline"
                                href="https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)"
                                rel="noopener"
                                target="_blank"
                            >
                                GNU Affero GPL, version 3.0
                            </a>{" "}
                            or later.
                        </p>
                    </small>
                </footer>
            </div>
        </div>
    );
}
