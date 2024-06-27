const http = require('http');
const { Server } = require('socket.io');
const app = require('../index');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.set('io', io);

module.exports = server;