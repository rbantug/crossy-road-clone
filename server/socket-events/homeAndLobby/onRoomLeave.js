//@ts-check

import * as Types from '../../customTypes.js';

/**
 * This is specifically made for players leaving the lobby. The game has not started so it is fine to remove the players.
 * @param {Types.onRoomLeave} parameters
 */

export default function onRoomLeave({
  io,
  socket,
  playerService,
  roomService,
  utilRemoveClient,
}) {
  /**
   * @param {string} room_id
   */
  return async (room_id) => {
    const roomRemoved = utilRemoveClient({ playerService, roomService, socket, room_id });

    if (!roomRemoved) {
      const getAllPlayers = await playerService.listAllPlayers({ room_id })
      const newRoomLeadId = getAllPlayers[0].id

      io.to(room_id).emit('room:player-leaves-room', socket.id, newRoomLeadId);
    }
  };
}
