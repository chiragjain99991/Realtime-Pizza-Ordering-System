var socket = io.connect()

var statuses = document.querySelectorAll(".status-line")
var order = JSON.parse(parsed_data)

socket.emit('join-room',`order_${order._id}`)


socket.on('orderUpdated',(data)=>{
    const order={
        status:data.status,
        time:data.time
    }
    updateStatus(order);
})

//change order status
function updateStatus(order){
    console.log(order)
    let completed = true;
    statuses.forEach((status) => {
        let dataProf = status.dataset.status
        if(completed){
            status.classList.remove('step-inprocess')
            status.classList.add('step-completed')
        }
        if(order.status === dataProf){
            status.nextElementSibling.classList.add('step-inprocess');
            completed=false
        }

    });

}

updateStatus(order);