import * as GlobalTypes from '../globalCustomTypes.js';
import { Socket } from 'socket.io';

export interface Deep {
  [key: string]: DeepNestedObject;
}

export interface returnMakeRoomDB {
  findAll({ query: object }): Promise<GlobalTypes.RoomSchema[]>;
  findRoomById({ id: string }): Promise<GlobalTypes.RoomSchema>;
  updateOneRoom(param: updateOneRoomParam): Promise<GlobalTypes.RoomSchema>;
  updateRoomMap(param: updateRoomMapParam): Promise<GlobalTypes.RoomSchema>;
  updateRoomTileSet(
    param: updateRoomTileSetParam
  ): Promise<GlobalTypes.RoomSchema>;
  insertOneRoom({ body: object }): Promise<GlobalTypes.RoomSchema>;
  deleteOneRoom({ id: string }): Promise<string>;
}

export interface returnMakePlayerDB {
  findAllPlayers({ room_id: string }): Promise<GlobalTypes.PlayerSchema[]>;
  findOnePlayer({
    socket_id: string,
    room_id: string,
  }): Promise<GlobalTypes.PlayerSchema>;
  updateOnePlayer(
    param: updateOnePlayerParam
  ): Promise<GlobalTypes.PlayerSchema>;
  updatePlayerMovesQueue(
    param: updatePlayerMovesQueueParam
  ): Promise<GlobalTypes.PlayerSchema>;
  updateAllPlayers(param: updateAllPlayersParam): Promise<string>;
  insertOnePlayer({
    room_id: string,
    body: object,
  }): Promise<GlobalTypes.PlayerSchema>;
  deleteOnePlayer({ socket_id: string, room_id: string }): Promise<number>;
}

export interface roomService {
  addRoom: ({ override: object }) => Promise<GlobalTypes.RoomSchema>;
  deleteRoom: ({ room_id: string }) => Promise<string>;
  editRoom: (param: editRoomParam) => Promise<GlobalTypes.RoomSchema>;
  listAllRooms: ({ query: object }) => Promise<GlobalTypes.RoomSchema[]>;
  listRoomById: ({ room_id: string }) => Promise<GlobalTypes.RoomSchema>;
}

export interface playerService {
  addPlayer: (param: addPlayerParam) => Promise<GlobalTypes.PlayerSchema>;
  deletePlayer: ({ room_id: string, socket_id: string }) => Promise<number>;
  editPlayer: (param: editPlayerParam) => Promise<GlobalTypes.PlayerSchema>;
  editAllPlayers: (param: editAllPlayersParam) => Promise<string>
  listPlayer: ({
    socket_id: string,
    room_id: string,
  }) => Promise<GlobalTypes.PlayerSchema>;
  listAllPlayers: ({ room_id: string }) => Promise<GlobalTypes.PlayerSchema[]>;
}

interface addPlayerParam {
  room_id: string;
  socket: Socket;
  tileSet: number[];
  override?: object;
}

interface editPlayerParam {
  socket_id: string;
  room_id: string;
  updateProp: Partial<GlobalTypes.PlayerSchema>;
  operation?: 'push'|'shift'
}

interface editRoomParam {
  room_id: string;
  updateProp: Partial<GlobalTypes.RoomSchema>;
}

interface updateOnePlayerParam {
  socket_id: string;
  room_id: string;
  updateProp: Partial<GlobalTypes.PlayerSchema>;
}

interface updateOneRoomParam {
  id: string;
  updateProp: {
    room_id?: string;
    player?: GlobalTypes.PlayerSchema[];
    lobbyUrl?: string;
    gameUrl?: string;
    readyCount?: number;
    activeAlivePlayers?: number | null;
    hasNewRoom?: boolean;
    newLobbyUrl?: string | null;
    gameParameters?: GlobalTypes.gameParameters;
  };
}

interface updateRoomMapParam {
  room_id: string;
  map: Deep;
}

interface updateRoomTileSetParam {
  room_id: string;
  currentTile: number;
  operation: 'push' | 'delete'
}

interface updateAllPlayersParam {
  room_id: string;
  updateProp: Partial<GlobalTypes.PlayerSchema>
}

interface editAllPlayersParam {
  room_id: string;
  updateProp: Partial<GlobalTypes.PlayerSchema>;
}

interface updatePlayerMovesQueueParam {
  socket_id: string;
  room_id: string;
  move: string;
  operation?: 'push' | 'shift';
}