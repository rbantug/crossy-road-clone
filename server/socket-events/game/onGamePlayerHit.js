//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGamePlayerHit} parameters
 */
export default function onGamePlayerHit({ io, socket, state }) {
  return () => {
    io.to(state.roomId).emit('game:other-player-iframe', socket.id);
  };
}
