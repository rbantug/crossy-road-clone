import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { randomInt } from 'crypto';

/* import { data, outputTile } from './sampleData.js'; */

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

const data = {
  players: {}
}

const tileSet = new Set();

function outputTile() {
  let tileIndex;
  do {
    tileIndex = randomInt(-8, 9);
  } while (tileSet.has(tileIndex));

  return tileIndex;
}

io.on('connection', (socket) => {
  console.log('a user connected');

  data.players[socket.id] = {
    id: socket.id,
    position: {
      currentRow: 0,
      currentTile: outputTile(),
    },
    score: 0,
    movesQueue: [],
  };

  console.log(data);

  io.emit('game:init', data)

  socket.on('disconnect', () => {
    console.log('user disconnected');

    delete data.players[socket.id]

    console.log(data);

    io.emit('character:delete', socket.id);
  });

  socket.on('data:playerData:update', (clientData) => {
    // The plan is to have a queue for the movesQueue with a length of 5. 

    const getMq = data.players[socket.id].movesQueue;
    getMq.push(clientData.latestMove);

    if (getMq.length > 5) getMq.shift();

    // this will update the database

    data.players[socket.id] = {
      id: socket.id,
      position: clientData.position,
      score: clientData.score,
      movesQueue: getMq,
    };

    /* this will send the new player data to other clients. The data structure of 'clientData' is  
    
    {
      id: socket.id,
      position: --> the player position,
      score: --> the player current score,
      latestMove: latest move
    }

    */
    socket.broadcast.emit('character:updateData', clientData);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
