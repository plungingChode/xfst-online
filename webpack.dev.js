const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: "development",

    // no minify, no eval
    devtool: false,
    
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    "style-loader", // 2. inject style into DOM
                    "css-loader"    // 1. convert CSS to JS
                ]
            },
        ]
    },

    // add script tag of compiled main.js into this file
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ]
});