/**
 * Created by phuttipong on 29/4/2559.
 */
module.exports = {
    devtool: 'eval-source-map',

    entry: {
        main: [
            './src/app'
        ]
    },

    output: {
        path: __dirname + '/public',
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