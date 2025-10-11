//@ts-check
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import {
  createGameUrl,
  createLobbyUrl,
  createRoomId,
  data,
  outputPlayerData,
} from './data.js';
import {
  onCharacterUpdateReady,
  onDisconnect,
  onGameAddRow,
  onRoomCreate,
  onRoomIsValidUrl,
  onRoomJoin,
  onRoomLeave,
  onRoomSendLobbyUrl,
  onRoomStartGame,
  onRoomUpdateClientIndex,
} from './socketIO.js';
import { utilAddRow } from './utils/generateRows.js';

const app = express();
export const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  /**
   * client's state
   * @type {import('./customTypes.js').state}
   */

  const state = {
    clientIndex: null,
    roomIndex: null,
    gameStart: false,
    roomId: null,
    lobbyUrl: null,
    gameUrl: null,
  };

  socket.on('disconnect', onDisconnect({ io, state, data, socket }));

  socket.on(
    'room:create',
    onRoomCreate({
      socket,
      data,
      createRoomId,
      outputPlayerData,
      state,
      utilAddRow,
    })
  );

  socket.on(
    'room:sendLobbyUrl',
    onRoomSendLobbyUrl({
      socket,
      createLobbyUrl,
      state,
    })
  );

  socket.on(
    'room:join',
    onRoomJoin({ io, state, socket, data, outputPlayerData })
  );

  socket.on(
    'character:update-server-ready',
    onCharacterUpdateReady({ io, state, data })
  );

  socket.on('room:is-valid-url', onRoomIsValidUrl({ data, socket }));

  socket.on('room:leave', onRoomLeave({ io, socket, state, data }));

  socket.on(
    'room:update-client-index',
    onRoomUpdateClientIndex({ socket, state, data })
  );

  socket.on(
    'game:start-from-lobby',
    onRoomStartGame({ io, state, data, createGameUrl })
  );

  socket.on('game:request-new-rows', onGameAddRow({ io, state, data, utilAddRow }));

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
});
