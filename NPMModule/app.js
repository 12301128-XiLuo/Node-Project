var circle = require("./circle.js");

var math = require("./math.js");

console.log("circle module");
console.log("The area of a circle of radius 2 is " + circle.area(2));
console.log("The cicumference of a circle of radius 2 is " + circle.circumference(2));

var arr = [1,2,3,4];
console.log("math module");
console.log("The average of 1,2,3,4 is " + math.average(arr));
console.log("The variance of 1,2,3,4 is " + math.variance(arr));