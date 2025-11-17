//@ts-check

/**
 *
 * @param {{roomDB: import("../../interface").returnMakeRoomDB}} parameter
 * @returns
 */
export default function makeListAllRooms({ roomDB }) {
  return async function listAllRooms({ query = {} }) {
    const result = await roomDB.findAll({ query });
    return result;
  };
}
