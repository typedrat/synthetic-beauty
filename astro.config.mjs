import { defineConfig } from "astro/config";
import Icons from "unplugin-icons/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
    site: "https://synthetic.beauty",
    integrations: [react()],
    output: "server",
    adapter: vercel(),

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    includePaths: ["./src"],
                },
            },
        },
        plugins: [Icons({ compiler: "jsx", jsx: "react" })],
    },
});
