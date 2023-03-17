import { defineConfig } from "vite";
import nodePolyfills from "rollup-plugin-polyfill-node";
import mdx from "@mdx-js/rollup";
import UnoCSS from "unocss/vite";
import { presetIcons, presetUno, presetWebFonts } from "unocss";
import { presetRadix } from "unocss-preset-radix";
import Icons from "unplugin-icons/vite";
import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import vercel from "vite-plugin-vercel";
import vercelSsr from "@magne4000/vite-plugin-vercel-ssr";

// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode }) => {
    const isProduction = mode === "production";

    return {
        plugins: [
            {
                enforce: "pre",
                ...mdx({
                    jsxRuntime: "automatic",
                    jsxImportSource: "react",
                }),
            },
            Icons({
                compiler: "jsx",
                jsx: "react",
            }),
            UnoCSS({
                presets: [
                    presetUno(),
                    presetIcons(),
                    presetRadix({
                        palette: ["amber", "gray"],
                        aliases: {
                            primary: "amber",
                            base: "gray",
                        },
                    }),
                    presetWebFonts({
                        fonts: {
                            sans: "IBM Plex Mono",
                        },
                    }),
                ],
            }),
            react(),
            ssr(),
            vercel(),
            vercelSsr(),
        ],
        server: {
            port: 3000,
        },
        esbuild: {
            drop: isProduction ? ["debugger", "console"] : undefined,
        },
        rollupOptions: {
            output: {
                preserveModules: true,
            },
        },
        ssr: {
            noExternal: ["usehooks-ts"],
        },
        vercel: {
            additionalEndpoints: [
                {
                    source: "./server/edge.ts",
                    destination: "ssr_",
                    edge: true,
                },
            ],
            prerender: false,
        },
    };
});
