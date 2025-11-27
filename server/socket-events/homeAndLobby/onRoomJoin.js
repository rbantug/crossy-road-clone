//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onRoomJoin} parameters
 */
export default function onRoomJoin({ io, socket, playerService, roomService }) {
  /**
   * @param {string} lobbyUrl
   */
  return async (lobbyUrl) => {
    const getRoom = await roomService.listAllRooms({ query: { lobbyUrl } });

    if (getRoom.length === 0) return;

    const { room_id, tileSet, readyCount, player } = getRoom[0];

    await playerService.addPlayer({ room_id, socket, tileSet });

    socket.join(room_id);

    let gameStart;
    if (readyCount === player.length) {
      gameStart = true;
    } else {
      gameStart = false;
    }

    await playerService.editPlayer({
      room_id,
      socket_id: socket.id,
      updateProp: { gameStart, roomId: room_id },
    });

    const roomDataToBeEmitted = await roomService.listRoomById({ room_id })
    io.to(room_id).emit('room:join-client', {
      data: roomDataToBeEmitted,
      gameStart,
      gameParam: roomDataToBeEmitted.gameParameters,
    });
  };
}
