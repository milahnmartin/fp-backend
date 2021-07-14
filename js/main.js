"use strict";
const p1 = () => {
    p2();
};
const p2 = () => {
    return 'Hello';
};
let result = p1();
console.log(result);
