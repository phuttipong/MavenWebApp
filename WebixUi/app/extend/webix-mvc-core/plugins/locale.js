/**
 * This is Webix Jet plugin that add localization capability.
 *
 * Created by Webix teams aka Webix Jet.
 *
 * Modified by Phuttipong on 17/5/2559.
 */
var webix = require("webix_js");
var polyglot = require('polyglot/build/polyglot');

var defaultLang = "en";
var key = "--:app:lang";

function _get_lang() {
    return webix.storage.local.get(key);
}
function _set_lang(lang) {
    if (lang != _get_lang()) {
        webix.storage.local.put(key, lang);
        document.location.reload();
    }
}

function afterFetch(lang, data) {
    var poly = new polyglot({phrases: data});
    poly.locale(lang);

    webix.i18n.setLocale(lang);
    module.exports = {
        setLang: _set_lang,
        getLang: _get_lang,
        _: webix.bind(poly.t, poly)
    };
}

function create_locale(lang) {
    // asynchronous fetch locale data.
    var data;
    switch (lang) {
        case "de":
            require.ensure(['webix_base/i18n/de', 'locales/de'], function (require) {
                data = require('locales/de');
                afterFetch(lang, data);
            });
            break;
        default:
            require.ensure(['webix_base/i18n/en', 'locales/en'], function (require) {
                data = require('locales/en');
                afterFetch(lang, data);
            });
    }
}

module.exports = {
    $onInit: function (app, config) {
        key = (app.config.id || "") + key;

        var lang = _get_lang() || config.lang || defaultLang;
        _set_lang(lang);
        create_locale(lang);
    }
};