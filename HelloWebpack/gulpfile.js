var prod_domain = "tour.tst.co.th";
var test_domain = "localhost:8080";
var prod_deploy_path = "./deploy/";
//"../../../Apache Tomcat/apache-tomcat-8.0.20/webapps/ROOT/WEB-INF/classes/uiDevAsset/";
var test_deploy_path = "./deploy/";

var gulp = require('gulp');
var webpack = require('webpack');
var webpackStr = require('webpack-stream');

var _if = require('gulp-if');
var rimraf = require('gulp-rimraf');
var replace = require("gulp-replace");

gulp.task("css", function () {
    return build_css();
});

function build_css(prod) {
    return gulp.src('./assets/*.css')
        .pipe(gulp.dest((prod ? prod_deploy_path : test_deploy_path) + 'assets'));
}

gulp.task('js', function () {
    return build_js();
});

function webpack_config(prod) {
    var config = {
        devtool: 'eval-source-map',
        entry: {
            main: [
                './router.js'
            ]
        },
        output: {
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

    if (prod) {
        config.devtool = false;
        config.plugins = [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true
                },
                comments: false,
                sourceMap: false
            }),
            new webpack.DefinePlugin({
                'process.env': {NODE_ENV: JSON.stringify('production')}
            }),
            // This plugin prevents Webpack from creating chunks
            // that would be too small to be worth loading separately
            new webpack.optimize.MinChunkSizePlugin({
                minChunkSize: 51200 // ~50kb
            }),
            new webpack.optimize.DedupePlugin()
        ];
    }

    return config;
}

function build_js(prod) {

    return gulp.src('./router.js')
        .pipe(webpackStr(webpack_config(prod)))
        .pipe(_if(prod == true, replace(test_domain, prod_domain)))
        .pipe(gulp.dest(prod ? prod_deploy_path : test_deploy_path));
}

function build_assets(prod) {
    return gulp.src("./assets/imgs/**/*.*")
        .pipe(gulp.dest((prod ? prod_deploy_path : test_deploy_path) + "assets/imgs/"));
}

function build_index(prod) {
    var build = (new Date()) * 1;

    return gulp.src("./index.html")
        .pipe(replace('data-main="app" src="libs/requirejs/require.js"', 'src="app.js"'))
        .pipe(replace('<script type="text/javascript" src="libs/less/dist/less.min.js"></script>', ''))
        .pipe(replace(/rel\=\"stylesheet\/less\" href=\"(.*?)\.less\"/g, 'rel="stylesheet" href="$1.css"'))
        .pipe(replace(/\.css\"/g, '.css?' + build + '"'))
        .pipe(replace(/\.js\"/g, '.js?' + build + '"'))
        .pipe(replace("require.config", "webix.production = true; require.config"))
        .pipe(replace(/libs\/webix\/codebase\//g, '//cdn.webix.com/edge/'))

        .pipe(gulp.dest(prod ? prod_deploy_path : test_deploy_path));
}

gulp.task("clean", function () {
    return gulp.src(prod_deploy_path + "*", {read: false}).pipe(rimraf());
});

gulp.task("clean-test", function () {
    //for safety
    //Files and folders outside the current working directory can be removed with force option.
    //rimraf({ force: true })
    return gulp.src(test_deploy_path + "*", {read: false}).pipe(rimraf());
});

gulp.task('build', ["clean"], function () {
    //event-stream's merge function merge streams from different methods.
    return require('event-stream').merge(
        build_js(true),
        build_css(true),
        build_assets(true),
        build_index(true)
    );

});

gulp.task('test', ["clean-test"], function () {

    return require('event-stream').merge(
        build_js(),
        build_css(),
        build_assets(),
        build_index());

});