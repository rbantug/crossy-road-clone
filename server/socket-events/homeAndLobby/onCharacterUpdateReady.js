//@ts-check

import * as Types from '../../customTypes.js'

/**
 * @param {Types.onCharacterUpdateReady} parameters
 */

export default function onCharacterUpdateReady({ io, state, data }) {
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