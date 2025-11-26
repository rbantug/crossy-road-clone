//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGameSetScore} parameters
 */
export default function onGameSetScore({ io, socket, playerService }) {
  /**
   * @param { number } score
   * @param { string } room_id
   */
  return async (score, room_id) => {
    await playerService.editPlayer({
      room_id,
      socket_id: socket.id,
      updateProp: { score },
    });
    io.to(room_id).emit('game:set-score', score, socket.id);
  };
}
