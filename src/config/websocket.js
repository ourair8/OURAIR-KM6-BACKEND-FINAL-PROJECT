const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({ noServer: true });

let clients = [];

webSocketServer.on('connection', (ws, req) => {
    const userId = req.user.id;
    clients[userId] = ws;

    ws.on('close', () => {
        delete clients[userId];
    });
});

const sendNotification = (userId, message) => {
    if (clients[userId]) {
        clients[userId].send(JSON.stringify(message));
    }
};

module.exports = { webSocketServer, sendNotification };