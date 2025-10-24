//@ts-check

import * as Types from '../customTypes.js';
import { utilRemoveClient } from '../utils/removeClient.js';

/**
 *
 * @param {Types.onDisconnect} parameters
 */

function onDisconnect({ io, state, data, socket }) {
  return () => {
    // No players will be removed when the game is ongoing.
    if (state.gameUrl !== null) {
      return;
    }

    if (state.roomId !== null) {
      const roomRemoved = utilRemoveClient({
        data,
        state,
        socket,
        roomId: state.roomId,
      });

      if (!roomRemoved) {
        const newRoomLeadId = data.room[state.roomIndex].player[0].id;

        io.to(state.roomId).emit(
          'room:player-leaves-room',
          socket.id,
          newRoomLeadId
        );
      }
    }

    console.log('user disconnected');
  };
}

/**
 *
 * @param {import('../customTypes.js').onRoomSendLobbyUrl} parameters
 */

function onRoomSendLobbyUrl({ socket, createLobbyUrl, state }) {
  return () => {
    const newLobbyUrl = createLobbyUrl();
    state.lobbyUrl = newLobbyUrl;
    socket.emit('room:getLobbyUrl', newLobbyUrl);
  };
}

/**
 *
 * @param {Types.onRoomCreate} parameters
 */
function onRoomCreate({
  socket,
  data,
  createRoomId,
  outputPlayerData,
  state,
  utilAddRow,
}) {
  return () => {
    const room_id = createRoomId();

    /**
     * @type {import('../customTypes.js').RoomSchema}
     */
    const roomData = {
      room_id,
      player: [],
      map: [],
      lobbyUrl: state.lobbyUrl,
      gameUrl: state.gameUrl,
      tileSet: new Set(),
      readyCount: 0,
      activeAlivePlayers: null
    };

    utilAddRow(roomData.map);

    state.roomId = room_id;

    /**
     * @type {import('../customTypes.js').PlayerSchema}
     */
    const playerData = outputPlayerData(socket, roomData.tileSet);

    playerData.createdRoom = true;

    const cIndex = roomData.player.push(playerData);
    state.clientIndex = cIndex - 1;

    const rIndex = data.room.push(roomData);
    state.roomIndex = rIndex - 1;

    socket.join(room_id);

    socket.emit('game:init', {
      room_id: roomData.room_id,
      player: roomData.player,
      map: roomData.map,
      lobbyUrl: roomData.lobbyUrl,
    });
  };
}

/**
 *
 * @param {Types.onRoomJoin} parameters
 */
function onRoomJoin({ io, socket, data, state, outputPlayerData }) {
  /**
   * @param {string} lobbyUrl
   */
  return (lobbyUrl) => {
    state.roomIndex = data.room.findIndex(
      // @ts-ignore
      (x) => x.lobbyUrl === lobbyUrl
    );

    if (state.roomIndex === -1) return;

    state.lobbyUrl = lobbyUrl

    state.roomId = data.room[state.roomIndex].room_id;

    /**
     * @type {import('../customTypes.js').PlayerSchema}
     */
    const playerData = outputPlayerData(
      socket,
      data.room[state.roomIndex].tileSet
    );

    const cIndex = data.room[state.roomIndex].player.push(playerData);

    state.clientIndex = cIndex - 1;

    socket.join(data.room[state.roomIndex].room_id);

    if (
      data.room[state.roomIndex].readyCount ===
      data.room[state.roomIndex].player.length
    ) {
      state.gameStart = true;
    } else {
      state.gameStart = false;
    }

    const gameStart = state.gameStart;

    io.to(data.room[state.roomIndex].room_id).emit('room:join-client', {
      data: data.room[state.roomIndex],
      gameStart,
      gameParam: state.gameParameters
    });
  };
}
/**
 * @param {Types.onCharacterUpdateReady} parameters
 */

function onCharacterUpdateReady({ io, state, data }) {
  /**
   * @param {{id:string,ready:boolean,roomId:string}} data - id is the socket.id of the client that updated their 'ready'
   */
  return ({ id, ready, roomId }) => {
    const getPlayerIndex = data.room[state.roomIndex].player.findIndex(
      //@ts-ignore
      (x) => x.id === id
    );
    data.room[state.roomIndex].player[getPlayerIndex].ready = ready;

    if (ready) {
      data.room[state.roomIndex].readyCount++;
    } else {
      data.room[state.roomIndex].readyCount--;
    }

    if (
      data.room[state.roomIndex].readyCount ===
      data.room[state.roomIndex].player.length
    ) {
      state.gameStart = true;
    } else {
      state.gameStart = false;
    }

    const gameStart = state.gameStart;

    io.to(roomId).emit('character:update-client-ready', {
      id,
      ready,
      gameStart,
    });
  };
}

/**
 *
 * @param {Types.onRoomIsValidUrl} parameters
 */

function onRoomIsValidUrl({ data, socket }) {
  /**
   * @param {string} url
   */
  return (url) => {
    console.log(url);
    const isValidUrl = data.room.findIndex(
      //@ts-ignore
      (x) => x.lobbyUrl === url
    );

    console.log(isValidUrl);
    socket.emit('game:is-valid-url', isValidUrl === -1 ? false : true);
  };
}

/**
 * This is specifically made for players leaving the lobby. The game has not started so it is fine to remove the players.
 * @param {Types.onRoomLeave} parameters
 */

function onRoomLeave({ io, socket, state, data }) {
  /**
   * @param {string} roomId
   */
  return (roomId) => {
    const roomRemoved = utilRemoveClient({ data, state, socket, roomId });

    if (!roomRemoved) {
      const newRoomLeadId = data.room[state.roomIndex].player[0].id;

      state.roomIndex = null;
      state.clientIndex = null;
      state.gameStart = false;
      state.lobbyUrl = null;

      io.to(roomId).emit('room:player-leaves-room', socket.id, newRoomLeadId);

      state.roomId = null;
    }
  };
}

/**
 * This updates the clientIndex of all clients in a single room
 * @param {import('../customTypes.js').onRoomUpdateClientIndex} parameters
 * @returns
 */

function onRoomUpdateClientIndex({ socket, state, data }) {
  /**
   * @param {string} roomId - The room id of the current user
   */
  return (roomId) => {
    if (roomId === state.roomId) {
      state.clientIndex = data.room[state.roomIndex].player.findIndex(
        //@ts-ignore
        (x) => x.id === socket.id
      );
    }
  };
}

/**
 * This will send the game url to all clients in the room. All players will be considered connected in the game.
 * @param {import('../customTypes.js').onRoomStartGame} parameters
 * @returns
 */
function onRoomStartGame({ io, state, data, createGameUrl }) {
  return () => {
    const gameUrl = createGameUrl();
    state.gameUrl = gameUrl;
    data.room[state.roomIndex].gameUrl = gameUrl;
    data.room[state.roomIndex].player.forEach(
      /**
       * 
       * @param {import('../customTypes.js').PlayerSchema} x 
       */
      (x) => {
        x.gameConnectionStatus = 'connected'
      }
    )
    const AAPlayers = data.room[state.roomIndex].player.length;

    data.room[state.roomIndex].activeAlivePlayers = AAPlayers

    io.to(state.roomId).emit('room:get-game-url', gameUrl, AAPlayers);
  };
}
/**
 * 
 * @param {import('../customTypes.js').onRoomSetGameUrl} parameters 
 */

function onRoomSetGameUrlParam({ state,data }) {
  //@ts-ignore
  return (url, { lives, enableDuration, duration }) => {
    state.gameUrl = url;
    state.gameStart = true
    state.gameParameters.lives = lives
    state.gameParameters.enableDuration = enableDuration

    if (enableDuration) {
      state.gameParameters.duration = duration
    }

    //@ts-ignore
    data.room[state.roomIndex].player.forEach(
      /**
       *
       * @param {import('../customTypes.js').PlayerSchema} x
       */
      (x) => {
        x.gameConnectionStatus = 'connected';
      }
    );
  }
}

export {
  onCharacterUpdateReady,
  onDisconnect,
  onRoomCreate,
  onRoomIsValidUrl,
  onRoomJoin,
  onRoomLeave,
  onRoomSendLobbyUrl,
  onRoomSetGameUrlParam,
  onRoomStartGame,
  onRoomUpdateClientIndex,
};
