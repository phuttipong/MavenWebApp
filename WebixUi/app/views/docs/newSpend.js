/**
 * New spending form view.
 *
 * Created by Phuttipong on 13/6/2559.
 */
var webix = require("webix_js");
var popup;

module.exports = {
    $ui: {
        template: "newDoc"
    },
    $onRender: function () {
        popup = webix.ui({
            view: "popup",
            body: "Data is updated"
        });
        popup.show({x: 300, y: 300});
    },
    $onDestroy: function () {
        popup.destructor();
    }

};