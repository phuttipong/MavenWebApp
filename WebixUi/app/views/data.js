var records = require('models/movie');

var ui = {
    view: "datatable", autoConfig: true
};

module.exports = {
    $ui: ui,
    $onInit: function (view) {
        view.parse(records.data);
    }
};