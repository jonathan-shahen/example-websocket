// Stores the ID given to this tab
let myId = null;

// create the websocket
const ws = new WebSocket('ws://localhost:7071/ws');

ws.addEventListener('open', function (event) {
    console.log('Websocket open');
});


ws.addEventListener('message', function (event) {
    document.getElementById('messageHistory').innerText = event.data + '\n'
        + document.getElementById('messageHistory').innerText;
});

function updateSubscription(elem) {
    data = {
        'subscriptionId': elem.dataset.subscriptionId,
        'subscribe' : elem.checked,
    };
    console.log(`Updating subscription`, data);
    ws.send(JSON.stringify(data));
}
