/**
 * This is class which control navigation and view rendering process.
 *
 * Plugin's property
 *
 * $onInit
 * The callback is called immediately when this.use() was called.
 * @param {Object} ui
 * @param {string} viewName
 * @param {Object[]} viewParts
 * @param {String} viewPaths
 * @param layout
 *
 * $onBeforeRoute
 * The callback is called before process hashbang. return false to stop process.
 * @param {string} hash - Hashbang.
 * @param {string} viewPath - Full view path.
 *
 * $onBeforePathProcess
 * The callback is called before render view. return false to stop process.
 * @param {Object} ui - View configuration(Webix).
 * @param {string} viewName - The processing view.
 * @param {Object[]} views - List of view fragment.
 * @param {string} viewPath - Full view path.
 * @param {Object} layout - Layout configuration(Webix).
 *
 * $onAfterPathProcess
 * The callback is called after render view.
 * @param {Object} ui - View configuration(Webix).
 * @param {string} viewName - The processing view.
 * @param {Object[]} views - List of view fragment.
 * @param {string} viewPath - Full view path.
 * @param {Object} layout - Layout configuration(Webix).
 *
 * View's property
 *
 * $ui
 * The Webix Ui configuration in case of view has multiple properties.
 *
 * $menuId
 * The Webix Ui id of menu.
 *
 * $onBeforeSubview
 * The callback is called after process view path. return false to stop subview rendering process.
 * @param {Object} ui - View configuration(Webix).
 * @param {string} viewName - The processing view.
 * @param {Object[]} views - List of view fragment.
 * @param {string} viewPath - Full view path.
 * @param {Object} layout - Layout configuration(Webix).
 *
 * $onRender
 * The callback is called after render view (for the first time).
 * @param {Object} ui - View configuration(Webix).
 * @param {Object} layout - Layout configuration(Webix).
 *
 * $onDestroy
 * The method is called each time when a view is destroyed. It can be used to destroy temporary objects
 * (such as popups and event handlers) and prevent memory leaks. *
 * Notice that the change of the url won’t call $ondestroy for the views that present in the new url *
 * for example
 * $onRender:function(view,$scope){
 *      popup = webix.ui({..});
 *      eventid = records.data.attachEvent("onDateUpdate", function  popup.show(); });
 *      view.parse(records.data);
 *  },
 * $onDestroy:function(){
 *      popup.destructor();
 *      records.detachEvent(eventid);
 *  }
 *
 *  $windows
 *  It allows creating several windows at once when the current view is shown and destruct them when the current view is destroyed.
 *  for example
 *  {
 *      $ui: {
 *          view:"datatable", on:{
 *               onItemClick:function(){
 *                  $$("win2").show();
 *              }
 *          }
 *      },
 *      $windows:[
 *          { view:"window", id:"win1" },
 *          { view:"popup", id:"win2" }
 *      ],
 *      $onRender:function(view,$scope){
 *          view.parse(records.data);
 *          $$("win1").show();
 *      },
 *  }
 *
 * Created by Webix teams aka Webix Jet.
 *
 * Modified by Phuttipong on 17/5/2559.
 */

require('routie/dist/routie');
var webix = require("webix_js");
var arrayUtil = require('utils/array');

function show(path, config) {
    if (config == -1)
        return render_sub_stack(this, path);
    if (this._subs[path])
        return render_sub_stack(this._subs[path], config);


    var scope = get_app_scope(this);
    var index = this.index;

    if (typeof path == "string") {

        //child page
        if (path.indexOf("./") === 0) {
            index++;
            path = path.substr(2);
        }

        //route to page
        var parsed = parse_parts(path);
        scope.path = scope.path.slice(0, index).concat(parsed);
    } else {
        //set parameters
        webix.extend(scope.path[index].params, path, true);
    }

    scope.show(url_string(scope.path), -1);
}

function get_app_scope(scope) {
    while (scope) {
        if (scope.app)
            return scope;
        scope = scope.parent;
    }
    return app;
}

function url_string(stack) {
    var url = [];
    var start = app.config.layout ? 1 : 0;

    for (; start < stack.length; start++) {
        url.push("/" + stack[start].page);
        var params = params_string(stack[start].params);
        if (params)
            url.push(":" + params);
    }

    return url.join("");
}

function params_string(obj) {
    var str = [];
    for (var key in obj) {
        if (str.length)
            str.push(":");
        str.push(key + "=" + obj[key]);
    }

    return str.join("");
}

function parse_parts(url) {
    //split url by "/"
    var chunks = url.split("/");

    //use optional default layout page
    if (!chunks[0]) {
        if (app.config.layout)
            chunks[0] = app.config.layout;
        else
            chunks.shift();
    }

    //for each page in url
    for (var i = 0; i < chunks.length; i++) {
        var test = chunks[i];
        var result = [];

        //detect params
        var pos = test.indexOf(":");
        if (pos !== -1) {
            var params = test.substr(pos + 1).split(":");
            //detect named params
            var objmode = params[0].indexOf("=") !== -1;

            //create hash of named params
            if (objmode) {
                result = {};
                for (var j = 0; j < params.length; j++) {
                    var dchunk = params[j].split("=");
                    result[dchunk[0]] = dchunk[1];
                }
            } else {
                result = params;
            }
        }

        //store parsed values
        chunks[i] = {page: (pos > -1 ? test.substr(0, pos) : test), params: result};
    }

    //return array of page objects
    return chunks;
}

/**
 * Copy view configuration object.
 * @param obj ui configuration.
 * @param target
 * @param config Layout configuration.
 * @returns {*}
 */
function copy(obj, target, config) {
    if (obj.$onRender)
        config._init.push(obj.$onRender);
    if (obj.$onDestroy)
        config._destroy.push(obj.$onDestroy);
    if (obj.$onEvent) {
        for (var key in obj.$onEvent)
            config._events.push(key, obj.$onEvent[key]);
    }
    if (obj.$windows)
        config._windows.push.apply(config._windows, obj.$windows);

    if (obj.$subview) {
        if (typeof obj.$subview == "string") {
            obj.id = (config.name + ":subview:" + obj.$subview);
        } else {
            obj = {id: (config.name + ":subview")};
            config.$layout = true;
        }
    }
    if (obj.$ui)
        obj = obj.$ui;
    if (obj.$init) {
        return obj;
    }

    target = target || (webix.isArray(obj) ? [] : {});
    for (var method in obj) {
        if (obj[method] && typeof obj[method] == "object" && !webix.isDate(obj[method])) {
            target[method] = copy(obj[method], (webix.isArray(obj[method]) ? [] : {}), config);
        } else {
            target[method] = obj[method];
        }
    }

    return target;
}

/**
 * Prepare view config and render.
 * @param ui view configuration object
 * @param name view name
 * @param {Object[]} stack - List of view fragment.
 * @param {string} viewPath - Full view path.
 * @returns {{root: *, sub: subui, parent: subui, index: *}|*|boolean}
 */
function subui(ui, name, stack, viewPath) {
    if (run_plugins(onBeforePathProcess_Handlers, ui, name, stack, viewPath, this) === false) return;

    if (name.page != this.name) {
        this.name = name.page;
        this.ui = create_temp_ui;
        this.on = create_temp_event;
        this.show = show;
        this.module = ui;

        destroy.call(this);

        //collect init and destory handlers
        //set subview layout
        this._init = [];
        this._destroy = [];
        this._windows = [];
        this._events = [];
        this._subs = {};
        this.$layout = false;

        var subview = copy(ui, null, this);
        subview.$scope = this;

        create.call(this, subview);

        //prepare layout for view loading
        if (this.$layout) {
            this.$layout = {
                root: (this._ui.$$ || webix.$$)(this.name + ":subview"),
                sub: subui,
                parent: this,
                index: this.index + 1
            };
        }
    }

    run_plugins(onAfterPathProcess_Handlers, ui, name, stack, viewPath, this);

    if (!ui.$onBeforeSubview || ui.$onBeforeSubview.call(ui, ui, name, stack, viewPath, this) !== false)
        return this.$layout;
}

function render_sub_stack(scope, path) {
    if (scope.root)
        scope.root = webix.$$(scope.root);

    var parts = parse_parts(path);
    scope.path = [].concat(parts);
    render_stack(scope, parts);
}

function render_stack(layout, stack, viewPath) {
    var line = stack[0];
    if (line) {
        var url = line.page;
        var issubpage = url.indexOf(".") === 0;

        if (issubpage)
            url = (layout.fullname || "") + url;
        url = url.replace(/\./g, "/");

        var next_step = function (ui) {
            if (typeof ui === "function") ui = ui();
            stack.shift();

            var next = layout.sub(ui, line, stack, viewPath);
            if (next) {
                next.fullname = (issubpage ? (layout.fullname || "") : "") + line.page;
                render_stack(next, stack);
            } else {
                webix.ui.$freeze = false;
                webix.ui.resize();
            }
        };
        require(["views/" + url], function (ui) {
            if (ui.then)
                ui.then(next_step);
            else
                next_step(ui);
        });
    } else {
        webix.ui.$freeze = false;
        webix.ui.resize();
    }
}

var onAfterPathProcess_Handlers = [];
var onBeforePathProcess_Handlers = [];
var onBeforeRoute_Handler = [];

/**
 * Helper method to call all plugins in list.
 */
function run_plugins(plugins) {
    for (var i = 0; i < plugins.length; i++)
        if (plugins[i].apply(this, arrayUtil.slice(arguments, 1)) === false) return false;
    return true;
}

var app = {
    create: function (config) {
        //init config
        app.config = webix.extend({
            name: "App",
            version: "1.0",
            container: document.body,
            start: "home"
        }, config, true);

        //init self
        app.debug = config.debug;
        app.$layout = {
            sub: subui,
            root: app.config.container,
            index: 0,
            add: true
        };

        webix.extend(app, webix.EventSystem);
        webix.attachEvent("onClick", function (e) {
            if (e) {
                var target = e.target || e.srcElement;
                if (target && target.getAttribute) {
                    var trigger = target.getAttribute("trigger");
                    if (trigger)
                        app.trigger(trigger);
                }
            }
        });

        //show start page
        setTimeout(function () {
            app.start();
        }, 1);

        var title = document.getElementsByTagName("title")[0];
        if (title)
            title.innerHTML = app.config.name;


        var node = app.config.container;
        webix.html.addCss(node, "webixappstart");

        setTimeout(function () {
            webix.html.removeCss(node, "webixappstart");
            webix.html.addCss(node, "webixapp");
        }, 10);

        return app;
    },

    ui: create_temp_ui,

    //navigation
    router: function (hashbang, viewPath) {
        if (run_plugins(onBeforeRoute_Handler, hashbang, viewPath) === false) return;

        var parts = parse_parts(viewPath);
        app.path = [].concat(parts);

        webix.ui.$freeze = true;
        render_stack(app.$layout, parts, viewPath);
    },
    show: function (name, options) {
        routie.navigate(name, options);
    },
    start: function () {
        if (!window.location.hash)
            app.show(app.config.start);
        else {
            webix.ui.$freeze = false;
            webix.ui.resize();
        }
    },

    //plugins
    use: function (handler, config) {
        if (handler.$onInit)
            handler.$onInit(this, (config || {}));

        if (handler.$onBeforeRoute)
            onBeforeRoute_Handler.push(handler.$onBeforeRoute);
        if (handler.$onBeforePathProcess)
            onBeforePathProcess_Handlers.push(handler.$onBeforePathProcess);
        if (handler.$onAfterPathProcess)
            onAfterPathProcess_Handlers.push(handler.$onAfterPathProcess);
    },

    //Event handler shortcuts
    //app.callEvent
    trigger: function (name) {
        app.callEvent(name, [].splice.call(arguments, 1));
    },

    /**
     * THe method that unites both the click handler and the callEvent method
     * eg.
     * on:{
     *  onChange:app.action("detailsModeChanged");
     *  }
     *
     * @param name
     * @returns {Function}
     */
    action: function (name) {
        return function () {
            //webix.EventSystem's callEvent()
            //this was added when webix.extend(app, webix.EventSystem); is called.
            app.callEvent(name, data);
        };
    },

    //Event handler shortcuts
    //app.attachEvent
    on: function (name, handler) {
        this.attachEvent(name, handler);
    },

    _uis: [],
    _handlers: []
};

/**
 * Helper method.
 */
function create_temp_ui(module, layout) {
    var view;
    var temp = {_init: [], _destroy: [], _windows: [], _events: []};
    var ui = copy(module, null, temp);
    ui.$scope = this;

    if (ui.id)
        view = $$(ui.id);

    if (!view) {
        var i;
        //create linked windows
        for (i = 0; i < temp._windows.length; i++)
            this.ui(temp._windows[i]);

        view = webix.ui(ui, layout);
        this._uis.push(view);

        for (i = 0; i < temp._events.length; i += 2)
            this.on(app, temp._events[i], temp._events[i + 1]);

        run_handlers(temp._init, view, this);
    }

    return view;
}

/**
 * the Helper method to add handler to specific Webix's ui.layout
 * @param {ui.layout} obj
 * @param name
 * @param code
 * @returns {*}
 */
function create_temp_event(obj, name, code) {
    var id = obj.attachEvent(name, code);
    this._handlers.push({obj: obj, id: id}); //this will be used to detach handlers
    return id;
}

/**
 * Helper method.
 */
function run_handlers(arr, view, scope) {
    if (arr)
        for (var i = 0; i < arr.length; i++)
            arr[i](view, scope);
}

/**
 * Cleanup layout
 * @scope this layout to clean up.
 */
function destroy() {
    if (!this._ui) return;

    if (this.$layout)
        destroy.call(this.$layout);

    var handlers = this._handlers;
    var i;
    for (i = handlers.length - 1; i >= 0; i--)
        handlers[i].obj.detachEvent(handlers[i].id);
    this._handlers = [];

    var uis = this._uis;
    for (i = uis.length - 1; i >= 0; i--)
        if (uis[i] && uis[i].destructor) uis[i].destructor();
    this._uis = [];

    run_handlers(this._destroy, this._ui, this);

    if (!this.parent && this._ui)
        this._ui.destructor();
}

/**
 * Destroy Webix view instance.
 * @param view
 */
function delete_ids(view) {
    delete webix.ui.views[view.config.id];
    view.config.id = "";
    var childs = view.getChildViews();
    for (var i = childs.length - 1; i >= 0; i--)
        delete_ids(childs[i]);
}

/**
 * Create Webix view instance.
 * @param subview
 */
function create(subview) {
    this._uis = [];
    this._handlers = [];

    //naive solution for id duplication
    if (this.root && this.root.config)
        delete_ids(this.root);

    //create linked windows
    var i;
    for (i = 0; i < this._windows.length; i++)
        this.ui(this._windows[i]);

    this._ui = webix.ui(subview, this.root);
    if (this.parent)
        this.root = this._ui;

    for (i = 0; i < this._events.length; i += 2)
        this.on(app, this._events[i], this._events[i + 1]);

    run_handlers(this._init, this._ui, this);
}
module.exports = app;