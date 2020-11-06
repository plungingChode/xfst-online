module.exports = {
    // define imports (js and css)
    entry: "./src/index.js",

    // merge css into main.js
    module: {
        rules: [
            {
                test: /\.php$/i,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]"
                }
            },
            {
                test: /xfst$/i,
                loader: "file-loader",
                options: {
                    name: "[name]"
                }
            }
        ]
    },
}