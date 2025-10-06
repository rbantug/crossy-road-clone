/**
 * @typedef PlayerSchema
 * @prop {String} id
 * @prop { {
 * currentRow: Number; 
 * currentTile: Number
 * } } position
  @prop {Number} score 
  @prop {[String]} movesQueue
  @prop {Boolean} ready 
 */

/**
 * @typedef state
 * @prop {number|null} clientIndex - The index in data.player array where the client's data is located
 * @prop {number|null} roomIndex - The index in data array where the client's current room is located
 * @prop {boolean} gameStart - It determines the visibility of the Start Game button in the lobby
 */

/**
 * @typedef onDisconnect
 * @prop {import('./interface').Deep} io
 * @prop {state} state
 * @prop {import('./interface').Deep} data
 * @prop {import('./interface').Deep} socket
 */

/**
 * @typedef onRoomCreate
 * @prop {import("./interface").Deep} socket
 * @prop {import("./interface").Deep} data
 * @prop {Function} createRoomId
 * @prop {Function} createLobbyUrl
 * @prop {Function} outputPlayerData
 * @prop {state} state
 */

/**
 * @typedef onRoomJoin
 * @prop {import('./interface').Deep} socket
 * @prop {import('./interface').Deep} data
 * @prop {state} state
 * @prop {Function} outputPlayerData
 * @prop {import('./interface').Deep} io
 */

/**
 * @typedef onCharacterUpdateReady
 * @prop {import('./interface').Deep} data
 * @prop {state} state
 * @prop {import('./interface').Deep} io
 */

/**
 * @typedef onRoomIsValidUrl
 * @prop {import('./interface').Deep} data
 * @prop {import('./interface').Deep} socket
 */

/**
 * @typedef onRoomLeave
 * @prop {import('./interface').Deep} socket
 * @prop {import('./interface').Deep} data
 * @prop {state} state
 * @prop {import('./interface').Deep} io
 */

export const Types = {};
