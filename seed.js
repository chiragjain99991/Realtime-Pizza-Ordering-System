const express = require("express");
var app = express();
let mongoose = require("mongoose");
const Pizza = require('./models/pizza');

const Pizzas = [
    {
        name:"Margherita",image:"http://www.pngplay.com/wp-content/uploads/2/Top-View-Pizza-Download-Free-PNG.png",size:"Medium",price:"200"
    },
    {
        name:"Neapolitan",image:"https://st.depositphotos.com/1020618/2013/i/600/depositphotos_20136185-stock-photo-delicious-italian-pizza.jpg",size:"Large",price:"400"
    },
    {
        name:"California",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkAGe7l5ovSSXCnKzq1gJA2j1ezXBKHj2TAg&usqp=CAU",size:"Meduim",price:"300"
    },
    {
        name:"Sicilian",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFVN7UxmpGU_n6Nal-3Mgs_VtS71_3Tc3JrQ&usqp=CAU",size:"Extra Large",price:"550"
    }
]


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

const createPizza = () => {
    Pizzas.map(async (pizza)=> {
        const p = await new Pizza(pizza);
        await p.save();
        console.log(p)
    })
}

const getPizza = async () => {
    const pizza = await Pizza.findById("6110fa84c2d8a93848d33807")
    console.log(pizza)
}

createPizza();

app.listen(process.env.PORT || 3000, () => {
    console.log("server started at 3000");
  });