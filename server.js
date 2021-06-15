const express = require('express');
const app = express();
const PORT = 3001;


const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('data.db');

db.run("CREATE TABLE IF NOT EXISTS `users`(`id` INTEGER PRIMARY KEY AUTOINCREMENT,`name` TEXT,`info` BLOB default NULL);")

app.get('/data/get/:name', (req, res, next) => {
    const query = req.params.name;

    db.all(`SELECT * FROM users where name like '${query}%'`, (err, rows) => {
        if (rows) {
            res.json(rows)
        } else {
            res.json({ status: "error" })
        }
    })


});




function new_player(pname, pinfo) {
    db.run("insert into `users`(name,info)values($name,$info)",
        { $name: pname, $info: pinfo },
        (err, res) => {
            if (res) return true;
            if (err) return false;
        }
    )
}


app.get('/data/new/:name/', (req, res) => {
    const _query_name = req.params.name;
    const info = req.query.data

    new_player(_query_name, info)

    if (new_player) {
        res.json({ status: 'SUCCESS', user: _query_name.toUpperCase() })
    } else {
        res.json({ status: "ERROR", user: _query_name.toUpperCase() })
    }

})

app.get('/data/remove/:name', (req, res) => {
    const query_name = req.params.name;
    db.run("DELETE * FROM `users` WHERE `name` = $name", { $name: query_name }, (err, res) => {
        if (res) res.json({ "DELETE": "SUCCES", "USER": query_name.toUpperCase() })
        if (err) res.json({ "DELETE": "ERROR", "USER": query_name.toUpperCase() })
    })
})
app.listen(PORT, (err, res) => {
    console.log("SERVER RUNNING ON " + PORT)
})



