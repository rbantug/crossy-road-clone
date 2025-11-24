//@ts-check
import Joi from 'joi';

import { playerJoiSchema } from '../player/player.js';

/**
 * @typedef buildMakeRoom
 * @prop {Joi} Joi
 * @prop {import("../../customTypes").identity} id
 *
 * @param {buildMakeRoom} parameters
 * @returns
 */
export default function buildMakeRoom({ id, Joi }) {
  /**
   * @param { object } room
   * @param { string } [room.room_id=id.makeRoomId()]
   * @param { object[] } [room.player=[]]
   * @param { object[] } [room.map=[]]
   * @param { string|null } [room.lobbyUrl=null]
   * @param { string|null } [room.gameUrl=null]
   * @param { number[] } [room.tileSet=[]]
   * @param { number } [room.readyCount=0]
   * @param { number|null } [room.activeAlivePlayers=null]
   * @param { boolean } [room.hasNewRoom=false]
   * @param { string|null } [room.newLobbyUrl=null]
   * @param { object } [room.gameParameters={ duration: 5, enableDuration: true, lives: 3 }]
   * @param { number | null } [room.newCurrentTile=null] - only used adding a new current tile to the room tileSet
   * @param { number | null } [room.deleteCurrentTile=null] - only used removing a current tile to the room tileSet
   * @param { 'newRoom'|'updateRoom' } room.type
   *
   */
  return function makeRoom({
    room_id = id.makeRoomId(),
    player = [],
    map = [],
    lobbyUrl = null,
    gameUrl = null,
    tileSet = [],
    readyCount = 0,
    activeAlivePlayers = null,
    hasNewRoom = false,
    newLobbyUrl = null,
    gameParameters = {
      duration: 5,
      enableDuration: true,
      lives: 3,
    },
    newCurrentTile = null,
    deleteCurrentTile = null,
    type,
  }) {
    const playerSchema = playerJoiSchema({ Joi });

    const newRoomSchema = Joi.object({
      room_id: Joi.string().length(21),
      player: Joi.array().items(playerSchema),
      map: Joi.array(),
      lobbyUrl: Joi.string().length(7).allow(null),
      gameUrl: Joi.string().length(9).allow(null),
      tileSet: Joi.array().unique(),
      readyCount: Joi.number().integer().positive().allow(0),
      activeAlivePlayers: Joi.number().allow(null),
      hasNewRoom: Joi.boolean(),
      newLobbyUrl: Joi.string().length(7).allow(null),
      gameParameters: Joi.object().keys({
        duration: Joi.number().integer().positive().required(),
        enableDuration: Joi.boolean().required(),
        lives: Joi.number().integer().positive().required(),
      }),
      type: 'newRoom',
    });

    const updateRoomSchema = Joi.object({
      room_id: Joi.string().length(21),
      player: Joi.array().items(playerSchema),
      map: Joi.array(),
      lobbyUrl: Joi.string().length(7).allow(null),
      gameUrl: Joi.string().length(9).allow(null),
      tileSet: Joi.array().items(Joi.number()),
      readyCount: Joi.number().integer().positive().allow(0),
      activeAlivePlayers: Joi.number().allow(null),
      hasNewRoom: Joi.boolean(),
      newLobbyUrl: Joi.string().length(7).allow(null),
      gameParameters: Joi.object().keys({
        duration: Joi.number().integer().positive().required(),
        enableDuration: Joi.boolean().required(),
        lives: Joi.number().integer().positive().required(),
      }),
      newCurrentTile: Joi.number().integer().positive(),
      deleteCurrentTile: Joi.number().integer().positive(),
      type: 'updateRoom',
    });

    const conditionalSchema = Joi.any().when('.type', {
      switch: [
        { is: 'newRoom', then: newRoomSchema },
        { is: 'updateRoom', then: updateRoomSchema },
      ],
    });

    if (type === 'newRoom') {
      const { error, value } = conditionalSchema.validate(
        {
          room_id,
          player,
          map,
          lobbyUrl,
          gameUrl,
          tileSet,
          readyCount,
          activeAlivePlayers,
          hasNewRoom,
          newLobbyUrl,
          gameParameters,
          type,
        },
        { convert: false }
      );

      if (error) {
        throw new Error(error.message);
      }
    }

    if (type === 'updateRoom') {
      const { error, value } = conditionalSchema.validate(
        {
          room_id,
          player,
          map,
          lobbyUrl,
          gameUrl,
          tileSet,
          readyCount,
          activeAlivePlayers,
          hasNewRoom,
          newLobbyUrl,
          gameParameters,
          newCurrentTile,
          deleteCurrentTile,
          type,
        },
        { convert: false }
      );

      if (error) {
        throw new Error(error.message);
      }
    }

    return Object.freeze({
      getId: () => room_id,
      getPlayer: () => player,
      getMap: () => map,
      getLobbyUrl: () => lobbyUrl,
      getGameUrl: () => gameUrl,
      getTileSet: () => tileSet,
      getReadyCount: () => readyCount,
      getActiveAlivePlayers: () => activeAlivePlayers,
      getHasNewRoom: () => hasNewRoom,
      getNewLobbyUrl: () => newLobbyUrl,
      getGameParameters: () => gameParameters,
      getNewCurrentTile: () => newCurrentTile,
      getDeleteCurrentTile: () => deleteCurrentTile,
    });
  };
}
