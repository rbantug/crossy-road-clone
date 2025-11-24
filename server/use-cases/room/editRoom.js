//@ts-check
import * as GlobalTypes from '../../../globalCustomTypes.js';
import makeRoom from '../../entities/room/index.js';

/**
 *
 * @param {{ roomDB: import("../../interface").returnMakeRoomDB, roomIdIsValid: Function }} parameter
 */
export default function makeEditRoom({ roomDB, roomIdIsValid }) {
  /**
   * @param { object } parameters
   * @param { string } parameters.room_id
   * @param { Partial<GlobalTypes.RoomSchema> } parameters.updateProp
   */
  return async function editRoom({ room_id, updateProp }) {
    if (!roomIdIsValid(room_id)) {
      throw new Error('This is not a valid room id');
    }

    if (Object.hasOwn(updateProp, 'player')) {
      throw new Error('Please use editPlayer when updating players');
    }

    // This will make sure that whatever is in updateProp will be validated by Joi through makeRoom(). And only those properties in updateProp will be updated in the database.
    const checkRoom = makeRoom({ ...updateProp, type: 'updateRoom' });

    const updatePropKeys = Object.keys(updateProp);
    const toBeUpdatedObj = {};

    for (let p of updatePropKeys) {
      const capFirstChar = p[0].toUpperCase();
      const oldP = p;
      p = p.replace(p[0], capFirstChar);
      //@ts-ignore
      toBeUpdatedObj[oldP] = checkRoom[`get${p}`]();
    }

    if (Object.hasOwn(updateProp, 'newCurrentTile')) {
      // get current tileSet
      const room = await roomDB.findRoomById({ id: room_id });
      const getTileSet = room.tileSet;

      // check if the currentTile to be inserted to the tileSet has no duplicate in the tileSet array.

      if (getTileSet.includes(updateProp.newCurrentTile)) {
        throw new Error('The currentTile is not a unique number');
      }

      const result = await roomDB.updateRoomTileSet({
        room_id,
        currentTile: toBeUpdatedObj.newCurrentTile,
        operation: 'push',
      });
      return result;
    }

    if (Object.hasOwn(updateProp, 'deleteCurrentTile')) {
      const result = await roomDB.updateRoomTileSet({
        room_id,
        currentTile: toBeUpdatedObj.deleteCurrentTile,
        operation: 'delete',
      });
      return result;
    }

    if (Object.hasOwn(updateProp, 'map')) {
      const result = await roomDB.updateRoomMap({
        room_id,
        map: toBeUpdatedObj.map,
      });
      return result;
    }

    const result = await roomDB.updateOneRoom({
      id: room_id,
      updateProp: toBeUpdatedObj,
    });
    return result;
  };
}
