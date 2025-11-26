//@ts-check

import * as Types from '../../customTypes.js';

/**
 * Add new rows to the map
 * @param {Types.onGameAddRow} parameters
 * @returns
 */
export default function onGameAddRow({ io, roomService, utilAddRow }) {
  /**
   * @param { string } room_id
   */
  return async (room_id) => {
    const { map } = await roomService.listRoomById({ room_id })

    const newRows = utilAddRow(map.length)

    await roomService.editRoom({ room_id, updateProp: { map: newRows } })

    io.to(room_id).emit('game:add-rows', newRows);
  };
}