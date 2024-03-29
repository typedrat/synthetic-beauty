const { resolve } = require("node:path");

const project = resolve(__dirname, "tsconfig.json");

module.exports = {
    root: true,
    extends: [
        require.resolve("@vercel/style-guide/eslint/browser"),
        require.resolve("@vercel/style-guide/eslint/node"),
        require.resolve("@vercel/style-guide/eslint/typescript"),
        require.resolve("@vercel/style-guide/eslint/react"),
    ],
    parserOptions: {
        project,
    },
    settings: {
        "import/resolver": {
            typescript: {
                project,
            },
        },
    },
    rules: {
        "import/no-default-export": "off",
        "no-console": "off",
        "no-else-return": "off",
    },
};
