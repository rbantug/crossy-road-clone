//@ts-check

/**
 *
 * @param {{ playerDB: import('../../interface.d.ts').returnMakePlayerDB, roomIdIsValid: Function }} parameters
 */
export default function makeListAllPlayers({ playerDB, roomIdIsValid }) {
  /**
   * @param {{ room_id: string }} parameters
   */
  return async function listAllPlayers({ room_id }) {
    if (!roomIdIsValid(room_id)) {
      throw new Error('This is not a valid room id');
    }

    const result = await playerDB.findAllPlayers({ room_id });
    return result;
  };
}
