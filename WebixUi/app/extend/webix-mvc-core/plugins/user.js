/**
 * Plug-able feature for webix-mvc-core. It give abilities to manage view accessibility.
 * This class will confer with a model class periodically and show login page if credential not provided.
 *
 * Created by Webix teams aka Webix Jet.
 *
 * Modified by Phuttipong on 17/5/2559.
 */

var auth = require('models/auth');
require('routie/dist/routie');

var config = {
    login: "login",
    afterLogin: "home",
    logout: "logout",
    afterLogout: "login",
    ping: 5 * 60 * 1000
};

routie(config.logout, try_to_logout);

//check user's status
function ping() {
    if (auth.getUserProfile())
        if (auth.status())
            return true;

    try_to_logout();
    return false;
}

//reaction on logout link
function try_to_logout() {
    if (auth.getUserProfile())
        auth.logout();
    routie.navigate(config.afterLogout);
}

//reaction on login link
function try_to_login() {
    if (auth.getUserProfile()) {
        auth.status().then(function (status) {
            if (status)
                routie.navigate(config.afterLogin);
            else
                routie.navigate(config.login);
        });
    }
    else
        routie.navigate(config.login);
}

module.exports = {

    // called one-time
    $onInit: function (app, newconfig) {
        if (newconfig)
            webix.extend(config, newconfig, true);

        if (config.ping)
            setInterval(ping, config.ping);

        config.afterLogin = config.afterLogin || (app.config.start);

        ping();
    },

    $onBeforeRoute: function (hash) {
        if (hash !== config.login)
            return ping();
    },
    login: try_to_login,
    logout: try_to_logout,
    afterLogin: function () {
        webix.delay(function () {
            routie.navigate(config.afterLogin);
        });
    }
};