"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const PORT = 3001;
const removing_1 = __importDefault(require("./removing"));
const updating_1 = __importDefault(require("./updating"));
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../data/data.db');
db.run("CREATE TABLE IF NOT EXISTS `users`(`id` INTEGER PRIMARY KEY AUTOINCREMENT,`name` TEXT,`info` BLOB default NULL);");
db.run("CREATE TABLE IF NOT EXISTS `token`(`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,`token` TEXT NOT NULL,`name` TEXT NOT NULL);");
app.get('/data/get/:name/', (req, res, next) => {
    const query = req.params.name;
    if (query === '*') {
        db.all("select * from users;", (err, rows) => {
            res.json(rows);
        });
    }
    else if (query !== '*') {
        db.all(`select * from users where name like '%${query}%';`, (err, rows) => {
            if (rows[0]) {
                res.json(rows);
            }
            else {
                res.json({ STATUS: "ERROR" });
            }
        });
    }
});
const generateToken = () => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
};
function new_player(pname, pinfo) {
    db.run("insert into `users`(name,info)values($name,$info)", { $name: pname, $info: pinfo }, (err, res) => { });
    let token = generateToken();
    db.run("INSERT INTO `token`(`token`,`name`)VALUES($token,$name)", { $token: token, $name: pname }, (err, res) => { });
    if (token) {
        return { status: true, secret_token: token };
    }
    else {
        return { status: false };
    }
    ;
}
app.get('/data/new/:name/', (req, res) => {
    const _query_name = req.params.name.toLowerCase();
    const info = req.query.data;
    const q_resp = new_player(_query_name, info);
    const token_explanation = "Make Sure To Keep your token Safe, You will need this token to access private data and change your personal info";
    if (q_resp) {
        res.json({ STATUS: "SUCCESS", TOKEN: q_resp.secret_token, 'TOKEN_EXPLAINED': token_explanation });
    }
    else {
        res.json({ STATUS: "ERROR" });
    }
});
app.get('/data/remove/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query_name = req.params.name;
    const token = req.query.token;
    let current_user = new removing_1.default(query_name, token);
    let status = yield current_user.response();
    if (status) {
        if (status.status) {
            res.status(200).json({ status: "Succesfull", name: status.name, token: status.token });
        }
        else {
            res.status(200).json({ status: "Unsuccesfull", name: status.name, token: "Token is Either Wrong, or user doesnt exist", response: "deleted" });
        }
    }
}));
app.get('/data/update/:name/:token/:info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _name = req.params.name;
    const _token = req.params.token;
    const _info = req.params.info;
    if (!_token || !_info) {
        res.status(200).json({ "status": "Error", "reason": "Token Wasnt Provided" });
    }
    let _user = new updating_1.default(_name, _token, _info);
    let token_response = yield _user.checkUser();
    res.status(200).json(token_response);
}));
app.listen(PORT, (err, res) => {
    console.log("SERVER RUNNING ON " + PORT);
});
