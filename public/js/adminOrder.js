var socket = io.connect()


var user = JSON.parse(parsed_data)


socket.emit('new-connection',user._id);





// window.onload = function() {
//     var form = document.querySelector("form");
//     form.onsubmit = submitted.bind(form);
// }

// function submitted(event) {
//     event.preventDefault();
//     console.group('hello')
// }

// function myFunction(event){

//     var orderDetails = document.getElementById("orderDetails")
   
//     var e = document.getElementById("myselect");
//     var strUser = e.value;
//     console.log(e,strUser,e.previousSibling.previousSibling.value)
    
// socket.emit('status-change',{
//     order_id:"",
//     status:""
// })
// }

socket.on('get-order',(data)=>{
    console.log('admin',data)
    const orderdiv = document.createElement('div')
    orderdiv.innerHTML = Item(data)

    const allOrders = document.getElementById("allOrders")
    allOrders.prepend(orderdiv)

})





const Item = (order) => `
<div class="col-12">

<div class="smallscreen">
<a href="#">${order._id}</a>

<div class="block">
    <div style="color: #f90cb0;">Order Details: </div>
    <div>
        <div><span class="rowTitle">Items: </span>
            <span class="rowValue">
                <ul style="margin-top: 4px;">
                ${
                    order.items.map((item) => { 
                       
                            return `<li>`+item.name+` pizza - 1 pcs</li>`
                       
                    }).join('')
                }
                </ul>
            </span>
        </div>
        <div><span class="rowTitle">Time: </span><span class="rowValue">${moment(order.createdAt).format('hh:mm A')}</span></div>
    </div>
</div>


<div class="block">
    <div style="color: #f90cb0;">User Details: </div>
    <div>
        <div><span class="rowTitle">Username: </span><span class="rowValue">${order.customerId.username}</span></div>
        <div><span class="rowTitle">Address: </span><span class="rowValue">${order.address}</span></div>
    </div>
</div>

<div class="block">
    <div style="color: #f90cb0;">Payment Details: </div>
    <div>
        <div><span class="rowTitle">Payment Method: </span><span class="rowValue">${order.paymentMethod}</span></div>
        <div><span class="rowTitle">Payment Status: </span><span class="rowValue">${ order.paymentStatus ?  "PAID" : "UNPAID" }</span></div>
    </div>
</div>
<div class="block">
    <div style="color: #f90cb0;">Status: </div>
    <div>
    <form action="/changeStatus/${order._id}"  method="POST">
    <select name="status" id="myselect" onchange="this.form.submit()">
    ${
        (order.status === "order_placed") ? `<option selected value="order_placed">Placed</option>` : `<option selected value="order_placed">Placed</option>`
    }
    ${
        (order.status === "Confirmed") ? `<option selected value="Confirmed">Confirmed</option>`:`<option value="Confirmed">Confirmed</option>`
    }
    ${
        (order.status === "Prepared") ?  `<option selected value="Prepared">Prepared</option>` :`<option value="Prepared">Prepared</option>`
    }
    ${
        (order.status === "Delivered") ?   `<option selected value="Delivered">Delivered</option>`: `<option value="Delivered">Delivered</option>`
    }
    ${
        (order.status === "Completed") ? `<option selected value="Completed">Completed</option>`:`<option value="Completed">Completed</option>`
    }
            
    </select>
    </form>
    </div>
</div>


<div class="largescreen row insideRow">
    <div class="col-3 size1">
        ${order._id}
        <ul style="margin-top: 4px">
        
            ${
                order.items.map((item) => { 
                   
                        return `<li>`+item.name+` pizza - 1 pcs</li>`
                   
                }).join('')
            }
           
            
    </ul>
    <hr style="border-bottom: 1px solid black;opacity: 0.3;">
    <p><span style="font-weight: 250;">PAYMENT METHOD:</span> ${order.paymentMethod}</p>
    <p style="margin-bottom: 0px;"><span style="font-weight: 250;">PAYMENT STATUS: </span>${ order.paymentStatus ?  "PAID" : "UNPAID" }</p>
    </div>
    <div class="col-2 category">
        ${order.customerId.username}
    </div>
    <div class="col-3 category">
        ${order.address}
    </div>
    <div class="col-2 category">
    
    <form action="/changeStatus/${order._id}"  method="POST">
    <select name="status" id="myselect" onchange="this.form.submit()">
    ${
        (order.status === "order_placed") ? `<option selected value="order_placed">Placed</option>` : `<option selected value="order_placed">Placed</option>`
    }
    ${
        (order.status === "Confirmed") ? `<option selected value="Confirmed">Confirmed</option>`:`<option value="Confirmed">Confirmed</option>`
    }
    ${
        (order.status === "Prepared") ?  `<option selected value="Prepared">Prepared</option>` :`<option value="Prepared">Prepared</option>`
    }
    ${
        (order.status === "Delivered") ?   `<option selected value="Delivered">Delivered</option>`: `<option value="Delivered">Delivered</option>`
    }
    ${
        (order.status === "Completed") ? `<option selected value="Completed">Completed</option>`:`<option value="Completed">Completed</option>`
    }
            
    </select>
    </form>
    </div>
    <div class="col-2 size">
    ${moment(order.createdAt).format('hh:mm A')}
    </div>

</div>
<hr style="margin-bottom: 25px;border-bottom: 3px solid black;">

</div>
`;





