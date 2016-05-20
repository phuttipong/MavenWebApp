var debug_export = false;

var gulp = require('gulp');
var glob = require('glob');

var _if = require('gulp-if');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var less = require('gulp-less');
var rimraf = require('gulp-rimraf');
var replace = require("gulp-replace");
var jshint = require("gulp-jshint");

gulp.task("css", function () {
    return build_css();
});

function build_css() {
    return gulp.src('./assets/*.css')
        .pipe(gulp.dest('./deploy/assets'));
}

gulp.task('js', function () {
    return build_js();
});

function build_js(prod) {
    //create list of module-name in views folder
    var views = glob.sync("views/**/*.js").map(function (value) {
        return value.replace(".js", ""); //Relative module names are relative to other names, not paths
    });
    //create list of module-name in views folder
    var locales = glob.sync("locales/**/*.js").map(function (value) {
        return value.replace(".js", "");//Relative module names are relative to other names, not paths
    });

    return rjs({
        //the root path to use for all module lookups.
        // So in the above example, "my/module"'s script tag will have a src="/another/path/my/module.js".
        // baseUrl is not used when loading plain .js files (indicated by a dependency string starting with a slash, has a protocol, or ends in .js)
        baseUrl: './',
        out: 'app.js',
        //insertRequire build setting to insert a require call for the main module --
        // that serves the same purpose of the initial require() call that data-main does.
        insertRequire: ["app"],
        //path mappings for module names not found directly under baseUrl.
        // The path settings are assumed to be relative to baseUrl,
        // unless the paths setting starts with a "/" or has a URL protocol in it ("like http:").
        // Using the above sample config, "some/module"'s script tag will be src="/another/path/some/v1.0/module.js"
        paths: {
            "locale": "empty:",
            "text": 'libs/text'
        },
        //An array of dependencies to load. Useful when require is defined as a config object before require.js is loaded,
        // and you want to specify dependencies to load as soon as require() is defined. Using deps is just like doing a require([]) call.
        deps: ["app"],
        //A replacement [AMD] loader for[RequireJS].
        // It provides a minimal AMD API footprint that includes [loader plugin] support.
        // Only useful for built/bundled AMD modules, does not do dynamic loading.
        include: ["libs/almond/almond.js"].concat(views).concat(locales)
    })
        .pipe(_if(debug_export, sourcemaps.init()))
        .pipe(_if(prod == true, uglify()))
        .pipe(_if(prod == true, replace("localhost:8080", "tour.tst.co.th")))
        .pipe(_if(debug_export, sourcemaps.write("./")))
        .pipe(gulp.dest('./deploy/'));
}

function build_assets() {
    return gulp.src("./assets/imgs/**/*.*")
        .pipe(gulp.dest("./deploy/assets/imgs/"));
}

function build_index() {
    var build = (new Date()) * 1;

    return gulp.src("./index.html")
        .pipe(replace('data-main="app" src="libs/requirejs/require.js"', 'src="app.js"'))
        .pipe(replace('<script type="text/javascript" src="libs/less/dist/less.min.js"></script>', ''))
        .pipe(replace(/rel\=\"stylesheet\/less\" href=\"(.*?)\.less\"/g, 'rel="stylesheet" href="$1.css"'))
        .pipe(replace(/\.css\"/g, '.css?' + build + '"'))
        .pipe(replace(/\.js\"/g, '.js?' + build + '"'))
        .pipe(replace("require.config", "webix.production = true; require.config"))
        .pipe(replace(/libs\/webix\/codebase\//g, '//cdn.webix.com/edge/'))

        .pipe(gulp.dest("./deploy/"));
}

function build_server() {
    return gulp.src(["./server/**/*.*",
        "!./server/*.log", "!./server/config.*",
        "!./server/dev/**/*.*", "!./server/dump/**/*.*"])
        .pipe(gulp.dest("./deploy/server/"))
}

gulp.task("clean", function () {
    return gulp.src("deploy/*", {read: false}).pipe(rimraf());
});

gulp.task('build', ["clean"], function () {
    //event-stream's merge function merge streams from different methods.
    return require('event-stream').merge(
        build_js(true),
        build_css(),
        build_assets(),
        build_index()
    );

});

gulp.task('test', ["clean"], function () {

    return require('event-stream').merge(
        build_js(),
        build_css(),
        build_assets(),
        build_index());

});

gulp.task('lint', function () {
    return gulp.src(['./views/**/*.js', './helpers/**/*.js', './models/**/*.js', './*.js', "!./\.jshintrc"])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});