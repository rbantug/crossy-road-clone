import { Server, Socket } from 'socket.io';

import * as GlobalTypes from '../globalCustomTypes.js';

/**
 * @typedef state
 * @prop {number|null} clientIndex - The index in data.player array where the client's data is located
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
 * @prop {Server} io
 * @prop {import('./interface.d.ts').roomService} roomService
 * @prop {import('./interface.d.ts').playerService} playerService
 * @prop {Socket} socket
 * @prop {Function} utilRemoveClient
 */

/**
 * @typedef onRoomSendLobbyUrl
 * @prop {Socket} socket
 * @prop {Function} createLobbyUrl
 * @prop {state} state
 */

/**
 * @typedef onRoomCreate
 * @prop {Socket} socket
 * @prop {data} data
 * @prop {Function} createRoomId
 * @prop {Function} outputPlayerData
 * @prop {state} state
 * @prop {Function} utilAddRow
 * @prop {Function} randomInt
 */

/**
 * @typedef onRoomJoin
 * @prop {Socket} socket
 * @prop {data} data
 * @prop {state} state
 * @prop {Function} outputPlayerData
 * @prop {Server} io
 * @prop {Function} randomInt
 */

/**
 * @typedef onCharacterUpdateReady
 * @prop {import('./interface.d.ts').playerService} playerService
 * @prop {import('./interface.d.ts').roomService} roomService
 * @prop {Server} io
 */

/**
 * @typedef onRoomLeave
 * @prop {Socket} socket
 * @prop {data} data
 * @prop {state} state
 * @prop {Server} io
 * @prop {Function} utilRemoveClient
 */

/**
 * @typedef onRoomUpdateClientIndex
 * @prop {state} state
 * @prop {Socket} socket
 * @prop {data} data
 */

/**
 * @typedef onRoomStartGame
 * @prop {Server} io
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
 * @prop {Server} io
 * @prop { import('./interface.d.ts').roomService } roomService
 * @prop {Function} utilAddRow
 */

/**
 * @typedef onGameCharacterMove
 * @prop { Server } io
 * @prop { import('./interface.d.ts').playerService } playerService
 * @prop { Socket } socket
 */

/**
 * @typedef onGamePlayerHit
 * @prop { Server } io
 * @prop { Socket } socket
 */

/**
 * @typedef onGamePlayerIsDead
 * @prop { Server } io
 * @prop { Socket } socket
 * @prop { import('./interface.d.ts').roomService } roomService
 * @prop { import('./interface.d.ts').playerService } playerService
 */

/**
 * @typedef onGameSetParameters
 * @prop { Server } io
 * @prop { Socket } socket
 * @prop { import('./interface.d.ts').roomService } roomService
 */

/**
 * @typedef onGameSetScore
 * @prop { Server } io
 * @prop { Socket } socket
 * @prop { import('./interface.d.ts').playerService } playerService
 */

/**
 * @typedef onGameExit
 * @prop { import('./interface.d.ts').roomService } roomService
 * @prop { import('./interface.d.ts').playerService } playerService
 * @prop { Socket } socket
 */

/**
 * @typedef onGameRetry
 * @prop { import('./interface.d.ts').playerService } playerService
 * @prop { Socket } socket
 * @prop { Server } io
 * @prop { import('./interface.d.ts').roomService } roomService
 * @prop { Function } utilAddRow
 * @prop { Function } createLobbyUrl
 */

/**
 * @typedef identity
 * @type { {makeRoomId: Function, makeLobbyUrl: Function, makeGameUrl: Function} }
 * @returns string
*/

/**
 * @typedef Listener
 * @prop { Server } io
 * @prop { Socket } socket
 * @prop { import('./interface.d.ts').roomService } roomService
 * @prop { import('./interface.d.ts').playerService } playerService
 * @prop { state } state
 * @prop { data } data
 * @prop { Function } utilRemoveClient
 * @prop { Function } createRoomId
 * @prop { Function } outputPlayerData
 * @prop { Function } utilAddRow
 * @prop { Function } randomInt
 * @prop { Function } createLobbyUrl
 * @prop { Function } createGameUrl
 */

/**
 * @typedef utilRemoveClient
 * @prop { import('./interface.d.ts').playerService } playerService
 * @prop { import('./interface.d.ts').roomService } roomService
 * @prop { Socket } socket
 * @prop { string } room_id
 */

export const Types = {};
