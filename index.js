const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const privateKey = fs.readFileSync('ssl/quick.key', 'utf8');
const certificate = fs.readFileSync('ssl/quick.crt', 'utf8');
const intermediate = fs.readFileSync('ssl/quick.ca-bundle', 'utf8');
const credentials = { key: privateKey, cert: certificate, ca: intermediate };

const server = https.createServer(credentials);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://export.khokh-uur.mn/'],
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const allowedOrigins = ["http://localhost:3000", "https://export.khokh-uur.mn"];
  const origin = socket.handshake.headers.origin;
  if (allowedOrigins.includes(origin)) {
    return next(null, true);
  }
  return next(new Error("Blocked by CORS"));
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
