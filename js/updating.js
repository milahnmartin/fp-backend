"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../data/data.db');
class Update {
    constructor(name, token, info) {
        this._name = name;
        this._token = token;
        this._info = info;
    }
    checkUser() {
        return new Promise((accept, deny) => {
            db.all("select `token` from `token` where `token` = $token;", { $token: this._token }, (err, res) => {
                if (res[0]) {
                    accept(this.update_user({ status: true, reason: "Success", token: this._token, name: this._name }));
                }
                else {
                    accept(this.update_user({ status: false, reason: "error", name: this._name }));
                }
            });
        });
    }
    update_user(info) {
        if (info.status) {
            db.run("update `users` set `info` = $info where `name` = $name", { $info: this._info, $name: this._name }, (err, res) => { });
            return info;
        }
        else {
            return info;
        }
    }
}
exports.default = Update;
