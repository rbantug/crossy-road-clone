//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGameRetry} parameters
 */
export default function onGameRetry({
  io,
  data,
  socket,
  state,
  createRoomId,
  createLobbyUrl,
  outputPlayerData,
  utilAddRow,
  randomInt,
}) {
  return () => {
    io.to(state.roomId).emit('game:show-retryBtn-cd', socket.id);

    const oldRIndex = data.room.findIndex((x) => x.room_id === state.roomId);
    const oldCIndex = state.clientIndex;
    socket.leave(state.roomId);

    // delete player data from data.room.player

    data.room[oldRIndex].player.splice(oldCIndex, 1);

    // reset state to default values
    state.clientIndex = null;
    state.gameStart = false;
    state.roomId = null;
    state.lobbyUrl = null;
    state.gameUrl = null;

    // if data.room.hasNewRoom is false, create a new room
    if (data.room[oldRIndex].hasNewRoom === false) {
      const room_id = createRoomId();
      const lobbyUrl = createLobbyUrl();

      state.lobbyUrl = lobbyUrl;
      state.roomId = room_id;

      data.room[oldRIndex].newLobbyUrl = lobbyUrl;

      const roomData = {
        room_id,
        player: [],
        map: [],
        lobbyUrl: state.lobbyUrl,
        gameUrl: null,
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

      const playerData = outputPlayerData(socket, roomData.tileSet, randomInt);

      playerData.createdRoom = true;

      const cIndex = roomData.player.push(playerData);
      state.clientIndex = cIndex - 1;

      data.room.push(roomData);

      socket.join(room_id);

      data.room[oldRIndex].hasNewRoom = true;

      socket.emit('game:init', {
        room_id: roomData.room_id,
        player: roomData.player,
        map: roomData.map,
        lobbyUrl: roomData.lobbyUrl,
      });

      socket.emit('game:go-to-new-lobby', lobbyUrl);
    } else {
      // if data.room.hasNewRoom is true, emit the new lobbyUrl

      // retrieve newLobbyUrl from old room data
      const { newLobbyUrl } = data.room[oldRIndex];
      const newRoomIndex = data.room.findIndex(
        (x) => x.lobbyUrl === newLobbyUrl
      );

      // find new room and join it
      const { room_id } = data.room[newRoomIndex];
      socket.join(room_id);

      socket.emit('game:go-to-new-lobby', newLobbyUrl);
    }

    // if old room has no more player, delete it
    if (data.room[oldRIndex].player.length === 0) {
      data.room.splice(oldRIndex, 1);
    }
  };
}
