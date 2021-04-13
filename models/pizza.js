let mongoose = require("mongoose");


let pizzaSchema = new mongoose.Schema({
   name:String,
   image:String,
   size:String,
   price:Number
});



let Pizza = mongoose.model("Pizza", pizzaSchema);

module.exports = Pizza;
