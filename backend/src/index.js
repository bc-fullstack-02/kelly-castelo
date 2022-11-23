const app = require("./app");
const server = require("http").createServer(app);
const pubsub = require("./pubsub");
const socketio = require("socket.io");
const jwt = require("jsonwebtoken");

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

const liveData = io.of("/v1");

liveData.use((socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    jwt.verify(socket.handshake.auth.token, TOKEN_SECRET, (err, user) => {
      if(user) {
        socket.user_data = user;
        next()
      } else {
        next(new Error("Authentication error"))
      }
    });
  } else {
    next(new Error("Authentication error"));
  }
});

liveData.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log(socket.connected);
  });
  socket.on("error", (err) => {
    console.error(err);
  });
  socket.emit("connect_user", socket.user_data);
});

pubsub
  .sub()
  .then((sub) => {
    sub.on("message", (message, content, ackOrNack) => {      
      ackOrNack();
      Object.entries(Object.fromEntries(liveData.sockets))
        .filter(([, v]) => 
        content.keys.includes(v.user_data.profile.id.toString())
        )
        .map(([k, v]) => {
          return v.emit(content.type, content.payload);
        });
    });
  })
  .catch(console.error);

  server.listen(process.env.PORT || 4000, () => {
  console.log(`server listening on http://localhost:${process.env.PORT || 4000}`);
});