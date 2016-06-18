/**
 * Webpack configuration
 * Created by Phuttipong on 18/6/2559.
 */
module.exports = {
    devtool: 'source-map',
    entry: {
        main: [
            './app.js'
        ]
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css'}
        ]
    },
    resolve: {
        //An array of directory names to be resolved to the current directory as well as its ancestors, and searched for modules
        modulesDirectories: ['node_modules', 'libs', 'app'],
        //Replace modules with other modules or paths
        alias: {
            "webix_base": "webix/codebase",
            "webix_js": "webix/codebase/webix_debug"
        }
    },
    externals: {
        // require("webix_js") is external and available
        //  on the global var webix
        "webix_js": "webix"
    }
};