//@ts-check

/**
 * 
 * @param {{ Joi: import("../../interface").Deep }} parameter 
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
    };
}
  
/**
 * @typedef buildMakePlayer
 * @prop {import("../../interface").Deep} Joi 
 * 
 * @param { buildMakePlayer } parameters
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
  }) {
    const schema = Joi.object(playerJoiSchema({ Joi }));

    const { error, value } = schema.validate(
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
      },
      { convert: false }
    );

    if (error) {
      throw new Error(error);
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
    })
  }
}
