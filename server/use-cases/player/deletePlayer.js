//@ts-check

/**
 *
 * @param {{ playerDB: import('../../interface.d.ts').returnMakePlayerDB, roomIdIsValid: Function }} parameters
 * @returns Function
 */
export default function makeDeletePlayer({ playerDB, roomIdIsValid }) {
  /**
   * @param {{ room_id: string, socket_id: string }} parameters
   */
  return async function deletePlayer({ room_id, socket_id }) {
    if (!roomIdIsValid(room_id)) {
      throw new Error('This is not a valid room id');
    }

    const playerCount = await playerDB.deleteOnePlayer({ socket_id, room_id });
    return playerCount;
  };
}
