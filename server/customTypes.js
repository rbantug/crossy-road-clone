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
 */

/**
 * @typedef onRoomCreate
 * @prop {Socket} socket
 * @prop {import('./interface.d.ts').roomService} roomService
 * @prop {import('./interface.d.ts').playerService} playerService
 * @prop {Function} utilAddRow
 */

/**
 * @typedef onRoomJoin
 * @prop {Socket} socket
 * @prop {import('./interface.d.ts').playerService} playerService
 * @prop {import('./interface.d.ts').roomService} roomService
 * @prop {Server} io
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
 * @prop {import('./interface.d.ts').playerService} playerService
 * @prop {import('./interface.d.ts').roomService} roomService
 * @prop {Server} io
 * @prop {Function} utilRemoveClient
 */

/**
 * @typedef onRoomStartGame
 * @prop {Server} io
 * @prop { import('./interface.d.ts').playerService } playerService
 * @prop { import('./interface.d.ts').roomService } roomService
 * @prop {Function} createGameUrl
 */

/**
 * @typedef onRoomSetGameUrl
 * @prop { import('./interface.d.ts').playerService } playerService
 * @prop { import('./interface.d.ts').roomService } roomService
 * @prop { Socket } socket
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
 * @prop { Function } [utilRemoveClient=Function]
 * @prop { Function } utilAddRow
 * @prop { Function } createLobbyUrl
 * @prop { Function } [createGameUrl=Function]
 */

/**
 * @typedef utilRemoveClient
 * @prop { import('./interface.d.ts').playerService } playerService
 * @prop { import('./interface.d.ts').roomService } roomService
 * @prop { Socket } socket
 * @prop { string } room_id
 */

export const Types = {};
