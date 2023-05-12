const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        background: "./src/background.js",
        options: "./src/options.js",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "styles/[name].css",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "static"
                }
            ],
        }),
    ],
};