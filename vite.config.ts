import { defineConfig } from "vite";
import mdx from "@mdx-js/rollup";
import UnoCSS from "unocss/vite";
import { presetIcons, presetUno, presetWebFonts } from "unocss";
import { presetRadix } from "unocss-preset-radix";
import Icons from "unplugin-icons/vite";
import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";

export default defineConfig(({ mode }) => {
    const isProduction = mode === "production";

    return {
        esbuild: {
            drop: isProduction ? ["debugger", "console"] : undefined,
        },
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
        ],
        resolve: {
            alias: {
                "@": __dirname,
            },
        },
        rollupOptions: {
            output: {
                preserveModules: true,
            },
        },
        server: {
            port: 3000,
        },
        ssr: {
            noExternal: ["usehooks-ts"],
        },
    };
});
