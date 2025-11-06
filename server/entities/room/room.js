//@ts-check
import { playerJoiSchema } from "../player/player";

/**
 * @typedef buildMakeRoom
 * @prop {import("../../interface").Deep} Joi
 * @prop {import("../../customTypes").identity} id
 * 
 * @param {buildMakeRoom} parameters 
 * @returns 
 */
export default function buildMakeRoom({ id, Joi }) {
  /**
   * @param { import("../../../globalCustomTypes").RoomSchema } parameters
   */
  return function makeRoom({
    room_id = id.makeRoomId(),
    player = [],
    map = [],
    lobbyUrl = null,
    gameUrl = null,
    tileSet = new Set(),
    readyCount = 0,
    activeAlivePlayers = null,
    hasNewRoom = false,
    newLobbyUrl = null,
    gameParameters = {
      duration: 5,
      enableDuration: true,
      lives: 3,
    },
  }) {
    const playerSchema = playerJoiSchema({ Joi })

    const schema = Joi.object({
      room_id: Joi.string().length(21),
      player: Joi.array().items(playerSchema),
      map: Joi.array(),
      lobbyUrl: Joi.string().length(7).allow(null),
      gameUrl: Joi.string().length(9).allow(null),
      tileSet: Joi.object()
        .instance(Set)
        .messages({ 'object.instance': 'A Set is required' }),
      readyCount: Joi.number().integer().positive().allow(0),
      activeAlivePlayers: Joi.string().allow(null),
      hasNewRoom: Joi.boolean(),
      newLobbyUrl: Joi.string().length(7).allow(null),
      gameParameters: Joi.object().keys({
        duration: Joi.number().integer().positive().required(),
        enableDuration: Joi.boolean().required(),
        lives: Joi.number().integer().positive().required(),
      }),
    });

    const { error, value } = schema.validate(
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
      },
      { convert: false }
    );

    if (error) {
      throw new Error(error);
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
    });
  };
}
