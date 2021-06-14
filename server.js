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




function new_player(pid, pname) {
    db.run("insert into players(id,name)values($id,$name)",
        { $id: pid, $name: pname },
        (err, res) => {
            if (res) return true;
            if (err) return false;
        }
    )
}


app.get('/data/new/:name', (req, res) => {
    const _query_name = req.params.name;
    let highest_id = 0;
    db.get("select id from players order by id desc limit 1", (err, rows) => {
        if (rows) {
            let new_id = rows.id + 1;
            new_player(new_id, _query_name)

            if (new_player) {
                res.json({ status: 'SUCCESS' })
            } else {
                res.json({ status: "ERROR" })
            }

        }
    })

})

app.listen(PORT, (err, res) => {
    console.log("SERVER RUNNING ON " + PORT)
})



