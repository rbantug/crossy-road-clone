//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGamePlayerHit} parameters
 */
export default function onGamePlayerHit({ io, socket }) {
  /**
   * @param { string } room_id
   */
  return (room_id) => {
    io.to(room_id).emit('game:other-player-iframe', socket.id);
  };
}
