const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require('ws');
const Database = require('./Database.js');

const wss = new WebSocket.Server({ port: 3001 });

const db = new Database();

function logHistory(ws) {
    db.fetchHistory()
        .then((rs) => {
            rs.forEach(r => ws.send(JSON.stringify(r)));
        })
        .then(() => ws.send('{"type":"end"}'))
        .catch((err) => console.log(err));
}

wss.on('connection', (ws, req) => {
    let ip = req.socket.remoteAddress;

    logHistory(ws);

    ws.on('message', function incoming(data) {
        let message = JSON.parse(data);
        message.time = Date.now();
        console.log(message.time, message.name, message.type, message.post ? "Message: " + message.post : "");
        let out = JSON.stringify(message);
        db.addMessage(message);
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(out);
            }
        });
    });

    ws.on('close', () => {
    });

    console.log("Connection opened on IP address", ip);
});

express()
    .use(bodyParser.json())
    .use(express.static(__dirname + '/public'))
    .listen(3000);
