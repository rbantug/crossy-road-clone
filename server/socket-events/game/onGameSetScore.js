//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGameSetScore} parameters
 */
export default function onGameSetScore({ io, socket, state, data }) {
  /**
   * @param { number } score
   */
  return (score) => {
    const roomIndex = data.room.findIndex((x) => x.room_id === state.roomId);

    data.room[roomIndex].player[state.clientIndex].score = score;
    io.to(state.roomId).emit('game:set-score', score, socket.id);
  };
}
