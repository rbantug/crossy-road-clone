//@ts-check

import * as Types from '../../customTypes.js';

/**
 * Add new rows to the map
 * @param {Types.onGameAddRow} parameters
 * @returns
 */
export default function onGameAddRow({ io, state, data, utilAddRow }) {
  return () => {
    const roomIndex = data.room.findIndex(x => x.room_id === state.roomId)
    const newRows = utilAddRow(data.room[roomIndex].map);

    //@ts-ignore
    io.to(state.roomId).emit('game:add-rows', newRows);
  };
}