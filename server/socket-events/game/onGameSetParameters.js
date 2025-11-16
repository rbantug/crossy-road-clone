//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGameSetParameters} parameters
 */
export default function onGameSetParameters({ io, state, socket, data }) {
  return ({ lives, duration, enableDuration }) => {
    const roomIndex = data.room.findIndex((x) => x.room_id === state.roomId);

    data.room[roomIndex].gameParameters.lives = lives;
    data.room[roomIndex].gameParameters.enableDuration = enableDuration;

    if (enableDuration) {
      data.room[roomIndex].gameParameters.duration = duration;
    }

    io.to(state.roomId).emit(
      'game:set-client-game-params',
      socket.id,
      data.room[roomIndex].gameParameters
    );
  };
}
