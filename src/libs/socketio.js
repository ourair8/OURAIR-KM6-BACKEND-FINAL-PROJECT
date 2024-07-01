const http = require('http');
const { Server } = require('socket.io');
const app = require('../index'); // Assuming this exports your Express app correctly

const server = http.createServer(app);
const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: [
      "https://ourair.tech",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3001",
      "http://localhost:3000",
      "https://ourair.my.id",
      "https://accounts.google.com",
      "https://bw2nj1xt-3001.asse.devtunnels.ms"
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});

io.on('connection', (socket) => {
    ;
    socket.on('disconnect', () => {
        ;
    });
});

app.set('io', io);

module.exports = server;