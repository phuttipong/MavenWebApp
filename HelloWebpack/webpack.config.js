/**
 * Created by phuttipong on 29/4/2559.
 */
module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname + "/deploy",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"}
        ]
    }
};