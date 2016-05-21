/*
 App configuration
 */

define([
    "libs/webix-mvc-core/core",
    "libs/webix-mvc-core/plugins/menu",
    "extend/webix-mvc-core/plugins/user",
    "extend/webix/proxy",
    "extend/webix/ajax"
], function (core, menu, user) {

    //configuration
    var app = core.create({
        id: "tour-account-ui", //change this line!
        name: "Tour Account",
        version: "0.1.0",
        debug: true,
        start: "/top/start"
    });

    app.use(menu);

    // This enables user-control (login)
    app.use(user);


    return app;
});
