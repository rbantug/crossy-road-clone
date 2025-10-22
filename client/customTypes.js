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
  @prop {Boolean} createdRoom 
  @prop {'alive'|'dead'} status
  @prop { Boolean } hit
  @prop { 'connected'|'disconnected'|'exit' } gameConnectionStatus - 'exit' is the default value. This will be used to determine if the player was disconnected or exited during the game.
 */

export const Types = {}
