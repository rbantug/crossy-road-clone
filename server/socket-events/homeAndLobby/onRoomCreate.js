//@ts-check

import * as GlobalTypes from '../../../globalCustomTypes.js';
import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onRoomCreate} parameters
 */
export default function onRoomCreate({
  socket,
  data,
  createRoomId,
  outputPlayerData,
  state,
  utilAddRow,
  randomInt,
}) {
  return () => {
    //await addRoom();

    const room_id = createRoomId();

    /**
     * @type {GlobalTypes.RoomSchema}
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
     * @type {GlobalTypes.PlayerSchema}
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
