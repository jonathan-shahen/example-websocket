// Stores the ID given to this tab
let myId = null;

// create the websocket
const ws = new WebSocket('ws://localhost:7071/ws');

ws.addEventListener('open', function (event) {
    console.log('Websocket open');

    ws.send(JSON.stringify({ x: 1, y: 1 }));

    document.body.onmousemove = (evt) => {
        const messageBody = { x: evt.clientX, y: evt.clientY };
        ws.send(JSON.stringify(messageBody));
    };
});


ws.addEventListener('message', function (event) {
    const messageBody = JSON.parse(event.data);

    if (messageBody.whoami) {
        console.log('Received my ID',messageBody)
        myId = messageBody.whoami;
    } else {
        const cursor = getOrCreateCursorFor(messageBody);

        // move the cursor to the correct position
        cursor.style.top = `${messageBody.y}px`;
        cursor.style.left = `${messageBody.x}px`;
    }
});

function getOrCreateCursorFor(messageBody) {
    const sender = messageBody.sender;
    const existing = document.querySelector(`[data-sender='${sender}']`);
    if (existing) {
        return existing;
    }

    const template = (sender == myId) ? document.getElementById('myCursor') : document.getElementById('cursor');
    const cursor = template.content.firstElementChild.cloneNode(true);
    const svgPath = cursor.getElementsByTagName('path')[0];

    cursor.setAttribute("data-sender", sender);
    svgPath.setAttribute('fill', `hsl(${messageBody.color}, 50%, 50%)`);

    if (sender == myId) {
        cursor.classList.add('myCursor');
    }

    document.body.appendChild(cursor);

    return cursor;
}