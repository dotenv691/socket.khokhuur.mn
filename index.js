const express = require("express");
const app = express();
const http = require("http");
// const fs = require("fs");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors({
  origin: 'https://export.khokh-uur.mn',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// const privateKey = fs.readFileSync('ssl/quick.key', 'utf8');
// const certificate = fs.readFileSync('ssl/quick.crt', 'utf8');
// const intermediate = fs.readFileSync('ssl/quick.ca-bundle', 'utf8');
// const credentials = { key: privateKey, cert: certificate, ca: intermediate };

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:'*',
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const origin = socket.handshake.headers.origin;
  if (origin === 'https://export.khokh-uur.mn' || origin === 'http://localhost:3000') {
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
