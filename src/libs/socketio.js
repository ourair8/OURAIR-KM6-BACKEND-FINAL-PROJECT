const http = require('http');
const { Server } = require('socket.io');
const app = require('../index'); // Assuming this exports your Express app correctly

const server = http.createServer(app);
const io = new Server(server, {
  allowEIO3: true, 
  }
);

io.on('connection', (socket) => {
    ;
    socket.on('disconnect', () => {
        ;
    });
});

app.set('io', io);

module.exports = server;