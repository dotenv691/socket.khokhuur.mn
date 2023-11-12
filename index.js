const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://export.khokh-uur.mn/'],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log(`join: ${data}`)
    socket.join(data);
  });

  socket.on("leave_room", (data) => {
    console.log(`leave: ${data}`)
    socket.leave(data);
  });

  socket.on("send_message", (data) => {
    console.log('Send message: ', data)
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
