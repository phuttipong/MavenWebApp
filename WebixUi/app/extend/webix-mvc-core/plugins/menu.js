/**
 * This is Webix Jet plugin that help us select menu item automatically.
 *
 * Created by Webix teams aka Webix Jet.
 *
 * Modified by Phuttipong on 17/5/2559.
 */

function select_menu(menu_id, id) {
    var menu = $$(menu_id);
    if (menu.setValue)
        menu.setValue(id);
    else if (menu.select && menu.exists(id))
        menu.select(id);
}

function get_menu(scope) {
    if (scope.parent)
        return scope.parent.module.$menuId || get_menu(scope.parent);
}

module.exports = {

    $onAfterPathProcess: function (ui, viewName, viewParts, viewPath) {
        //menu handling
        if (ui.$menuId && viewPath) {
            select_menu(ui.$menuId, viewPath);
        }
    }
};