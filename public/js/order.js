console.log('chat.js file loaded!')
var user = JSON.parse(parsed_data)
var cart =  JSON.parse(parsed_cart)
console.log(user._id)
console.log(cart)
const paymentMethod = document.querySelector("#paymentMethod");
var stripe = Stripe('pk_test_51JON1TSDyrXjxcHUagGhz77LLRHu9sW6R4hClReItZW92agiy7KDuwFwEUxMetdeW5y9cATwqTanNr7GifqNoXxf00cGocVuGp');
const elements = stripe.elements()

let style={
    base:{
        padding:'5px 15px'
    },
    invalid:{
        color:"#fa755a",
        iconColor:"#7a755a"
    }
}

let card = elements.create('card', { style, hidePostalCode:true})
if( document.querySelector("#card-widget")){
    card.mount('#card-widget')
}


var Address = document.getElementById("address");
var submitButton = document.getElementById("submitButton");
var Phone = document.getElementById("phone")

// IMPORTANT! By default, socket.io() connects to the host that
// served the page, so we dont have to pass the server url
var socket = io.connect()
socket.emit('new-connection',user._id);
socket.on("allusers",users=>console.log(users));


const paymentForm = document.getElementById("myForm")
if(paymentForm) {
    paymentForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        let formData = new FormData(paymentForm);
        let formObject = {}
        for(let [key,value] of formData.entries()){
            formObject[key] = value;
        }

        //verify card

        if(paymentMethod.value === 'Card'){
            stripe.createToken(card).then((res)=>{
                console.log(res.token.id)
                formObject.stripeToken = res.token.id
                placeOrder(formObject)

            }).catch((err)=>{
                console.log(err)
            })
        }
        else{
            placeOrder(formObject)
        }


        
        // axios.post(`/order/${user._id}`,formObject,{
        //     headers:{
        //         "Content-Type": "application/json"
        //     }
        // }).then((res)=>{
        //     // window.location.href = '/order';
        // }).catch((err)=>{
        //     console.log(err);
        // })
    })
}

function placeOrder(formObject){
    axios.post(`/order/${user._id}`,formObject,{
        headers:{
            "Content-Type": "application/json"
        }
    }).then((res)=>{
        console.log(res)
        if(res.data.message === "Successfully placed the order.Payment also placed!!" || res.data.message === "Successfully placed the order!!"){
            window.location.href = '/order';
        }
        
    }).catch((err)=>{
        console.log(err);
    })
}

function myFunction(){
    
    const cardWidget = document.querySelector("#card-widget")
    const cardDetailsLabel = document.querySelector("#cardDetailsLabel")
    if(paymentMethod.value === 'Card'){
        cardWidget.style.display = 'block';
        cardDetailsLabel.style.display = 'block';
    } else {
        cardWidget.style.display = 'none';
        cardDetailsLabel.style.display = 'none';
    }
}



// socket.emit('place-order',{
//     customerId:user._id, 
//     items:cart, 
//     address,
//     phone
// })

// function myFunction(){
//     socket.emit('place-order',{
//         customerId:user._id, 
//         username:user.username,
//         items:cart, 
//         address:Address.value,
//         phone:Phone.value,
//         createdAt:''
    
//     })
// }





