const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:1234",
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // roomID
  socket.on("join__room", (data) => {
    console.log(data.roomID);
    socket.join(data.roomID);
  });

  // receiving message
  socket.on("send__message", (data) => {
    console.log(data);
    socket.to(data.roomID).emit("receive__message", { message: data.textArea });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
