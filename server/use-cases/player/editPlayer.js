//@ts-check

import * as GlobalTypes from '../../../globalCustomTypes.js';
import makePlayer from '../../entities/player/index.js';

/**
 *
 * @param {{ playerDB: import('../../interface.d.ts').returnMakePlayerDB, roomIdIsValid: Function }} parameters
 */
export default function makeEditPlayer({ playerDB, roomIdIsValid }) {
  /**
   * @param {object} parameters
   * @param { string } parameters.room_id
   * @param { string } parameters.socket_id
   * @param { Partial<GlobalTypes.PlayerSchema> } parameters.updateProp
   * @param { 'push'|'shift' } [parameters.operation]
   */
  return async function editPlayer({
    room_id,
    socket_id,
    updateProp,
    operation,
  }) {
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

    if (Object.hasOwn(updateProp, 'currentMove')) {
      const result = await playerDB.updatePlayerMovesQueue({
        room_id,
        socket_id,
        move: updateProp.currentMove,
        operation,
      });
      return result;
    }

    const result = await playerDB.updateOnePlayer({
      room_id,
      socket_id,
      updateProp: toBeUpdatedObj,
    });
    return result;
  };
}
