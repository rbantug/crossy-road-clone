//@ts-check

import * as Types from '../../customTypes.js'

/**
 *
 * @param {Types.onDisconnect} parameters
 */

export default function onDisconnect({ io, state, data, socket, utilRemoveClient }) {
  return () => {
    // No players will be removed when the game is ongoing.
    if (state.gameUrl !== null) {
      return;
    }

    if (state.roomId !== null) {
      const roomRemoved = utilRemoveClient({
        data,
        state,
        socket,
        roomId: state.roomId,
      });

      if (!roomRemoved) {
        const roomIndex = data.room.findIndex(
          (x) => x.room_id === state.roomId
        );
        const newRoomLeadId = data.room[roomIndex].player[0].id;

        io.to(state.roomId).emit(
          'room:player-leaves-room',
          socket.id,
          newRoomLeadId
        );
      }
    }

    console.log('user disconnected');
  };
}