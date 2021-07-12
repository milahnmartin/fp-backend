import { access } from "fs";

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../data/data.db');

interface response {
    STATUS: boolean,
    REASON: string
}

interface token_format
{
    status?:boolean,
    id:number,
    token:string,
    name:string
}

class User {
    public pname: string;
    private ptoken: string;
    private token_status:boolean = false;

  

    public constructor(pname: string, ptoken: string) {
        this.pname = pname;
        this.ptoken = ptoken;
    }




    public Token_Valid() : Promise<token_format>{

        
        return new Promise((accept:any,denie:any)=>{

            db.all("select * from `token` where `name` = $name and `token` = $token;",{$name:this.pname,$token:this.ptoken},(err:any,res:any)=>{
                if(res[0]){
                    accept(res[0]);
                }else{
                    accept({Error:'Person was not found, or token is incorrect soryy ...'})
                }
            });


        })

      

       

    }


    private remove_player(): boolean {

        db.run("DELETE * FROM `users` WHERE `name` = $name;", { $name: this.pname }, (err: any, res: any) => { });
        db.run("DELETE * from `token` WHERE `name` = $name;", { $name: this.pname }, (err: any, res: any) => { });
        
        return true;

    }






}



export default User;