//@ts-check

import * as GlobalTypes from '../../../globalCustomTypes.js';
import makePlayer from '../../entities/player/index.js';

/**
 *
 * @param {{ playerDB: import('../../interface.d.ts').returnMakePlayerDB, roomIdIsValid: Function }} parameters
 */
export default function makeEditAllPlayers({ playerDB, roomIdIsValid }) {
  /**
   * @param { object } parameters
   * @param { string } parameters.room_id
   * @param { Partial<GlobalTypes.PlayerSchema> } parameters.updateProp
   */
  return async function editAllPlayers({ room_id, updateProp }) {
    if (!roomIdIsValid(room_id)) {
      throw new Error('This is not a valid room id');
    }

    const checkPlayer = makePlayer({ ...updateProp, type: 'updatePlayer' });

    const updatePropKeys = Object.keys(updateProp);
    const toBeUpdatedObj = {};

    for (let p of updatePropKeys) {
      const capFirstChar = p[0].toUpperCase();
      const oldP = p;
      p = p.replace(p[0], capFirstChar);
      //@ts-ignore
      toBeUpdatedObj[oldP] = checkPlayer[`get${p}`]();
    }

    const result = await playerDB.updateAllPlayers({
      room_id,
      updateProp: toBeUpdatedObj,
    });

    return result
  };
}
