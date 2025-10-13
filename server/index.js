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
import { onGameAddRow, onGameCharacterMove } from './listeners/game.js';
import {
  onCharacterUpdateReady,
  onDisconnect,
  onRoomCreate,
  onRoomIsValidUrl,
  onRoomJoin,
  onRoomLeave,
  onRoomSendLobbyUrl,
  onRoomStartGame,
  onRoomUpdateClientIndex,
} from './listeners/homeAndLobby.js';
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

  socket.on(
    'game:request-new-rows',
    onGameAddRow({ io, state, data, utilAddRow })
  );

  socket.on(
    'game:character-move',
    onGameCharacterMove({ io, socket, data, state })
  );
});
