//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onDisconnect} parameters
 */

export default function onDisconnect({
  io,
  playerService,
  roomService,
  utilRemoveClient,
  socket
}) {
  return async () => {
    const socketRoomList = socket.rooms.values();
    socketRoomList.next();
    const getRoomId = socketRoomList.next().value; // if the player is not part of any room, this should be undefined

    const roomData = await roomService.listRoomById({ room_id: getRoomId })

    // No players will be removed when the game is ongoing.
    if (roomData.gameUrl !== null) {
      return;
    }

    if (getRoomId !== undefined) {
      const roomRemoved = await utilRemoveClient({
        roomService,
        playerService,
        socket,
        room_id: getRoomId,
      });

      if (!roomRemoved) {
        const getAllPlayers = await playerService.listAllPlayers({ room_id: getRoomId })

        io.to(getRoomId).emit(
          'room:player-leaves-room',
          socket.id,
          getAllPlayers[0].id
        );
      }
    }

    console.log('user disconnected');
  };
}
