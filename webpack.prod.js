const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: "production",

    // hash in filename to force cache refresh
    output: {
        filename: "main-[contenthash].js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, // 2. convert JS to CSS file
                    "css-loader"    // 1. convert CSS to JS
                ]
            },
        ]
    },
    plugins: [
        // clean dist folder before build
        new CleanWebpackPlugin(),

        // separate CSS from main.js
        new MiniCssExtractPlugin({
            filename: "[name]-[contenthash].css"
        }),

        // link main.js to main HTML file + minify
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ],
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin()
        ]
    }
});