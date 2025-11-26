//@ts-check

import * as Types from '../../customTypes.js';

/**
 * This will run when the player exits from the popup window / result window
 * @param {Types.onGameExit} parameters
 */

export default function onGameExit({ roomService, playerService, socket }) {
  /**
   * @param { string } room_id
   */
  return async (room_id) => {
    await playerService.deletePlayer({ room_id, socket_id: socket.id })

    const getRoom = await roomService.listRoomById({ room_id })

    if (getRoom.player.length === 0) {
      await roomService.deleteRoom({ room_id })
    }
  };
}