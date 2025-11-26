//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGameCharacterMove} parameters
 * @returns
 */
export default function onGameCharacterMove({ io, socket, playerService }) {
  /**
   * @param { string } latestMove
   * @param { string } room_id
   */
  return async (latestMove, room_id) => {
    const { movesQueue } = await playerService.editPlayer({
      room_id,
      socket_id: socket.id,
      updateProp: { currentMove: latestMove },
      operation: 'push'
    });

    if (movesQueue.length > 5) {
      await playerService.editPlayer({
        room_id,
        socket_id: socket.id,
        updateProp: { currentMove: '' },
        operation: 'shift'
      });
    }

    io.to(room_id).emit('game:character-update-move', {
      clientId: socket.id,
      move: movesQueue[movesQueue.length - 1],
    });
  };
}
