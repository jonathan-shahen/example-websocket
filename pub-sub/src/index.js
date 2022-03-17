const path = require('path');

// Express Setup
const express = require('express')
const app = express()
const expressPort = 3000


// Websocket Setup
var WebSocket = require('ws');
const wsPort = 7071;
const wss = new WebSocket.Server({ port: wsPort });


app.use('/', express.static(path.join(__dirname, 'public')))

const expressServer = app.listen(expressPort, () => {
    console.log(`Server running at http://localhost:${expressPort}`);
    console.log(`Websocket Server running at ws://localhost:${wsPort}/ws\n\n`);
});

expressServer.on("upgrade", (httpRequest, socket, head) => {
    wss.handleUpgrade(httpRequest, socket, head, (websocket) => {
        wss.emit("connection", websocket, httpRequest);
    });
});

function subscriptionGenerator(sub) {
    const startTime = Date.now();
    return function() {
        clients.forEach(function(subscriptions, ws, map) {
            if(subscriptions.has(sub)) {
                ws.send(`New Message from: ${sub} (${Date.now() - startTime} ms)`);
            }
        })
    }
}

setInterval(subscriptionGenerator('freq1'), 1000);
setInterval(subscriptionGenerator('freq0.5'), 500);
setInterval(subscriptionGenerator('freq0.3'), 300);


const clients = new Map();
wss.on('connection', (ws, httpRequest) => {
    clients.set(ws, new Set());

    ws.on('open', function open() {
    });

    ws.on("message", (messageStr) => {
        const message = JSON.parse(messageStr);
        const subscriptions = clients.get(ws);

        if(message.subscribe == true) {
            subscriptions.add(message.subscriptionId);
        } else {
            subscriptions.delete(message.subscriptionId);
        }
    });

    ws.on("close", () => {
        clients.delete(ws);
    });
}
);