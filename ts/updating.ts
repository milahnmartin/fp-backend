import { stat } from 'fs';
import User from './removing';
import { new_status, response, update_status } from './types';
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../data/data.db');


class Update {
    private _token: string;
    public _name: string;
    private _info: string;

    public constructor(name: string, token: string, info: string) {
        this._name = name;
        this._token = token;
        this._info = info;
    }

    public checkUser(): Promise<update_status> {

        return new Promise((accept: any, deny: any) => {


            db.all("select `token` from `token` where `token` = $token;", { $token: this._token }, (err: any, res: any) => {
                if (res[0]) {
                    this.update_user({ status: true, reason: "Success", token: this._token, name: this._name });
                    accept({ status: true, reason: "Success", token: this._token, name: this._name });
                } else {
                    accept({ status: false, reason: "Errror Occured", name: this._name });
                }



            })


        })

    }



    private update_user(info: update_status): void {

        if (info.status) {

            db.run("update `users` set `info` = $info where `name` = $name", { $info: this._info, $name: this._name }, (err: any, res: any) => { });

        }

    }
}

export default Update;