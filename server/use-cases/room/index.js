//@ts-check

import { roomDB } from '../../database/index.js';
import identity from '../../utils/id.js';
import makeAddRoom from './addRoom.js';
import makeDeleteRoom from './deleteRoom.js';
import makeEditRoom from './editRoom.js';
import makeListAllRooms from './listAllRooms.js';
import makeListRoomById from './listRoomById.js';

const addRoom = makeAddRoom({ roomDB });
const deleteRoom = makeDeleteRoom({
  roomDB,
  roomIdIsValid: identity.roomIdIsValid,
});
const editRoom = makeEditRoom({
  roomDB,
  roomIdIsValid: identity.roomIdIsValid,
});
const listAllRooms = makeListAllRooms({ roomDB });
const listRoomById = makeListRoomById({
  roomDB,
  roomIdIsValid: identity.roomIdIsValid,
});

const roomService = Object.freeze({
  addRoom,
  deleteRoom,
  editRoom,
  listAllRooms,
  listRoomById,
});

export default roomService;
