/**
 * This is master page which other page will be render in its subview.
 * Other view config will automatically render to ' {$subview: true}' by webbix-mvc-core
 *
 * Created by Phuttipong on 17/5/2559.
 */

var locales = require('extend/webix-mvc-core/plugins/locale');
var _ = locales._;

var tpl = function () {
    return "<img src='assets/imgs/" + $$(this.id).getValue() + ".png'/>";
};
var setLang = function () {
    locales.setLang(this.getValue());
};
var lang = {
    height: 54, cols: [
        {css: "app-lang", width: 30, view: "label", value: "en", template: tpl, click: setLang},
        {css: "app-lang", width: 30, view: "label", value: "de", template: tpl, click: setLang}
    ]
};

var toolbar = {
    view: "toolbar", type: "clean", height: 54, css: "app-toolbar", elements: [{
        template: "<a href='#link#'><img class='photo' src='#src#'></a>",
        css: "app-logo",
        width: 240,
        data: {
            link: "http://webix.com",
            src: "/api/static/nanchiang_app_logo.png"
        }
    },
        {},
        {view: "icon", icon: "envelope-o", align: "right"},
        lang
    ]
};

var menu = {
    view: "menu", id: "top:menu",
    width: 180, layout: "y", select: true,
    template: "<span class='webix_icon fa-#icon#'></span> #value# ",
    data: [
        {value: _("DashBoard"), id: "master/home", href: "#home", icon: "home"},
        {value: "New Spend", id: "master/docs.newSpend", href: "#doc/new/spend", icon: "file-text-o"},
        {$template: "Separator"},
        {value: _("Logout"), id: "logout", href: "#logout", icon: "sign-out"}

    ]
};

var ui = {
    type: "clean", rows: [toolbar, {
        cols: [
            {
                type: "clean", css: "app-left-panel",
                padding: 10, margin: 20, borderless: true, rows: [menu]
            },
            {
                rows: [{height: 10},
                    {
                        type: "clean", css: "app-right-panel", padding: 4, rows: [
                        {$subview: true}
                    ]
                    }
                ]
            }
        ]
    }]
};

module.exports = {
    $ui: ui,
    $menuId: "top:menu"
};