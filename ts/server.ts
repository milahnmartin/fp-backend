
const express = require('express');
const app = express();
const PORT = 3001;
import User from './removing';

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../data/data.db');

db.run("CREATE TABLE IF NOT EXISTS `users`(`id` INTEGER PRIMARY KEY AUTOINCREMENT,`name` TEXT,`info` BLOB default NULL);")
db.run("CREATE TABLE IF NOT EXISTS `token`(`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,`token` TEXT NOT NULL,`name` TEXT NOT NULL);")


app.get('/data/get/:name/', (req: any, res: any, next: any): void => {
    const query = req.params.name;

    if (query === '*') {

        db.all("select * from users;", (err: any, rows: any): void => {
            res.json(rows);
        })

    } else if (query !== '*') {
        db.all(`select * from users where name like '%${query}%';`, (err: any, rows: any): void => {
            if (rows[0]) {
                res.json(rows);
            } else {
                res.json({ STATUS: "ERROR" });
            }
        })
    }





});

const generateToken = (): string => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}




interface new_status {
    status: boolean,
    secret_token?: string

}





function new_player(pname: string, pinfo: string): new_status {
    db.run("insert into `users`(name,info)values($name,$info)",
        { $name: pname, $info: pinfo },
        (err: any, res: any) => { });

    let token = generateToken();


    db.run("INSERT INTO `token`(`token`,`name`)VALUES($token,$name)", { $token: token, $name: pname }, (err: any, res: any) => { });

    if (token) {
        return { status: true, secret_token: token };

    } else {
        return { status: false };
    };
}





app.get('/data/new/:name/', (req: any, res: any): void => {
    const _query_name = req.params.name.toLowerCase();
    const info = req.query.data;

    const q_resp: new_status = new_player(_query_name, info);
    const token_explanation = "Make Sure To Keep your token Safe, You will need this token to access private data and change your personal info"

    if (q_resp) {
        res.json({ STATUS: "SUCCESS", TOKEN: q_resp.secret_token, 'TOKEN_EXPLAINED': token_explanation });
    } else {
        res.json({ STATUS: "ERROR" })
    }




})

app.get('/data/remove/:name', async (req: any, res: any) => {
    const query_name = req.params.name;
    const token = req.query.token;

    let current_user = new User(query_name, token);
    let my_response = await current_user.Token_Valid()
    console.log(my_response)
    
   if(my_response){
       res.json(my_response);
   }else{
       res.json("Some Weird Shit just happened NGL")
   }
    




})
app.listen(PORT, (err: any, res: any): void => {
    console.log("SERVER RUNNING ON " + PORT);
})







