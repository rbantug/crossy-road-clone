import * as GlobalTypes from '../globalCustomTypes.js';

export interface Deep {
  [key: string]: DeepNestedObject;
}

export interface returnMakeRoomDB {
  findAll({ query: object }): Promise<object[]>;
  findRoomById({ id: string }): Promise<object>;
  updateOneRoom({ id: string, updateProp: object }): Promise<object>;
  insertOneRoom({ body: object }): Promise<string>;
  deleteOneRoom({ id: string }): Promise<boolean>;
}

export interface returnMakePlayerDB {
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
