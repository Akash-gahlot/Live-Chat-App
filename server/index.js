const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const PORT = 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});



io.on('connection', async (socket) => { 
    console.log(`user is connected : ` + socket.id);

    socket.on("joinroom", (roomid) => { 
        socket.join(roomid);
        console.log("Successfully joined the room");
    })
    socket.on("sendmessage", (data) => { 
        console.log(data);
        socket.to(data.room).emit("receivemessage", data);
    })
    socket.on("disconnect", () => { 
        console.log(`User is disconnected now`);
    })
})
server.listen(PORT, () => {
    console.log(`Server running on  PORT : ${PORT}`);
});

