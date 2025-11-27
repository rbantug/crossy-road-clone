//@ts-check

import * as GlobalTypes from '../../../globalCustomTypes.js';
import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onRoomSetGameUrl} parameters
 */

export default function onRoomSetGameUrlParam({
  playerService,
  roomService,
  socket,
}) {
  //@ts-ignore
  return async (gameUrl, room_id, { lives, enableDuration, duration }) => {
    const gameParameters = {
      duration,
      enableDuration,
      lives,
    };

    await roomService.editRoom({
      room_id,
      updateProp: {
        gameUrl,
        gameParameters,
      },
    });

    await playerService.editPlayer({
      room_id,
      socket_id: socket.id,
      updateProp: {
        gameStart: true,
      },
    });
  };
}
