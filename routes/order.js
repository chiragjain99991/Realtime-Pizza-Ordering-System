
let express = require("express");
let User = require('../models/user')
let Pizza = require("../models/pizza")
let Order = require('../models/order');
let moment = require('moment');
let stripe = require('stripe')('sk_test_51JON1TSDyrXjxcHUrj39mTAS3d12UL4P2CiRMnUCYCdLMAubJmOqW1vq6mF653b1dWK1RzrqZaozncD359T7yGN9007hd1cODH');


let router = express.Router();

let isAuthenticated=((req,res,next)=>{

  if(!req.isAuthenticated()){
      req.session.toReturn = req.originalUrl
      req.flash('error','You must Log In First!!');
      return res.redirect('/login');
  }
  next();

})

let isAdminAuthenticated =((req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.toReturn = req.originalUrl
        req.flash('error','You must Log In First!!');
        return res.redirect('/login');
    }else{
        if(req.user.email === "admin567@gmail.com" && req.user.username === "admin"){
            next();
        }else{
            req.session.toReturn = req.originalUrl
            req.flash('error','Only Admin is allowed to visit this route');
            return res.redirect('/');
        }
    }
  
  })

router.get('/order',isAuthenticated, async(req,res)=>{
    let orders = await Order.find({customerId:req.user._id},null,{sort:{'createdAt':-1}});
    
    // res.send(orders)
    res.render('order',{ orders:orders, moment: moment})
})

router.get('/allOrder',isAdminAuthenticated, async(req,res)=>{
    let ALLITEMS = [];
    let orders = await Order.find({ status: { $ne: 'Completed'}},null,{sort:{'createdAt':-1}}).
    populate('customerId','-password').populate('items').exec((err,orders)=>{
        console.log(orders)
        res.render('allOrder',{ orders:orders,ALLITEMS:ALLITEMS, moment: moment})
    })
    
})

router.post('/order/:userId',isAuthenticated, async(req,res)=>{

    let totalMoney = 0
    const { address, phone, paymentMethod, stripeToken } = req.body;
    const { userId } = req.params
    let user = await (await User.findById(userId)).execPopulate('cart')
    let allitems = user.cart;
    let customerId = userId;
    let order = new Order({customerId, address, phone, paymentMethod});
    allitems.map((item)=>{
        order.items.push(item._id)
        totalMoney += Number(item.price)
    })
    order.save().then( async(ord)=>{
        console.log('ord',ord)
        if(paymentMethod === 'Card'){
            console.log('totalMoney',totalMoney)
            stripe.charges.create({
                amount: totalMoney * 100,
                source: stripeToken,
                currency: 'inr',
                description: `Pizza Order: ${ord._id}`
            }).then( async(r)=>{
                ord.paymentStatus = true
                ord.save().then( async(successOrder)=>{
                    console.log(successOrder)
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('order-placed',successOrder)
                    user.cart=[];
                    await user.save()
                    req.flash('success',"Successfully placed the order...Payment also placed!!")
                    return res.json({message:'Successfully placed the order.Payment also placed!!'})
                }).catch((e)=>{
                    console.log(e)
                })
            }).catch( async(e)=>{
                user.cart=[];
                await user.save()
                console.log(e)
                return res.send({message:'Payment Failed'})
            })
        } else {
            const eventEmitter = req.app.get('eventEmitter')
            eventEmitter.emit('order-placed',ord)
            user.cart=[];
            await user.save()
            req.flash('success',"Successfully placed the order!!")
            res.send({message:'Successfully placed the order!!'})
        }




    })

    
})

router.get('/checkStatus/:orderId', async(req,res)=>{
    const { orderId } = req.params
    let order = await Order.findById(orderId)
    res.render('orderStatus', { order })
})


router.post("/changeStatus/:orderId",async(req,res)=>{
    const { orderId } = req.params
    let order = await Order.findById(orderId)
    order.status = req.body.status
    await order.save();
    const eventEmitter = req.app.get('eventEmitter')
    eventEmitter.emit('status-change',{
        id:orderId,
        status:req.body.status,
        time:order.updatedAt
    })
    res.redirect("/allOrder")
})

module.exports = router;