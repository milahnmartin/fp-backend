const express = require('express');
const app = express();
const PORT = 3001;


const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('data.db');

db.run("CREATE TABLE IF NOT EXISTS `users`(`id` INTEGER PRIMARY KEY AUTOINCREMENT,`name` TEXT,`info` BLOB default NULL);")

app.get('/data/get/:name', (req, res, next) => {
    const query = req.params.name;

    db.all(`SELECT * FROM players where name like '${query}%'`, (err, rows) => {
        if (rows) {
            res.json(rows)
        } else {
            res.json({ status: "error" })
        }
    })


});




function new_player(pid, pname, pinfo) {
    db.run("insert into players(id,name,info)values($id,$name,$info)",
        { $id: pid, $name: pname, $info: pinfo },
        (err, res) => {
            if (res) return true;
            if (err) return false;
        }
    )
}


app.get('/data/new/:name?:info', (req, res) => {
    const _query_name = req.params.name;
    const info = req.params.info
    let new_id = rows.id + 1;
    new_player(new_id, _query_name, info)

    if (new_player) {
        res.json({ status: 'SUCCESS', user: _query_name.toUpperCase() })
    } else {
        res.json({ status: "ERROR", user: _query_name.toUpperCase() })
    }

})

app.listen(PORT, (err, res) => {
    console.log("SERVER RUNNING ON " + PORT)
})



