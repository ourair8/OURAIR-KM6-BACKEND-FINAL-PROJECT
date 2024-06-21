const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({ noServer: true });

let clients = {};

webSocketServer.on('connection', (ws, req) => {
    const userId = 'waduh';
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

const testwebsocket = async function(req, res) {
    try {

        const id = "waduh"
        sendNotification(id, {
            message: `Your booking was successful. Please complete the payment using the following link`,
        });
    } catch (err) {
        console.log(err)
        throw err
    }
}

module.exports = {
    testwebsocket
}