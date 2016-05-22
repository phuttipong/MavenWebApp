/**
 * Created by phuttipong on 29/4/2559.
 */

var webpack = require('webpack');

/*
 * Default webpack configuration for development
 */
var config = {
    devtool: 'eval-source-map',

    entry: {
        main: [
            './router.js'
        ]
    },

    output: {
        path: __dirname + '/deploy',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel', query: {
                presets: ['es2015', 'react']
            }
            },
            {test: /\.css$/, loader: 'style!css'}
        ]
    }
};

/*
 * If bundling for production, optimize output
 */
if (process.env.NODE_ENV === 'production') {
    config.devtool = false;
    config.plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({comments: false}),
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify('production')}
        })
    ];
}

module.exports = config;