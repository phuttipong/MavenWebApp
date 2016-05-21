/**
 * Plug-able feature for webix-mvc-core. It give abilities to manage view accessibility.
 * This class will confer with a model class periodically and show login page if credential not provided.
 *
 * Updated by Phuttipong on 17/5/2559.
 */
define([
    "models/auth",
    "libs/routie/dist/routie"
], function (auth) {

    var config = {
        login: "#!/login",
        afterLogin: "",
        afterLogout: "#!/login",
        ping: 5 * 60 * 1000
    };

    var session = auth.session;

    //check user's status
    function ping() {
        if (auth.getCurrentUser())
            session.status().then(function (status) {
                if (!status)
                    try_to_logout();
            });
        else
            try_to_logout();
    }

    //show inner or external link
    function show(url) {
        if (url.indexOf("#") === 0)
            require(["app"], function (app) {
                app.show(url.substr(2));
            });
        else
            document.location.href = url;
    }

    //reaction on logout link
    function try_to_logout() {
        if (auth.getCurrentUser())
            auth.logout();
        show(config.afterLogout);
    }

    //reaction on login link
    function try_to_login() {
        if (auth.getCurrentUser()) {
            session.status().then(function (status) {
                if (status)
                    show(config.afterLogin);
                else
                    require(["app"], function (app) {
                        app.show("/login");
                    });
            });
        }
        else
            require(["app"], function (app) {
                app.show("/login");
            });
    }

    routie("!/logout", try_to_logout);

    return {

        // called one-time
        $oninit: function (app, newconfig) {
            if (newconfig)
                webix.extend(config, newconfig, true);

            if (config.ping)
                setInterval(ping, config.ping);

            config.afterLogin = config.afterLogin || ("#!" + app.config.start);
        },

        // every time url changed
        $onurl: function (url) {
            ping();
        },
        login: try_to_login,
        logout: try_to_logout,
        afterLogin: function (response) {
            webix.delay(function () {
                show(config.afterLogin)
            });
        }
    };
});