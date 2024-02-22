const express = require('express');
const { Server } = require('socket.io');
const { v4: uuidV4 } = require('uuid');
const http = require('http');
const { error } = require('console');

const app = express();

const httpServer = http.createServer(app);

const port = process.env.PORT || 3000

const io = new Server(httpServer, {
  cors: {
    origin: "https://chess-game-snowy.vercel.app",
    // origin: "*"
  }
});

const rooms = new Map();

// io connection
io.on('connection', (socket) => {
  console.log(socket.id, 'connected');

  socket.on('username', (username) => {
    socket.data.username = username;
    console.log(socket.data);
  });

  socket.on('createRoom', async (callback) => {
    console.log('createRoom')
    const roomId = uuidV4();
    await socket.join(roomId);

    // set roomId as key and roomData including players as value in the map
    rooms.set(roomId, {
      roomId,
      players: [{ id: socket.id, username: socket.data?.username }],
    })

    callback(roomId);

  });

  socket.on('joinRoom', async (args, callback) => {
    const room = rooms.get(args.roomId);
    let error, message;
    if(!room) {
      error = true;
      message = "Room not found";
    } else if (room.players.length >= 2) {
      error = true;
      message = "Room is full";
    } else if (room.length <= 0) {
      error = true;
      message = "Room is empty";
    }

    if (error) {
      if (callback) callback({ error, message });
      return;
    }

    await socket.join(args.roomId);
    
    const updatedRoom = {
      ...room,
      players: [...room.players, { id: socket.id, username: socket.data?.username }],
    };

    rooms.set(args.roomId, updatedRoom);

    
    callback(updatedRoom);
    
    socket.to(args.roomId).emit('opponentJoined', updatedRoom);

    console.log("Joined room: ", socket.data.username);

  });

  socket.on("move", (data) => {
    console.log(data.move, data.room);
    socket.to(data.room).emit('move', data.move);
  })

});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
