import * as GlobalTypes from '../globalCustomTypes.js';
import { Socket } from 'socket.io';

export interface Deep {
  [key: string]: DeepNestedObject;
}

export interface returnMakeRoomDB {
  findAll({ query: object }): Promise<GlobalTypes.RoomSchema[]>;
  findRoomById({ id: string }): Promise<GlobalTypes.RoomSchema>;
  updateOneRoom({
    id: string,
    updateProp: object,
  }): Promise<GlobalTypes.RoomSchema>;
  updateRoomArray({
    room_id: string,
    updateProp: object,
  }): Promise<GlobalTypes.RoomSchema>;
  insertOneRoom({ body: object }): Promise<GlobalTypes.RoomSchema>;
  deleteOneRoom({ id: string }): Promise<string>;
}

export interface returnMakePlayerDB {
  findAllPlayers({ room_id: string }): Promise<GlobalTypes.PlayerSchema[]>;
  findOnePlayer({
    socket_id: string,
    room_id: string,
  }): Promise<GlobalTypes.PlayerSchema>;
  updateOnePlayer({
    socket_id: string,
    room_id: string,
    updateProp: object,
  }): Promise<GlobalTypes.PlayerSchema>;
  insertOnePlayer({
    room_id: string,
    body: object,
  }): Promise<GlobalTypes.PlayerSchema>;
  deleteOnePlayer({ socket_id: string, room_id: string }): Promise<number>;
}

export interface roomService {
  addRoom: ({ override: object }) => Promise<GlobalTypes.RoomSchema>;
  deleteRoom: ({ room_id: string }) => Promise<boolean>;
  editRoom: ({
    room_id: string,
    updateProp: object,
  }) => Promise<GlobalTypes.RoomSchema>;
  listAllRooms: ({ query: object }) => Promise<GlobalTypes.RoomSchema[]>;
  listRoomById: ({ room_id: string }) => Promise<GlobalTypes.RoomSchema>;
}

export interface playerService {
  addPlayer: ({
    room_id: string,
    socket: Socket,
    tileSet: [],
    override: object
  }) => Promise<GlobalTypes.PlayerSchema>;
  deletePlayer: ({ room_id: string, socket_id: string }) => Promise<number>;
  editPlayer: ({
    socket_id: string,
    room_id: string,
    updateProp: object
  }) => Promise<GlobalTypes.PlayerSchema>;
  listPlayer: ({
    socket_id: string,
    room_id: string,
  }) => Promise<GlobalTypes.PlayerSchema>;
  listAllPlayers: ({
    room_id: string
  }) => Promise<GlobalTypes.PlayerSchema[]>
}
