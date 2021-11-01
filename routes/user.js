const { request } = require("express");
let express = require("express");
let User = require("../models/user");
let Pizza = require("../models/pizza")
let passport = require('passport')



let router = express.Router();

let isAuthenticated=((req,res,next)=>{

  if(!req.isAuthenticated()){
      req.session.toReturn = req.originalUrl
      req.flash('error','You must Log In First!!');
      return res.redirect('/login');
  }
  next();

})



router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    let { email, username, password } = await req.body;
    console.log(email, username, password)
    let user = await new User({ email, username });
    let newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Successfully Registered");
      res.redirect("/");
    });
  } catch (e) {
    // res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});


router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    
    req.flash("success", "Successfully Logged In");
    if (typeof window !== "undefined") {
       window.localStorage.setItem('userId',req.user._id)
       console.log(window.localStorage.getItem('userId'))
    }
    let redirectUrl = req.session.toReturn || "/";
    delete req.session.toReturn;
    res.redirect("/");
  }
);


router.post("/pizza/:pizzaId/addToCart/:userId",isAuthenticated,async(req,res)=>{
  let {pizzaId,userId} = req.params;
  let pizza = await Pizza.findById(pizzaId);
  let user = await (await User.findById(userId)).execPopulate('cart')
  let cart = user.cart;
  if(cart.some(m => JSON.stringify(m._id) === JSON.stringify(pizza._id))){
        
    req.flash('error','Pizza Already Added to the Cart');
} else{

  user.cart.push(pizza)
  await user.save();
 
  req.flash('success','Pizza added to the cart')
    
}
  
  res.redirect("/")
})


router.get("/logout", (req, res) => {
  req.logOut();

  req.flash("success", "Successfully Logged Out!!");

  res.redirect("/");
});

module.exports = router;
