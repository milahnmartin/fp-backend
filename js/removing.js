"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../data/data.db');
class User {
    constructor(pname, ptoken) {
        this.token_status = false;
        this.pname = pname;
        this.ptoken = ptoken;
    }
    Token_Valid() {
        return new Promise((accept, denie) => {
            db.all("select * from `token` where `name` = $name and `token` = $token;", { $name: this.pname, $token: this.ptoken }, (err, res) => {
                if (res[0]) {
                    accept(res[0]);
                }
                else {
                    accept({ Error: 'Person was not found, or token is incorrect soryy ...' });
                }
            });
        });
    }
    remove_player() {
        db.run("DELETE * FROM `users` WHERE `name` = $name;", { $name: this.pname }, (err, res) => { });
        db.run("DELETE * from `token` WHERE `name` = $name;", { $name: this.pname }, (err, res) => { });
        return true;
    }
}
exports.default = User;
