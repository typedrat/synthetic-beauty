const { resolve } = require("node:path");

const project = resolve(__dirname, "tsconfig.json");

module.exports = {
    parserOptions: {
        project,
    },
    settings: {
        "import/resolver": {
            typescript: {
                project,
            },
        },
    }
}
