const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../data/data.db');
import {new_status, response} from './types';

class User {
    public pname: string;
    private ptoken: string;


  

    public constructor(pname: string, ptoken: string) {
        this.pname = pname;
        this.ptoken = ptoken;
    }





    public response():Promise<any>{


        return new Promise((accept:any,deny:any)=>{

            db.all("select * from `token` where `name` = $name and `token` = $token;",{$name:this.pname,$token:this.ptoken},(err:any,res:any)=>{
            if(res[0]){
                
                accept(this.remove_user(true));
            }else{
               accept(this.remove_user(false));
            }
             });

        })
      

  
    }

    private remove_user(token_found:boolean):new_status{

        if(token_found){

            db.run("DELETE FROM `users` WHERE `name` = $name;",{$name:this.pname},(err:any,res:any)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Sucess on Deletion");
            }
        })

        db.run("DELETE FROM `token` WHERE $name = name and `token` = $token;",{$name:this.pname,$token:this.ptoken},(err:any,res:any)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Sucess on token deletion");
            };

        })

        return {status:true,secret_token:this.ptoken,name:this.pname}
        }else{


            return {status:false}

        }

    }


   
   


}



export default User;

