//@ts-check

import Joi from "joi";

/**
 * 
 * @param {{ Joi: Joi }} parameter 
 * @returns
 */
export function playerJoiSchema({ Joi }) {
  return {
    id: Joi.string().length(20).allow(null),
    position: Joi.object({
      currentRow: Joi.number().integer().allow(0),
      currentTile: Joi.number().integer().allow(0),
    }),
    score: Joi.number().integer().positive().allow(0),
    movesQueue: Joi.array().items(Joi.string()),
    ready: Joi.boolean(),
    createdRoom: Joi.boolean(),
    status: Joi.string().valid('alive', 'dead'),
    hit: Joi.boolean(),
    gameConnectionStatus: Joi.string().valid(
      'exit',
      'connected',
      'disconnected'
    ),
    roomId: Joi.string().length(21).allow(null),
    gameStart: Joi.boolean(),
    type: 'newPlayer'
  };
}
  
/**
 * 
 * @param {{ Joi: Joi }} parameters
 */

export function buildMakePlayer({ Joi }) {
  /**
   * @param { object } player
   * @param { string|null } [player.id=null]
   * @param { object } [player.position={ currentRow: 0, currentTile: 0 }]
   * @param { number } [player.score=0]
   * @param { string[] } [player.movesQueue=[]]
   * @param { boolean } [player.ready=false]
   * @param { boolean } [player.createdRoom=false]
   * @param { string } [player.status=alive]
   * @param { boolean } [player.hit=false]
   * @param { string } [player.gameConnectionStatus=exit]
   * @param { string|null } [player.roomId=null]
   * @param { boolean } [player.gameStart=false]
   * @param { 'newPlayer'|'updatePlayer' } player.type
   */
  return function makePlayer({
    id = null,
    position = {
      currentRow: 0,
      currentTile: 0,
    },
    score = 0,
    movesQueue = [],
    ready = false,
    createdRoom = false,
    status = 'alive',
    hit = false,
    gameConnectionStatus = 'exit',
    roomId = null,
    gameStart = false,
    type
  }) {
    const newPlayerSchema = Joi.object(playerJoiSchema({ Joi }));

    const updatePlayerSchema = Joi.object({
      id: Joi.string().length(20).allow(null),
      position: Joi.object({
        currentRow: Joi.number().integer().allow(0),
        currentTile: Joi.number().integer().allow(0),
      }),
      score: Joi.number().integer().positive().allow(0),
      movesQueue: Joi.string(),
      ready: Joi.boolean(),
      createdRoom: Joi.boolean(),
      status: Joi.string().valid('alive', 'dead'),
      hit: Joi.boolean(),
      gameConnectionStatus: Joi.string().valid(
        'exit',
        'connected',
        'disconnected'
      ),
      roomId: Joi.string().length(21).allow(null),
      gameStart: Joi.boolean(),
      type: 'updatePlayer',
    });

    const conditionalSchema = Joi.any().when('.type', {
      switch: [
        { is: 'newPlayer', then: newPlayerSchema },
        { is: 'updatePlayer', then: updatePlayerSchema },
      ],
    });

    if (type === 'newPlayer') {
      const { error, value } = conditionalSchema.validate(
        {
          id,
          position,
          score,
          movesQueue,
          ready,
          createdRoom,
          status,
          hit,
          gameConnectionStatus,
          roomId,
          gameStart
        },
        { convert: false }
      );
  
      if (error) {
        throw new Error(error.message);
      }
    }

    if (type === 'updatePlayer') {
      const { error, value } = conditionalSchema.validate(
        {
          id,
          position,
          score,
          movesQueue,
          ready,
          createdRoom,
          status,
          hit,
          gameConnectionStatus,
          roomId,
          gameStart
        },
        { convert: false }
      );
  
      if (error) {
        throw new Error(error.message);
      }
    }

    return Object.freeze({
        getId: () => id,
        getPosition: () => position,
        getScore: () => score,
        getMovesQueue: () => movesQueue,
        getReady: () => ready,
        getCreatedRoom: () => createdRoom,
        getStatus: () => status,
        getHit: () => hit,
        getGameConnectionStatus: () => gameConnectionStatus,
        getRoomId: () => roomId,
        getGameStart: () => gameStart,
    })
  }
}
