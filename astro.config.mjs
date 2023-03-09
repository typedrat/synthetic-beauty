import { defineConfig } from "astro/config";
import Icons from "unplugin-icons/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/edge";

// https://astro.build/config
export default defineConfig({
    site: "https://synthetic.beauty",
    integrations: [react()],
    output: "server",
    adapter: vercel({ analytics: true }),

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
