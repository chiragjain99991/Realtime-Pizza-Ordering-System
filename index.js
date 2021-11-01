let express = require("express");
let ejs = require("ejs");
let ejsMate = require("ejs-mate");
let app = express();
let bodyParser = require('body-parser');
let expressLayouts = require("express-ejs-layouts");
let mongoose = require('mongoose');
let session = require("express-session");
let passport = require('passport');
let passportLocal = require("passport-local");
let passportLocalMongoose = require("passport-local-mongoose");
let flash = require("connect-flash");
let moment = require('moment');
var methodOverride = require('method-override')
let Emitter = require('events')
let User = require('./models/user')
let Pizzas = require('./models/pizza')
let Order = require('./models/order')
let UserRouter = require('./routes/user')
let cartRouter = require('./routes/cart')
let orderRouter = require('./routes/order')
let PizzaRouter = require('./routes/pizza')

const dburl = "mongodb://localhost:27017/pizzaOrdering";

require('dotenv').config()
mongoose.connect(
 
  "mongodb+srv://chiragjain:Chirag123@pizzadelivery.yl8s5.mongodb.net/PizzaDelivery?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    console.log("pizza delivery database started");
  }
);


const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

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

app.get("/", async (req, res) => {
  let pizzas = await Pizzas.find();
  res.render("home.ejs",{pizzas});
});

app.use("/", UserRouter);
app.use("/",cartRouter);
app.use("/",orderRouter);
app.use("/", PizzaRouter );


let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  console.log(users);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const serverInstance = app.listen(3000, () => {
  console.log("Listening from Port 3000");
  
});

const io = require('socket.io')(serverInstance, {
  path: '/socket.io',
})



  
io.attach(serverInstance, {
  // includes local domain to avoid CORS error locally
  // configure it accordingly for production
  cors: {
    origin: 'http://localhost',
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling'],
  },
  allowEIO3: true,
})

io.on('connection', (socket) => {
  console.log('👾 New socket connected! >>', socket.id)

  socket.on('new-connection',(userId)=>{
    addUser(userId, socket.id);
    io.emit("allusers", users);
  })

  socket.on('place-order',(data)=>{
    let receiver = getUser("611175fe76c4f84238de70fd");
    console.log('yo guys',data)
    // data.createdAt = moment().format('hh:mm A');
    // console.log("receiver", receiver);
    // receiver &&
    //   io.to(receiver.socketId).emit("get-order", {data});
  })

    //Join 
    socket.on('join-room',(roomName)=>{
      console.log(roomName)
      socket.join(roomName)
    })

    //when disconnect
    socket.on("disconnect", () => {
      console.log("user disconnected");
      removeUser(socket.id);
      io.emit("allusers", users);
    });

})


eventEmitter.on('order-placed',(data)=>{
  let receiver = getUser("611175fe76c4f84238de70fd");
  let order = Order.findById(data._id).
  populate('customerId','-password').populate('items').exec((err,order)=>{
    console.log(order)
    receiver &&
    io.to(receiver.socketId).emit("get-order", order);
  })
})

eventEmitter.on('status-change',(data)=>{
  

    io.to(`order_${data.id}`).emit('orderUpdated',data);
  // let receiver = getUser("611175fe76c4f84238de70fd");
  // let order = Order.findById(data._id).
  // populate('customerId','-password').populate('items').exec((err,order)=>{
  //   console.log(order)
  //   receiver &&
  //   io.to(receiver.socketId).emit("get-order", order);
  // })
})
