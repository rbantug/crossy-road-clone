//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGamePlayerIsDead} parameters
 */
export default function onGamePlayerIsDead({ io, socket, state, data }) {
  return () => {
    const roomIndex = data.room.findIndex((x) => x.room_id === state.roomId);

    data.room[roomIndex].player[state.clientIndex].status = 'dead';
    data.room[roomIndex].activeAlivePlayers =
      data.room[roomIndex].activeAlivePlayers - 1;
    io.to(state.roomId).emit(
      'game:other-player-is-dead',
      socket.id,
      data.room[roomIndex].activeAlivePlayers
    );
  };
}
