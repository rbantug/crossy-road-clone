//@ts-check

/**
 *
 * @param {{ roomDB: import("../../interface").returnMakeRoomDB, roomIdIsValid: Function }} param0
 * @returns Function
 */
export default function makeDeleteRoom({ roomDB, roomIdIsValid }) {
  /**
   * @param {{ room_id:string }} room_id
   * @returns string
   */
  return async function deleteRoom({ room_id }) {
    if (!roomIdIsValid(room_id)) {
      throw new Error('This is not a valid room id');
    }

    const result = await roomDB.deleteOneRoom({ id: room_id });

    return result;
  };
}
