//@ts-check

import makePlayer from '../../entities/player/index.js';

/**
 *
 * @param {{ playerDB: import('../../interface.d.ts').returnMakePlayerDB, roomIdIsValid: Function }} parameters
 */
export default function makeEditPlayer({ playerDB, roomIdIsValid }) {
  /**
   * @param {{ room_id: string, socket_id: string, updateProp: object }} parameters
   */
  return async function editPlayer({ room_id, socket_id, updateProp }) {
    if (!roomIdIsValid(room_id)) {
      throw new Error('This is not a valid room id');
    }

    const checkPlayer = makePlayer(updateProp);

    const updatePropKeys = Object.keys(updateProp);
    const toBeUpdatedObj = {};

    for (let p of updatePropKeys) {
      const capFirstChar = p[0].toUpperCase();
      const oldP = p;
      p = p.replace(p[0], capFirstChar);
      //@ts-ignore
      toBeUpdatedObj[oldP] = checkPlayer[`get${p}`]();
    }

    const result = await playerDB.updateOnePlayer({
      room_id,
      socket_id,
      updateProp: toBeUpdatedObj,
    });
    return result;
  };
}
