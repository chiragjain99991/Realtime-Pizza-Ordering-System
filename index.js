let express = require("express");
let ejs = require("ejs");
let ejsMate = require("ejs-mate");
let app = express();
let expressLayouts = require("express-ejs-layouts");
let mongoose = require('mongoose');
let session = require("express-session");
let passport = require('passport');
let passportLocal = require("passport-local");
let passportLocalMongoose = require("passport-local-mongoose");
let flash = require("connect-flash");

let User = require('./models/user')
let UserRouter = require('./routes/user')

const dburl = "mongodb://localhost:27017/pizzaOrdering";

mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we're connected!yeah");
});


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

let sessionConfig = {
  secret: "Jagdambe",
  saveUninitialized: true,
  resave: false,
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.use("/", UserRouter);

app.listen(3000, () => {
  console.log("Listening from Port 3000");
});
