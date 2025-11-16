//@ts-check

import * as GlobalTypes from '../../../globalCustomTypes.js';
import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onRoomJoin} parameters
 */
export default function onRoomJoin({
  io,
  socket,
  data,
  state,
  outputPlayerData,
  randomInt,
}) {
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
     * @type {GlobalTypes.PlayerSchema}
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
      data.room[roomIndex].readyCount === data.room[roomIndex].player.length
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
