//@ts-check

import * as Types from '../../customTypes.js';

/**
 * This updates the clientIndex of all clients in a single room
 * @param {Types.onRoomUpdateClientIndex} parameters
 * @returns
 */

export default function onRoomUpdateClientIndex({ socket, state, data }) {
  /**
   * @param {string} roomId - The room id of the current user
   */
  return (roomId) => {
    if (roomId === state.roomId) {
      const roomIndex = data.room.findIndex((x) => roomId === x.room_id);
      state.clientIndex = data.room[roomIndex].player.findIndex(
        //@ts-ignore
        (x) => x.id === socket.id
      );
    }
  };
}
