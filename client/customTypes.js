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
 */

export const Types = {}
