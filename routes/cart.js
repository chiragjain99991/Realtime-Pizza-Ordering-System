let express = require("express");
let User = require("../models/user");
let Pizza = require("../models/pizza")
let passport = require('passport')
const Noty = require('noty');


let router = express.Router();

let isAuthenticated=((req,res,next)=>{

  if(!req.isAuthenticated()){
      req.session.toReturn = req.originalUrl
      req.flash('error','You must Log In First!!');
      return res.redirect('/login');
  }
  next();

})

router.get('/cart/:userId',isAuthenticated,async(req,res)=>{
    let {userId} = req.params;
    let user = await (await User.findById(userId)).execPopulate('cart')
    let cart = user.cart;
    res.render("cart.ejs",{cart, Noty:Noty });
})

module.exports = router;
