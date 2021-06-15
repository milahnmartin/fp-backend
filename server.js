
const express = require('express');
const app = express();
const PORT = 3001;


const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('data.db');

db.run("CREATE TABLE IF NOT EXISTS `users`(`id` INTEGER PRIMARY KEY AUTOINCREMENT,`name` TEXT,`info` BLOB default NULL);")

app.get('/data/get/:name', (req, res, next) => {
    const query = req.params.name;

    if (query === '*') {

        db.all("select * from users;", (err, rows) => {
            res.json(rows)
        })

    } else if (query !== '*') {
        db.all(`select * from users where name like '%${query}%';`, (err, rows) => {
            if (rows[0]) {
                res.json(rows)
            } else {
                res.json({ STATUS: "ERROR" })
            }
        })
    }





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


function remove_player(pname) {
    db.run(`DELETE from users WHERE name LIKE '%${pname}%'`, (err, res) => {
        if (res) return true;
        if (!res) return false;
    })
}


app.get('/data/new/:name/', (req, res) => {
    const _query_name = req.params.name.toLowerCase();
    const info = req.query.data

    const status = new_player(_query_name, info)

    res.json({ STATUS: "SUCCESS" })

})

app.get('/data/remove/:name', (req, res) => {
    const query_name = req.params.name;

    remove_player(query_name)

    res.json({ STATUS: "SUCCESS" })

})
app.listen(PORT, (err, res) => {
    console.log("SERVER RUNNING ON " + PORT)
})



