const express = require('express');
const server = require('http').createServer();
const app = express()

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => console.log('Listening on port 3000'));

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server });

wss.on('connection', (ws) => {
    const numClients = wss.clients.size;
    console.log('Clients connected: ', numClients);

    wss.broadcast(`Current visitors: ${numClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to my server');
    }

    ws.on('close', () => {
        wss.broadcast(`Current visitors: ${numClients}`);
        console.log('Client disconnected');
    })
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === client.OPEN) {
            try {
                client.send(data);
            } catch (e) {
                console.error('Broadcast error:', e);
            }
        }
    });
}
