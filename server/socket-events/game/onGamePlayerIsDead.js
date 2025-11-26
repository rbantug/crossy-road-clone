//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGamePlayerIsDead} parameters
 */
export default function onGamePlayerIsDead({ io, socket, playerService, roomService }) {
  /**
   * @param { string } room_id
   */
  return async (room_id) => {
    await playerService.editPlayer({ room_id, socket_id: socket.id, updateProp: { status: 'dead' } })

    const { activeAlivePlayers } = await roomService.listRoomById({ room_id })

    await roomService.editRoom({ room_id, updateProp: { activeAlivePlayers: activeAlivePlayers - 1 } })

    io.to(room_id).emit(
      'game:other-player-is-dead',
      socket.id,
      activeAlivePlayers - 1
    );
  };
}
