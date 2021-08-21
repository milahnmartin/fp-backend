import {gender} from './types';

class Surname{
    protected _name:string;
    private _surname:string;


    protected constructor(name:string,surname:string){
        this._name = name;
        this._surname = surname;
    }


}


interface the_class {
    p1:()=>void;
    p2:()=>number;
}

class Name extends Surname implements the_class{
    private mysex:gender | undefined;

    public constructor(name:string,surname:string,age:number,sex:gender){
        super(name,surname);
        this.mysex = sex;
    }

    public p1():void{
        console.log(super._name);
    }

    public p2():number{
        return 1;
    }

    public get_sex(){
        console.log(this.mysex);
    }
}



let i = new Name('Milahn','Martin',22,gender.S);



i.get_sex();