//@ts-check

import * as Types from '../../customTypes.js';

/**
 * @param {Types.onCharacterUpdateReady} parameters
 */

export default function onCharacterUpdateReady({
  io,
  playerService,
  roomService,
}) {
  /**
   * @param { object } parameters
   * @param { string } parameters.id - it is the socket.id of the client that updated their 'ready'
   * @param { boolean } parameters.ready
   * @param { string } parameters.room_id
   */
  return async ({ id, ready, room_id }) => {
    const roomData = await roomService.listRoomById({ room_id });

    let readyCount = roomData.readyCount;

    if (ready) {
      readyCount++;
    } else {
      readyCount--;
    }

    let gameStart;

    if (readyCount === roomData.player.length) {
      gameStart = true;
    } else {
      gameStart = false;
    }

    await roomService.editRoom({
      room_id,
      updateProp: { readyCount },
    });
    const {
      gameStart: resGameStart,
      ready: resReady,
      ...others
    } = await playerService.editPlayer({
      socket_id: id,
      room_id,
      updateProp: { gameStart, ready },
    });

    io.to(room_id).emit('character:update-client-ready', {
      id,
      resReady,
      resGameStart,
    });
  };
}
