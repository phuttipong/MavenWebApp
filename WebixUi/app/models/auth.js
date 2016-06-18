/**
 * This model manages datas relate to user credential, user roles and permissions.
 *
 * Created by Phuttipong on 19/5/2559.
 */

"use strict";
var webix = require("webix_js");
var app = require('extend/webix-mvc-core/core');
var jsCookie = require('js-cookie/src/js.cookie');
var arrayUtil = require('utils/array');

var /***
     * Object hold user profile datas
     */
    profile = null,
    authUrl = 'api/session',
    pingUrl = 'api/session/profile',
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

//noinspection JSValidateJSDoc,JSValidateJSDoc,JSCommentMatchesSignature,JSCommentMatchesSignature
module.exports = {
    getUserProfile: function () {
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
                app.show(app.config.start);
            }
        });
    },

    logout: function () {
        stopPing();
        profile = {};
        jsCookie.remove(cookieApp);
        webix.ajax.restDel(authUrl);
    },

    refresh: function () {
        // Use the refresh-token to get a new bearer-token
    },

    status: function () {
        return isProfileValid();
    },

    /**
     * Check if user has any permission in arguments.
     * @param {string} permission1
     * @param {string} permission2
     * @param {string} etc
     * @returns {boolean}
     */
    hasAnyPermission: function () {
        if (isProfileValid()) {
            var perms = jsCookie.get(cookieApp).permissions;
            if (webix.isArray(perms)) {
                return arrayUtil.intersect(perms, arrayUtil.slice(arguments)).length != 0;
            }
        } else {
            return false;
        }
    },

    /**
     * Check if user has all permission in arguments.
     * @param {string} permission1
     * @param {string} permission2
     * @param {string} etc
     * @returns {boolean}
     */
    hasAllPermission: function () {
        if (isProfileValid()) {
            var perms = jsCookie.get(cookieApp).permissions;
            if (webix.isArray(perms)) {
                return arrayUtil.difference(arrayUtil.slice(arguments), perms).length == 0;
            }
        } else {
            return false;
        }
    }
};