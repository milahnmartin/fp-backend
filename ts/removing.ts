const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../data/data.db');

interface response {
    STATUS: boolean,
    REASON: string
}



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
                this.remove_user();
                accept({status:true,name:this.pname,token:this.ptoken})
            }else{
               accept({status:false,name:this.pname,token:"Token not Found"})
            }
             });

        })
      

  
    }

    private remove_user(){

        db.run("DELETE FROM `users` WHERE `name` = $name;",{$name:this.pname},(err:any,res:any)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Sucess on Deletion");
            }
        })

        db.run("DELETE FROM `token` WHERE $name = name and `token` = $token;",{$name:this.pname,$token:this.ptoken},(err:any,res:any)=>{
            if(err){
                console.log(err)
            }else{
                console.log("Sucess on token deletion");
            };

        })

    }


   
   


}



export default User;

