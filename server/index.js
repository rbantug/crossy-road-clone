import { randomInt } from 'crypto';
import express from 'express';
import { createServer } from 'http';
import { nanoid } from 'nanoid';
import { Server } from 'socket.io';

/* import { data, outputTile } from './sampleData.js'; */

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

/* const data = {
  room: [
    {
      room_id: '',
      player: [],
      map: []
    }
  ]
} */

const data = {
  room: [],
};

function outputPlayerData(socket, set) {
  let tileIndex;
  do {
    tileIndex = randomInt(-8, 9);
  } while (set.has(tileIndex));

  set.add(tileIndex);

  const playerData = {
    id: socket.id,
    position: {
      currentRow: 0,
      currentTile: tileIndex,
    },
    score: 0,
    movesQueue: [],
    ready: false,
  };

  return playerData;
}

function createRoomId() {
  return nanoid();
}

function createLobbyUrl() {
  return nanoid(7);
}

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  let clientIndex = null;
  let roomIndex = null;
  let gameStart = false;

  socket.on('disconnect', () => {
    if (socket.rooms.size !== 0) {
      const room = socket.rooms.values[0];
      const roomIndex = data.room.findIndex((x) => x.room_id === room);
      data.room[roomIndex].player.splice(clientIndex, 1);

      console.log(data);

      io.emit('character:delete', socket.id);
    }

    console.log('user disconnected');
  });

  socket.on('room:create', () => {
    const room_id = createRoomId();

    const roomData = {
      room_id,
      player: [],
      map: [],
      lobbyUrl: createLobbyUrl(),
      tileSet: new Set(),
      readyCount: 0
    };

    const playerData = outputPlayerData(socket, roomData.tileSet);

    playerData.createdRoom = true

    clientIndex = roomData.player.push(playerData);
    clientIndex = clientIndex - 1;

    roomIndex = data.room.push(roomData);
    roomIndex = roomIndex - 1;

    socket.join(room_id);

    socket.emit('game:init', {
      room_id: roomData.room_id,
      player: roomData.player,
      map: roomData.map,
      lobbyUrl: roomData.lobbyUrl,
    });
  });

  socket.on('room:join', (lobbyUrl) => {
    
    roomIndex = data.room.findIndex((x) => x.lobbyUrl === lobbyUrl);

    if (roomIndex === -1) return

    const playerData = outputPlayerData(socket, data.room[roomIndex].tileSet);

    playerData.createdRoom = false

    clientIndex = data.room[roomIndex].player.push(playerData);
    clientIndex = clientIndex - 1;

    socket.join(data.room[roomIndex].room_id);
    
    if (
      data.room[roomIndex].readyCount === data.room[roomIndex].player.length
    ) {
      gameStart = true;
    } else {
      gameStart = false;
    }

    io.to(data.room[roomIndex].room_id).emit('room:join-client', {data: data.room[roomIndex], gameStart});
  });

  socket.on('character:move', (clientData) => {
    // The plan is to have a queue for the movesQueue with a length of 5.

    /* const getIndex = data.player.findIndex(x => x.id === socket.id)

    const getMq = data.player[getIndex].movesQueue */
    const getMq = data.player[clientIndex].movesQueue;
    getMq.push(clientData.latestMove);

    if (getMq.length > 5) getMq.shift();

    // this will update the database

    /* data.players[socket.id] = {
      id: socket.id,
      position: clientData.position,
      score: clientData.score,
      movesQueue: getMq,
    }; */

    /* data.player[getIndex].position = clientData.position
    data.player[getIndex].score = clientData.score;
    data.player[getIndex].movesQueue = getMq; */
    data.player[clientIndex].position = clientData.position;
    data.player[clientIndex].score = clientData.score;
    data.player[clientIndex].movesQueue = getMq;

    /* this will send the new player data to other clients. The data structure of 'clientData' is  
    
    {
      id: socket.id,
      position: --> the player position,
      score: --> the player current score,
      latestMove: latest move
    }

    */
    socket.broadcast.emit('character:updateData', data.player[clientIndex]);
  });

  socket.on('character:update-server-ready', ({ id, ready, roomId }) => {
    const getPlayerIndex = data.room[roomIndex].player.findIndex(
      (x) => x.id === id
    );
    data.room[roomIndex].player[getPlayerIndex].ready = ready;

    if (ready) {
      data.room[roomIndex].readyCount++;
    } else {
      data.room[roomIndex].readyCount--;
    }

    if (data.room[roomIndex].readyCount === data.room[roomIndex].player.length) {
      gameStart = true;
    } else {
      gameStart = false;
    }

      io.to(roomId).emit('character:update-client-ready', {
        id,
        ready,
        gameStart,
      });
  });

  socket.on('room:is-valid-url', (url) => {
    console.log(url);
    const isValidUrl = data.room.findIndex((x) => x.lobbyUrl === url);

    console.log(isValidUrl);
    socket.emit('game:is-valid-url', isValidUrl === -1 ? false : true);
  });

  socket.on('room:leave', (roomId) => {
    socket.leave(roomId)

    data.room[roomIndex].player.splice(clientIndex, 1)
    roomIndex = null
    clientIndex = null
    gameStart = false

    //TODO: If the person who made the room leaves, the second user who joined the room should inherit the (problem) responsibility.

    io.to(roomId).emit('room:player-leaves-room', socket.id)
  })
});


