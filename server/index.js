//@ts-check
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import * as Types from './customTypes.js';
import gameListener from './listeners/game.js';
import homeAndLobbyListener from './listeners/homeAndLobby.js';
import playerService from './use-cases/player/index.js';
import roomService from './use-cases/room/index.js'
import { utilAddRow } from './utils/generateRows.js';
import identity from './utils/id.js';
import { utilRemoveClient } from './utils/removeClient.js';



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

  homeAndLobbyListener({
    io,
    socket,
    roomService,
    playerService,
    utilRemoveClient,
    utilAddRow,
    createLobbyUrl: identity.makeLobbyUrl,
    createGameUrl: identity.makeGameUrl,
  });

  gameListener({
    io,
    socket,
    playerService,
    roomService,
    utilAddRow,
    createLobbyUrl: identity.makeLobbyUrl,
  });
});
