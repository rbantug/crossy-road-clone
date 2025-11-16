//@ts-check

import * as Types from '../../customTypes.js';

/**
 * This will run when the player exits from the popup window / result window
 * @param {Types.onGameExit} parameters
 */

export default function onGameExit({ state, data }) {
  return () => {
    const oldRoomIndex = data.room.findIndex((x) => x.room_id === state.roomId);

    data.room[oldRoomIndex].player.splice(state.clientIndex, 1);

    if (data.room[oldRoomIndex].player.length === 0) {
      data.room.splice(oldRoomIndex, 1);
    }

    state.clientIndex = null;
    state.gameStart = false;
    state.roomId = null;
    state.lobbyUrl = null;
    state.gameUrl = null;
  };
}