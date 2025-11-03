//@ts-check

import * as Types from '../customTypes.js';

/**
 *
 * @param {Types.onDisconnect} parameters
 */

function onDisconnect({ io, state, data, socket, utilRemoveClient }) {
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
        const roomIndex = data.room.findIndex(
          (x) => x.room_id === state.roomId
        );
        const newRoomLeadId = data.room[roomIndex].player[0].id;

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
  randomInt,
}) {
  return () => {
    const room_id = createRoomId();

    /**
     * @type {import('../../globalCustomTypes.js').RoomSchema}
     */
    const roomData = {
      room_id,
      player: [],
      map: [],
      lobbyUrl: state.lobbyUrl,
      gameUrl: state.gameUrl,
      tileSet: new Set(),
      readyCount: 0,
      activeAlivePlayers: null,
      hasNewRoom: false,
      newLobbyUrl: null,
      gameParameters: {
        duration: 5,
        enableDuration: true,
        lives: 3,
      },
    };

    utilAddRow(roomData.map);

    state.roomId = room_id;

    /**
     * @type {import('../../globalCustomTypes.js').PlayerSchema}
     */
    const playerData = outputPlayerData(socket, roomData.tileSet, randomInt);

    playerData.createdRoom = true;

    const cIndex = roomData.player.push(playerData);
    state.clientIndex = cIndex - 1;

    data.room.push(roomData);

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
function onRoomJoin({ io, socket, data, state, outputPlayerData, randomInt }) {
  /**
   * @param {string} lobbyUrl
   */
  return (lobbyUrl) => {
    const roomIndex = data.room.findIndex(
      // @ts-ignore
      (x) => x.lobbyUrl === lobbyUrl
    );

    if (roomIndex === -1) return;

    state.lobbyUrl = lobbyUrl;

    state.roomId = data.room[roomIndex].room_id;

    /**
     * @type {import('../../globalCustomTypes.js').PlayerSchema}
     */
    const playerData = outputPlayerData(
      socket,
      data.room[roomIndex].tileSet,
      randomInt
    );

    const cIndex = data.room[roomIndex].player.push(playerData);

    state.clientIndex = cIndex - 1;

    socket.join(data.room[roomIndex].room_id);

    if (
      data.room[roomIndex].readyCount ===
      data.room[roomIndex].player.length
    ) {
      state.gameStart = true;
    } else {
      state.gameStart = false;
    }

    const gameStart = state.gameStart;

    io.to(data.room[roomIndex].room_id).emit('room:join-client', {
      data: data.room[roomIndex],
      gameStart,
      gameParam: data.room[roomIndex].gameParameters,
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
    const roomIndex = data.room.findIndex(x => roomId === x.room_id)
    const getPlayerIndex = data.room[roomIndex].player.findIndex(
      //@ts-ignore
      (x) => x.id === id
    );
    data.room[roomIndex].player[getPlayerIndex].ready = ready;

    if (ready) {
      data.room[roomIndex].readyCount++;
    } else {
      data.room[roomIndex].readyCount--;
    }

    if (
      data.room[roomIndex].readyCount ===
      data.room[roomIndex].player.length
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

function onRoomLeave({ io, socket, state, data, utilRemoveClient }) {
  /**
   * @param {string} roomId
   */
  return (roomId) => {
    const roomRemoved = utilRemoveClient({ data, state, socket, roomId });

    if (!roomRemoved) {
      const roomIndex = data.room.findIndex(x => roomId === x.room_id)
      const newRoomLeadId = data.room[roomIndex].player[0].id;

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
      const roomIndex = data.room.findIndex(x => roomId === x.room_id)
      state.clientIndex = data.room[roomIndex].player.findIndex(
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
    const roomIndex = data.room.findIndex(x => state.roomId === x.room_id)

    const gameUrl = createGameUrl();
    state.gameUrl = gameUrl;
    data.room[roomIndex].gameUrl = gameUrl;
    data.room[roomIndex].player.forEach(
      /**
       *
       * @param {import('../../globalCustomTypes.js').PlayerSchema} x
       */
      (x) => {
        x.gameConnectionStatus = 'connected';
      }
    );
    const AAPlayers = data.room[roomIndex].player.length;

    data.room[roomIndex].activeAlivePlayers = AAPlayers;

    io.to(state.roomId).emit('room:get-game-url', gameUrl, AAPlayers);
  };
}
/**
 *
 * @param {import('../customTypes.js').onRoomSetGameUrl} parameters
 */

function onRoomSetGameUrlParam({ state, data }) {
  //@ts-ignore
  return (url, { lives, enableDuration, duration }) => {
    const roomIndex = data.room.findIndex((x) => state.roomId === x.room_id);

    state.gameUrl = url;
    state.gameStart = true;
    data.room[roomIndex].gameParameters.lives = lives;
    data.room[roomIndex].gameParameters.enableDuration = enableDuration;

    if (enableDuration) {
      data.room[roomIndex].gameParameters.duration = duration;
    }

    data.room[roomIndex].player.forEach(
      /**
       *
       * @param {import('../../globalCustomTypes.js').PlayerSchema} x
       */
      (x) => {
        x.gameConnectionStatus = 'connected';
      }
    );
  };
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
