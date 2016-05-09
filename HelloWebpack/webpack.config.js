/**
 * Created by phuttipong on 29/4/2559.
 */
module.exports = {
    entry: "./src/main.js",
    output: {
        path: __dirname + "/deploy",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: "style!css"
            }
        ]
    }
};