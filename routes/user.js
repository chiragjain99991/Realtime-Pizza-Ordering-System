const { request } = require("express");
let express = require("express");
let User = require("../models/user");
let passport = require('passport')

let router = express.Router();



router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    let { email, username, password } = await req.body;
    let user = await new User({ email, username });
    let newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Successfully Registered");
      res.redirect("/");
    });
  } catch (e) {
    res.redirect("/register");
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
    let redirectUrl = req.session.toReturn || "/";
    delete req.session.toReturn;
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logOut();

  req.flash("success", "Successfully Logged Out!!");

  res.redirect("/");
});

module.exports = router;
