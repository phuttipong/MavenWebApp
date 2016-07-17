/**
 * This is login page.
 *
 * Created by Phuttipong on 17/5/2559.
 */

var auth = require('models/auth');
var jsCookie = require('js-cookie/src/js.cookie');

var values = webix.copy({
    username: '',
    password: '',
    rememberme: false
}, jsCookie.getJSON("Crm"));

module.exports = {
    $ui: {
        cols: [
            {gravity: 1, template: ""},
            {
                rows: [
                    {gravity: 1, template: ""},
                    {
                        view: "form",
                        gravity: 1,
                        id: 'loginForm',
                        width: 500,

                        elements: [
                            {
                                view: "text",
                                id: "username",
                                name: "username",
                                label: "Username",
                                value: values.username,
                                required: true,
                                placeholder: 'username'
                            },
                            {
                                view: "text",
                                id: "password",
                                name: "password",
                                label: "Password",
                                value: values.password,
                                required: true,
                                type: "password"
                            },
                            {
                                view: 'checkbox',
                                id: 'remember',
                                name: "rememberme",
                                label: "Remember credentials?",
                                labelPosition: "left",
                                labelWidth: 200,
                                checkValue: true,
                                uncheckValue: false,
                                value: values.rememberme
                            },
                            {
                                view: "button",
                                id: "login",
                                name: "login",
                                label: "Login",
                                hotkey: "enter",
                                click: function () {
                                    if ($$("loginForm").validate()) {
                                        var values = $$("loginForm").getValues();
                                        if (true === values.rememberme) {
                                            jsCookie.set("Crm", values);
                                        } else {
                                            // Clear cookie
                                            jsCookie.remove("Crm");
                                        }
                                        auth.login(values.username, values.password, $$('loginForm'));
                                    } else {
                                        $$("loginForm").focus();
                                    }
                                }
                            }
                        ],
                        elementsConfig: {
                            labelPosition: "top",
                            validateEvent: "key"
                        }
                    },
                    {gravity: 1, template: ""}
                ]
            },
            {gravity: 1, template: ""}
        ]
    },

    $onInit: function () {
        $$("loginForm").focus();
    }
};
