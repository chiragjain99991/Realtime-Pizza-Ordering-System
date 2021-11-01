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

router.get('/addpizza',isAuthenticated,async(req,res)=>{
    let user = req.user
    if(user.email === "admin567@gmail.com") {
        res.render("addPizza.ejs");
    }else{
        req.session.toReturn = req.originalUrl
        req.flash('error','Only Admin can add pizzas');
        return res.redirect('/');
    }
   
})

router.get('/updatepizza/:pizzaId',isAuthenticated,async(req,res)=>{

    let { pizzaId } = req.params;
    let pizza = {};
    try{
        pizza = await Pizza.findById(pizzaId);
    }catch(err){
        req.session.toReturn = req.originalUrl
        req.flash('error','Pizza not found');
        return res.redirect('/');
    }
    
    let user = req.user
    if(user.email === "admin567@gmail.com") {
        
            res.render("updatePizza.ejs", { pizza });     
    }else{
        req.session.toReturn = req.originalUrl
        req.flash('error','Only Admin can update pizzas');
        return res.redirect('/');
    }
   
})

router.post("/addpizza/:userId/",isAuthenticated,async(req,res)=>{
    let { userId } = req.params;
    let user = await User.findById(userId);
    if(user.email === "admin567@gmail.com") {
        const { name, image, size, price } = req.body;
        if(name === "" || image === "" || size === "" || price ===""){
            req.session.toReturn = req.originalUrl
            req.flash('error','No fields can be empty');
            return res.redirect('/');
        }
        const pizza ={ name, image, size, price }
        
        const p = await new Pizza(pizza);

        await p.save();
        req.session.toReturn = req.originalUrl
        req.flash('success','Pizza added successfully');
        return res.redirect('/');

    }else{
        req.session.toReturn = req.originalUrl
        req.flash('error','Only Admin can add pizzas');
        return res.redirect('/');
    }
})

router.put("/pizza/:pizzaId",isAuthenticated,async(req,res)=>{

    let { pizzaId } = req.params;
    let user = req.user
    if(user.email === "admin567@gmail.com") {
        const { name, image, size, price } = req.body;
        if(name === "" || image === "" || size === "" || price ===""){
            req.session.toReturn = req.originalUrl
            req.flash('error','No fields can be empty');
            return res.redirect('/');
        }
        const pizza ={ name, image, size, price }
        
        const p = await Pizza.findByIdAndUpdate(pizzaId, { $set:  pizza  })

        await p.save();
        req.session.toReturn = req.originalUrl
        req.flash('success','Pizza updated successfully');
        return res.redirect('/');
    }else{
        req.session.toReturn = req.originalUrl
        req.flash('error','Only Admin can update pizzas');
        return res.redirect('/');
    }

})

router.delete("/pizza/:pizzaId",isAuthenticated,async(req,res)=>{

    let { pizzaId } = req.params;
    let user = req.user
    if(user.email === "admin567@gmail.com") {
        const p = await Pizza.findByIdAndDelete(pizzaId);
        req.session.toReturn = req.originalUrl
        req.flash('success','Pizza deleted successfully');
        return res.redirect('/');
    }else{
        req.session.toReturn = req.originalUrl
        req.flash('error','Only Admin can delete pizzas');
        return res.redirect('/');
    }

})


module.exports = router;
