//@ts-check

import * as Types from '../customTypes.js';
import onCharacterUpdateReady from '../socket-events/homeAndLobby/onCharacterUpdateReady.js';
import onDisconnect from '../socket-events/homeAndLobby/onDisconnect.js';
import onRoomCreate from '../socket-events/homeAndLobby/onRoomCreate.js';
import onRoomJoin from '../socket-events/homeAndLobby/onRoomJoin.js';
import onRoomLeave from '../socket-events/homeAndLobby/onRoomLeave.js';
import onRoomSendLobbyUrl from '../socket-events/homeAndLobby/onRoomSendLobbyUrl.js';
import onRoomSetGameUrlParam from '../socket-events/homeAndLobby/onRoomSetGameUrlParam.js';
import onRoomStartGame from '../socket-events/homeAndLobby/onRoomStartGame.js';

/**
 *
 * @param {Types.Listener} parameters
 */
export default function homeAndLobbyListener({
  io,
  socket,
  roomService,
  playerService,
  utilRemoveClient = Function,
  utilAddRow,
  createLobbyUrl,
  createGameUrl = Function,
}) {
  socket.on(
    'character:update-server-ready',
    onCharacterUpdateReady({ io, playerService, roomService })
  );

  socket.on(
    'disconnect',
    onDisconnect({ io, playerService, roomService, socket, utilRemoveClient })
  );

  socket.on(
    'room:create',
    onRoomCreate({
      socket,
      roomService,
      playerService,
      utilAddRow,
    })
  );

  socket.on(
    'room:join',
    onRoomJoin({ io, playerService, socket, roomService })
  );

  socket.on(
    'room:leave',
    onRoomLeave({ io, socket, playerService, roomService, utilRemoveClient })
  );

  socket.on(
    'room:sendLobbyUrl',
    onRoomSendLobbyUrl({
      socket,
      createLobbyUrl,
    })
  );

  /* socket.on(
    'room:set-game-url-other-players',
    onRoomSetGameUrlParam({ playerService, roomService, socket })
  ); */

  socket.on(
    'game:start-from-lobby',
    onRoomStartGame({ io, playerService, roomService, createGameUrl })
  );
}
