/*
 App configuration
 */

var core = require('extend/webix-mvc-core/core');
var menu = require('extend/webix-mvc-core/plugins/menu');
var user = require('extend/webix-mvc-core/plugins/user');
var locale = require('extend/webix-mvc-core/plugins/locale');

require('extend/webix/proxy');
require('extend/webix/ajax');

//configuration
var app = core.create({
    id: "tour-account-ui", //change this line!
    name: "Tour Account",
    version: "0.1.0",
    debug: true,
    start: "home"
});

//init routing
routie({
    "home": function () {
        require.ensure(['views/home'], function (require) { // this syntax is weird but it works
            require('views/home'); // when this function is called, the module is guaranteed to be synchronously available.
            app.router("home", "master/home");
        });
    },
    "doc/new/spend": function () {
        require.ensure(['views/docs/newSpend'], function (require) { // this syntax is weird but it works
            require('views/docs/newSpend'); // when this function is called, the module is guaranteed to be synchronously available.
            app.router("doc/new/spend", "master/docs.newSpend");
        });
    },
    "login": function () {
        app.router("login", "login");
    },
    "": function () {
        app.show(app.config.start);
    },
    "*": function () {
        //this refer to Routie.Route object.
        app.router(this.path, "notFound");
    }
});

app.use(user);// use login plugin
app.use(menu);// use main menu plugin
app.use(locale);// use language plugin