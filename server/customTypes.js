import * as GlobalTypes from '../globalCustomTypes.js'

/**
 * @typedef state
 * @prop {number|null} clientIndex - The index in data.player array where the client's data is located
 * @prop {number|null} roomIndex - The index in data array where the client's current room is located
 * @prop {boolean} gameStart - It determines the visibility of the Start Game button in the lobby
 * @prop {null|string} roomId - The client's current roomId
 * @prop {null|string} lobbyUrl - The lobby url
 * @prop {null|string} gameUrl - The game url
 */

/**
 * @typedef data
 * @prop { GlobalTypes.RoomSchema[] } room
 */

/**
 * @typedef onDisconnect
 * @prop {import('./interface').Deep} io
 * @prop {state} state
 * @prop {data} data
 * @prop {import('./interface').Deep} socket
 */

/**
 * @typedef onRoomSendLobbyUrl
 * @prop {import('./interface').Deep} socket
 * @prop {Function} createLobbyUrl
 * @prop {state} state
 */

/**
 * @typedef onRoomCreate
 * @prop {import("./interface").Deep} socket
 * @prop {data} data
 * @prop {Function} createRoomId
 * @prop {Function} outputPlayerData
 * @prop {state} state
 * @prop {Function} utilAddRow
 */

/**
 * @typedef onRoomJoin
 * @prop {import('./interface').Deep} socket
 * @prop {data} data
 * @prop {state} state
 * @prop {Function} outputPlayerData
 * @prop {import('./interface').Deep} io
 */

/**
 * @typedef onCharacterUpdateReady
 * @prop {data} data
 * @prop {state} state
 * @prop {import('./interface').Deep} io
 */

/**
 * @typedef onRoomIsValidUrl
 * @prop {data} data
 * @prop {import('./interface').Deep} socket
 */

/**
 * @typedef onRoomLeave
 * @prop {import('./interface').Deep} socket
 * @prop {data} data
 * @prop {state} state
 * @prop {import('./interface').Deep} io
 */

/**
 * @typedef onRoomUpdateClientIndex
 * @prop {state} state
 * @prop {import('./interface').Deep} socket
 * @prop {data} data
 */

/**
 * @typedef onRoomStartGame
 * @prop {import('./interface').Deep} io
 * @prop {data} data
 * @prop {state} state
 * @prop {Function} createGameUrl
 */

/**
 * @typedef onRoomSetGameUrl
 * @prop { state } state
 * @prop { data } data
 */

/**
 * @typedef onGameAddRow
 * @prop {import('./interface').Deep} io
 * @prop {data} data
 * @prop {state} state
 * @prop {Function} utilAddRow
 */

/**
 * @typedef onGameCharacterMove
 * @prop { import('./interface').Deep } io
 * @prop { import('./interface').Deep } socket
 * @prop { data } data
 * @prop { state } state
 */

/**
 * @typedef onGamePlayerHit
 * @prop { import('./interface').Deep } io
 * @prop { import('./interface').Deep } socket
 * @prop { state } state
 */

/**
 * @typedef onGamePlayerIsDead
 * @prop { import('./interface').Deep } io
 * @prop { import('./interface').Deep } socket
 * @prop { state } state
 * @prop { data } data
 */

/**
 * @typedef onGameSetParameters
 * @prop { import('./interface').Deep } io
 * @prop { import('./interface').Deep } socket
 * @prop { data } data
 * @prop { state } state
 */

/**
 * @typedef onGameSetScore
 * @prop { import('./interface').Deep } io
 * @prop { import('./interface').Deep } socket
 * @prop { data } data
 * @prop { state } state
 */

/**
 * @typedef onGameExit
 * @prop { state } state
 * @prop { data } data
 */

/**
 * @typedef onGameRetry
 * @prop { data } data
 * @prop { import('./interface').Deep } socket
 * @prop { import('./interface').Deep } io
 * @prop { state } state
 * @prop { Function } createLobbyUrl
 * @prop { Function } createRoomId
 * @prop { Function } utilAddRow
 * @prop { Function } outputPlayerData
 */
export const Types = {};
