let mongoose = require("mongoose");


let pizzaSchema = new mongoose.Schema({
   name:{
      type:String,
      required:true
  },
   image:{
      type:String,
      required:true
  },
   size:{
      type:String,
      required:true
  },
   price:{
      type:String,
      required:true
  }
});



let Pizza = mongoose.model("Pizza", pizzaSchema);

module.exports = Pizza;
