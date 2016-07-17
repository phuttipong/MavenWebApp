var prod_domain = "tour.tst.co.th";
var test_domain = "localhost:8080";
var deploy_path = "./deploy/";
var test_deploy_path = "../target/ROOT/";

var gulp = require('gulp');
var webpack = require('webpack');
var webpackStr = require('webpack-stream');

var _if = require('gulp-if');

var less = require('gulp-less');
var rimraf = require('gulp-rimraf');
var replace = require("gulp-replace");
var jshint = require("gulp-jshint");

gulp.task("css", function () {
    return build_css();
});

function build_css() {
    return gulp.src('./assets/*.css')
        .pipe(gulp.dest((deploy_path) + 'assets'));
}

gulp.task('js', function () {
    return build_js();
});

function webpack_config(prod) {
    var config = require('./webpack.config');

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

    return gulp.src('./app.js')
        .pipe(webpackStr(webpack_config(prod)))
        .pipe(_if(prod == true, replace(test_domain, prod_domain)))
        .pipe(gulp.dest(deploy_path));
}

gulp.task("clean", function () {
    return gulp.src(deploy_path + "*", {read: false})
        .pipe(rimraf());
});

function build_assets() {
    return gulp.src("./assets/imgs/**/*.*")
        .pipe(gulp.dest((deploy_path) + "assets/imgs/"));
}

function build_index() {
    var build = (new Date()) * 1;

    return gulp.src("./index.html")
        .pipe(replace('<script type="text/javascript" src="libs/less/dist/less.min.js"></script>', ''))
        .pipe(replace('<script type="text/javascript" src="libs/js-cookie/src/js.cookie.js"></script>', ''))
        .pipe(replace(/rel\=\"stylesheet\/less\" href=\"(.*?)\.less\"/g, 'rel="stylesheet" href="$1.css"'))
        .pipe(replace(/\.css\"/g, '.css?' + build + '"'))
        .pipe(replace(/\.js\"/g, '.js?' + build + '"'))
        .pipe(replace(/libs\/webix\/codebase\//g, '//cdn.webix.com/edge/'))
        .pipe(gulp.dest(deploy_path));
}

gulp.task('build', ["clean"], function () {

    return require('event-stream').merge(
        build_js(true),
        build_css(),
        build_assets(),
        build_index());

});

gulp.task('build-dev', ["clean"], function () {

    return require('event-stream').merge(
        build_js(),
        build_css(),
        build_assets(),
        build_index());

});

gulp.task('refresh', ["build-dev"], function () {

    //delete old version
    gulp.src([
        test_deploy_path + "*.{js,html}",
        test_deploy_path + "asset"
    ], {read: false})
    //for safety
    //Files and folders outside the current working directory can be removed with force option.
    //rimraf({ force: true })
        .pipe(rimraf({force: true}));

    //copy new files to target folder.
    gulp.src(deploy_path + "**").pipe(gulp.dest(test_deploy_path));
});

gulp.task('lint', function () {
    return gulp.src(['./views/**/*.js', './helpers/**/*.js', './models/**/*.js', './*.js', "!./\.jshintrc"])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});