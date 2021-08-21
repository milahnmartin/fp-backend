"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
class Surname {
    constructor(name, surname) {
        this._name = name;
        this._surname = surname;
    }
}
class Name extends Surname {
    constructor(name, surname, age, sex) {
        super(name, surname);
        this.mysex = sex;
    }
    p1() {
        console.log(super._name);
    }
    p2() {
        return 1;
    }
    get_sex() {
        console.log(this.mysex);
    }
}
let i = new Name('Milahn', 'Martin', 22, types_1.gender.S);
i.get_sex();
