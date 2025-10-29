/**
 * @typedef PlayerSchema
 * @prop {String} id
 * @prop { {
 * currentRow: Number; 
 * currentTile: Number
 * } } position
  @prop {Number} score 
  @prop {[String]|[]} movesQueue
  @prop {Boolean} ready 
  @prop {Boolean} createdRoom 
  @prop {'alive'|'dead'} status
  @prop { Boolean } hit
  @prop { 'connected'|'disconnected'|'exit' } gameConnectionStatus - 'exit' is the default value. This will be used to determine if the player was disconnected or exited during the game.
 */

/**
 * @typedef RoomSchema
 * @prop {string} room_id
 * @prop { PlayerSchema[] } player
 * @prop {[import('./interface').Deep] | []} map
 * @prop {string | null} lobbyUrl
 * @prop {string | null} gameUrl
 * @prop {Set<number>} tileSet - A Set used to make the players have unique position.currentTiles
 * @prop {number} readyCount - The number of players in the lobby that are ready to play the game. It is used for visibility of the "start game" button in the lobby.
 * @prop {number|null} activeAlivePlayers - The current number of players who are both connected in the game AND alive.,
 * @prop { boolean } hasNewRoom - false by default. If any of the players clicked on the retry button, this should toggle to true.
 * @prop { string | null } newLobbyUrl - When the players decide to play again, a new lobby url will be added to the old room data in order to help other players find the new room.
 */

/**
 * @typedef state
 * @prop {number|null} clientIndex - The index in data.player array where the client's data is located
 * @prop {number|null} roomIndex - The index in data array where the client's current room is located
 * @prop {boolean} gameStart - It determines the visibility of the Start Game button in the lobby
 * @prop {null|string} roomId - The client's current roomId
 * @prop {null|string} lobbyUrl - The lobby url
 * @prop {null|string} gameUrl - The game url
 * @prop { gameParameters } gameParameters - The parameters set by the room lead before the start of the game
 */

/**
 * @typedef gameParameters
 * @prop { number } lives - The lives of each player
 * @prop { number } duration - Duration of the game in minutes
 * @prop { boolean | null } enableDuration - If the game timer will be enabled
 */

/**
 * @typedef data
 * @prop { RoomSchema[] } room
 */

/**
 * @typedef onDisconnect
 * @prop {import('./interface').Deep} io
 * @prop {state} state
 * @prop {import('./interface').Deep} data
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
 * @prop {import("./interface").Deep} data
 * @prop {Function} createRoomId
 * @prop {Function} outputPlayerData
 * @prop {state} state
 * @prop {Function} utilAddRow
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

/**
 * @typedef onRoomUpdateClientIndex
 * @prop {state} state
 * @prop {import('./interface').Deep} socket
 * @prop {import('./interface').Deep} data
 */

/**
 * @typedef onRoomStartGame
 * @prop {import('./interface').Deep} io
 * @prop {import('./interface').Deep} data
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
 * @prop {import('./interface').Deep} data
 * @prop {state} state
 * @prop {Function} utilAddRow
 */

/**
 * @typedef onGameCharacterMove
 * @prop { import('./interface').Deep } io
 * @prop { import('./interface').Deep } socket
 * @prop { import('./interface').Deep } data
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
 * @prop { state } state
 */

/**
 * @typedef onGameSetScore
 * @prop { import('./interface').Deep } io
 * @prop { import('./interface').Deep } socket
 * @prop { import('./interface').Deep } data
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
