/**
 * Extended Webix proxy (http://docs.webix.com/desktop__server_proxy.html)
 * so that can work with server security constraints.
 *
 * Created by Phuttipong on 17/5/2559.
 */
define([], function () {

    var domain = '//localhost:8080/';

    /**
     * override Webix json proxy.
     * add required headers to work with RESTful server api.
     */
    webix.proxy.json = {
        $proxy: true,
        load: function (view, callback) {
            var ajax = webix.ajax().headers({
                "X-Requested-With": "XMLHttpRequest"
            });
            this.source = domain + this.source;
            return ajax.get(this.source, callback, view);
        },
        save: function (view, update, dp, callback) {
            var ajax = webix.ajax()
                .headers({
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json"
                });

            this.source = domain + this.source;
            return webix.proxy.rest._save_logic.call(this, view, update, dp, callback, ajax);
        }
    };

    /**
     * new Webix data proxy for server which implement StatelessAuthenticationService
     *
     **/
    webix.proxy.jsonSecure = {
        $proxy: true,
        load: function (view, callback) {
            var ajax = webix.ajax().headers({
                "X-Requested-With": "XMLHttpRequest"
            });
            this.source = domain + this.source;
            return ajax.get(this.source, callback, view);
        },
        save: function (view, update, dp, callback) {
            var ajax = webix.ajax().headers({
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json"
            });
            this.source = domain + this.source;
            return webix.proxy.rest._save_logic.call(this, view, update, dp, callback, ajax);
        }
    };
});