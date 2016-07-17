/**
 * Extended Webix AJAX (http://docs.webix.com/helpers__ajax_operations.html)
 * so that can work with server security constraints.
 *
 * Created by Phuttipong on 19/5/2559.
 */
var domain = '//localhost:8080/';

webix.extend(webix.ajax, {
    /**
     * helper method for create Webix general, non-secure GET ajax.
     * @param url path relative to domain name. no need to start with '/'
     * @param params obj of params
     * @param callbacks array of callbacks, can use object if single callback
     * @returns {*}
     */
    restGet: function (url, params, callbacks) {
        return webix.ajax().headers({
            "X-Requested-With": "XMLHttpRequest"
        }).get(domain + url, params, callbacks);
    },
    /**
     * helper method for create Webix general, non-secure POST ajax.
     * @param url path relative to domain name. no need to start with '/'
     * @param body
     * @param callbacks array of callbacks, can use object if single callback
     * @returns {*}
     */
    restPost: function (url, body, callbacks) {
        return webix.ajax().headers({
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
        }).post(domain + url, body, callbacks);
    },

    /**
     * helper method for create Webix general, non-secure DELETE ajax.
     * @param url
     * @param body
     * @param callbacks
     * @returns {*}
     */
    restDel: function (url, body, callbacks) {
        return webix.ajax().headers({
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
        }).del(domain + url, body, callbacks);
    },


    /**
     * helper method for create Webix general, secure GET ajax.
     * @param url path relative to domain name. no need to start with '/'
     * @param params obj of params
     * @param callbacks array of callbacks, can use object if single callback
     * @returns {*}
     */
    sRestGet: function (url, params, callbacks) {
        return webix.ajax().headers({
            "X-Requested-With": "XMLHttpRequest"
        }).get(domain + url, params, callbacks);
    },
    /**
     * helper method for create Webix general, secure POST ajax.
     * @param url path relative to domain name. no need to start with '/'
     * @param body
     * @param callbacks array of callbacks, can use object if single callback
     * @returns {*}
     */
    sRestPost: function (url, body, callbacks) {
        return webix.ajax().headers({
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
        }).post(domain + url, body, callbacks);
    }
});