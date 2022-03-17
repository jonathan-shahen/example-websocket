const path = require('path');
const uuid = require('uuid');
const url = require('url');

// Express Setup
const express = require('express')
const app = express()
const expressPort = 3000


// Websocket Setup
var WebSocket = require('ws');
const wsPort = 7071;
const wss = new WebSocket.Server({ port: wsPort });


app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/get_id', (req, res) => {
    const id = uuidv4();
    res.send({ id });
})

const expressServer = app.listen(expressPort, () => {
    console.log(`Server running at http://localhost:${expressPort}`);
    console.log(`Websocket Server running at ws://localhost:${wsPort}/ws\n\n`);
});

expressServer.on("upgrade", (httpRequest, socket, head) => {
    wss.handleUpgrade(httpRequest, socket, head, (websocket) => {
        wss.emit("connection", websocket, httpRequest);
    });
});


const clients = new Map();
wss.on('connection', (ws, httpRequest) => {
    // const queryObject = url.parse(req.url, true).query;
    // console.log('Query Parameters:', queryObject);

    // if (queryObject.id) {
    //     console.log('No id present!')
    //     ws.send(JSON.stringify({ error: 'No id provided' }));
    //     ws.close();
    //     return;
    // }

    // const id = queryObject.id;
    const id = uuid.v4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);

    ws.on('open', function open() {
        console.log('Sent whoami message');
        ws.send(JSON.stringify({ whoami: id }));
    });

    ws.on("message", (messageStr) => {
        const message = JSON.parse(messageStr);
        const metadata = clients.get(ws);

        message.sender = metadata.id;
        message.color = metadata.color;
        const outbound = JSON.stringify(message);

        [...clients.keys()].forEach((client) => {
            client.send(outbound);
        });
    });

    ws.on("close", () => {
        clients.delete(ws);
    });

    console.log('Sent whoami message');
    ws.send(JSON.stringify({ whoami: id }));
}
);