const http = require('http');
const { Server } = require('socket.io');
const app = require('../index');

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    ;
    socket.on('disconnect', () => {
        ;
    });
});

app.set('io', io);

module.exports = server;