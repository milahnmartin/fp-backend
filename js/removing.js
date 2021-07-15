"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../data/data.db');
class User {
    constructor(pname, ptoken) {
        this.pname = pname;
        this.ptoken = ptoken;
    }
    response() {
        return new Promise((accept, deny) => {
            db.all("select * from `token` where `name` = $name and `token` = $token;", { $name: this.pname, $token: this.ptoken }, (err, res) => {
                if (res[0]) {
                    accept(this.remove_user(true));
                }
                else {
                    accept(this.remove_user(false));
                }
            });
        });
    }
    remove_user(token_found) {
        if (token_found) {
            db.run("DELETE FROM `users` WHERE `name` = $name;", { $name: this.pname }, (err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Sucess on Deletion");
                }
            });
            db.run("DELETE FROM `token` WHERE $name = name and `token` = $token;", { $name: this.pname, $token: this.ptoken }, (err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Sucess on token deletion");
                }
                ;
            });
            return { status: true, secret_token: this.ptoken, name: this.pname };
        }
        else {
            return { status: false };
        }
    }
}
exports.default = User;
