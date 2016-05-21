/**
 * This model manages datas relate to user credential, user roles and permissions.
 *
 * Created by Phuttipong on 19/5/2559.
 */
define(['libs/js-cookie/src/js.cookie'], function (jsCookie) {

    "use strict";

    var /***
         * Object hold user profile datas
         */
        profile = null,
        authUrl = 'api/login',
        pingUrl = 'sc/auth/profile',
        cookieApp = 'tas520vdlvcd',
        pingTaskId = null,
        pingRetryCount = 0
        ;

    profile = jsCookie.getJSON(cookieApp) || {};

    /**
     * Ping to server to update profile if needed.
     * ping only profile older than 12 minutes.
     */
    function ping() {
        if (isProfileValid() &&
            Date.now() - profile.timestamp > 12 * 60 * 1000)
            webix.ajax.sRestGet(pingUrl, null, {
                success: function (text, data) {
                    updateProfile(data.json());
                    pingRetryCount = 0;
                },
                error: function () {
                    if (pingRetryCount <= 5) {
                        webix.delay(ping, this, null, 30000); // try again in 30 seconds.
                        pingRetryCount++;
                    }
                }
            })
    }

    /**
     * Start a task that ping every 1 minutes
     */
    function startPing() {
        if (pingTaskId == null)
            pingTaskId = setInterval(ping, 60 * 1000)
    }

    startPing();

    function stopPing() {
        var id = pingTaskId;
        pingTaskId = null;
        clearInterval(id);
    }


    function isProfileValid() {
        //Profile will valid for 15 minutes
        return (15 * 60 * 1000 + (profile.timestamp || 0)) > Date.now();
    }

    function updateProfile(data) {
        profile = data;
        jsCookie.set(cookieApp, data);
    }

    return {
        getCurrentUser: function () {
            return jsCookie.get(cookieApp);
        },

        login: function (username, password, component) {

            webix.extend(component, webix.ProgressBar);
            component.disable();
            component.showProgress();

            // var collection = new webix.DataCollection({url: authUrl});

            webix.ajax.restPost(authUrl, {
                "username": username,
                "password": password
            }, {
                error: function () {
                    // If error
                    component.enable();
                    component.hideProgress();
                },
                success: function (text, data) {
                    updateProfile(data.json());
                    require(["app"], function (app) {
                        app.show(app.config.start);
                    });
                }
            });
        },

        logout: function () {
            stopPing();
            profile = {};
            jsCookie.remove(cookieApp);
        },

        refresh: function () {
            // Use the refresh-token to get a new bearer-token
        },

        session: {
            status: function () {
                return new Promise(function (resolve, reject) {
                    if (isProfileValid())
                        resolve(true);
                    else
                        resolve(false);
                });
            }
        }
    };
});
