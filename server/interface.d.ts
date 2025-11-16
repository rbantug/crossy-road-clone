import * as GlobalTypes from '../globalCustomTypes.js';

export interface Deep {
  [key: string]: DeepNestedObject;
}

export interface returnMakeRoomDB {
  findAll({ query: object }): object[];
  findRoomById({ id: string }): object;
  updateOneRoom({ id: string }): object;
  insertOneRoom({ body: object }): string;
  deleteOneRoom({ id: string }): boolean;
}

export interface returnMakePlayerDB {
  findOnePlayer({
    socket_id: string,
    room_id: string,
  }): GlobalTypes.PlayerSchema;
  updateOnePlayer({
    socket_id: string,
    room_id: string,
    updateProp: object,
  }): GlobalTypes.PlayerSchema;
  insertOnePlayer({ room_id: string, body: object }): GlobalTypes.PlayerSchema;
  deleteOnePlayer({ socket_id: string, room_id: string }): number;
}
