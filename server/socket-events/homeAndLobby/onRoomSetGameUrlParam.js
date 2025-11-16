//@ts-check

import * as GlobalTypes from '../../../globalCustomTypes.js';
import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onRoomSetGameUrl} parameters
 */

export default function onRoomSetGameUrlParam({ state, data }) {
  //@ts-ignore
  return (url, { lives, enableDuration, duration }) => {
    const roomIndex = data.room.findIndex((x) => state.roomId === x.room_id);

    state.gameUrl = url;
    state.gameStart = true;
    data.room[roomIndex].gameParameters.lives = lives;
    data.room[roomIndex].gameParameters.enableDuration = enableDuration;

    if (enableDuration) {
      data.room[roomIndex].gameParameters.duration = duration;
    }

    data.room[roomIndex].player.forEach(
      /**
       *
       * @param {GlobalTypes.PlayerSchema} x
       */
      (x) => {
        x.gameConnectionStatus = 'connected';
      }
    );
  };
}
