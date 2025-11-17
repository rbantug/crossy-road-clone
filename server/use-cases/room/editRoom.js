//@ts-check

import makeRoom from '../../entities/room/index.js';

/**
 *
 * @param {{ roomDB: import("../../interface").returnMakeRoomDB, roomIdIsValid: Function }} parameter
 */
export default function makeEditRoom({ roomDB, roomIdIsValid }) {
  /**
   * @param {{ room_id:string, updateProp: object }} parameter
   */
  return async function editRoom({ room_id, updateProp }) {
    if (!roomIdIsValid(room_id)) {
      throw new Error('This is not a valid room id');
    }

    if (Object.hasOwn(updateProp, 'player')) {
      throw new Error('Please use editPlayer when updating players')
    }

    // This will make sure that whatever is in updateProp will be validated by Joi through makeRoom(). And only those properties in updateProp will be updated in the database.
    const checkRoom = makeRoom(updateProp)

    const updatePropKeys = Object.keys(updateProp)
    const toBeUpdatedObj = {}

    for (let p of updatePropKeys) {
      const capFirstChar = p[0].toUpperCase()
      const oldP = p
      p = p.replace(p[0], capFirstChar)
      //@ts-ignore
      toBeUpdatedObj[oldP] = checkRoom[`get${p}`]()
    }

    const result = await roomDB.updateOneRoom({ id: room_id, updateProp: toBeUpdatedObj });
    return result;
  };
}
