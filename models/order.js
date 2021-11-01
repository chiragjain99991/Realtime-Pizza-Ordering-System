let mongoose = require("mongoose");
let User = require('./user');
let Pizza = require('./pizza')

let orderSchema = new mongoose.Schema({
   customerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
   items:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Pizza'
    }
   ],
   phone:{
      type:String,
      required:true
  },
   address:{
      type:String,
      required:true
  },
  status:{
    type:String,
    default:"order_placed"
},
paymentStatus:{
 type:Boolean,
 default:false
},
paymentMethod:{
  type:String,
  default:"Cash On Delivery"
}

},
{ timestamps: true }
);



let Order = mongoose.model("Order", orderSchema);

module.exports = Order;