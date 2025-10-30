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
 * @prop { gameParameters } gameParameters - The parameters set by the room lead before the start of the game
 */

/**
 * @typedef gameParameters
 * @prop { number } lives - The lives of each player
 * @prop { number } duration - Duration of the game in minutes
 * @prop { boolean | null } enableDuration - If the game timer will be enabled
 */

export const GlobalTypes = {};