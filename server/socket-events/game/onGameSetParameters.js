//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGameSetParameters} parameters
 */
export default function onGameSetParameters({ io, roomService, socket }) {
  /**
   * @param { object } gameParameters
   * @param { number } gameParameters.lives
   * @param { number } gameParameters.duration
   * @param { boolean } gameParameters.enableDuration
   * @param { string } room_id
   */
  return async ({ lives, duration, enableDuration }, room_id) => {
    const gameParameters = { lives, duration, enableDuration };
    const { gameParameters: updatedGameParam } = await roomService.editRoom({
      room_id,
      updateProp: { gameParameters },
    });

    io.to(room_id).emit(
      'game:set-client-game-params',
      socket.id,
      updatedGameParam
    );
  };
}
