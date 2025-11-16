//@ts-check

import * as Types from '../../customTypes.js';

/**
 * This is specifically made for players leaving the lobby. The game has not started so it is fine to remove the players.
 * @param {Types.onRoomLeave} parameters
 */

export default function onRoomLeave({
  io,
  socket,
  state,
  data,
  utilRemoveClient,
}) {
  /**
   * @param {string} roomId
   */
  return (roomId) => {
    const roomRemoved = utilRemoveClient({ data, state, socket, roomId });

    if (!roomRemoved) {
      const roomIndex = data.room.findIndex((x) => roomId === x.room_id);
      const newRoomLeadId = data.room[roomIndex].player[0].id;

      state.clientIndex = null;
      state.gameStart = false;
      state.lobbyUrl = null;

      io.to(roomId).emit('room:player-leaves-room', socket.id, newRoomLeadId);

      state.roomId = null;
    }
  };
}
