//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGameCharacterMove} parameters
 * @returns
 */
export default function onGameCharacterMove({ io, socket, data, state }) {
  return (latestMove) => {
    const roomIndex = data.room.findIndex((x) => x.room_id === state.roomId);

    const mqLength =
      data.room[roomIndex].player[state.clientIndex].movesQueue.push(
        latestMove
      );

    if (mqLength > 5) {
      data.room[roomIndex].player[state.clientIndex].movesQueue.shift();
    }

    io.to(state.roomId).emit('game:character-update-move', {
      clientId: socket.id,
      move: data.room[roomIndex].player[state.clientIndex].movesQueue[
        data.room[roomIndex].player[state.clientIndex].movesQueue.length - 1
      ],
    });
  };
}
