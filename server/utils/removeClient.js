/**
 *
 * @typedef utilRemoveClient
 * @prop { import('../interface').Deep } data
 * @prop { import('../customTypes').state }  state
 * @prop { import('../interface').Deep } socket
 *
 * @param {utilRemoveClient} parameters
 * @returns {boolean} If true, the room was deleted because there are no more players.
 */

export function utilRemoveClient({ data, state, socket }) {
  const playerData = data.room[state.roomIndex].player[state.clientIndex];
  // decrement data.room[roomIndex].readyCount if player.ready is true
  if (playerData.ready) {
    data.room[state.roomIndex].readyCount--;
  }

  // remove client's starting currentTile from Set()
  const playerCurrentTile = playerData.position.currentTile;
  data.room[state.roomIndex].tileSet.delete(playerCurrentTile);

  // If the person who made the room leaves, the second user who joined the room should inherit the (problem) responsibility.
  const clientCreatedRoom = playerData.createdRoom;

  socket.leave(state.roomId);

  data.room[state.roomIndex].player.splice(state.clientIndex, 1);

  if (data.room[state.roomIndex].player.length === 0) {
    data.room.splice(state.roomIndex, 1);
    return true;
  }

  if (clientCreatedRoom) {
    data.room[state.roomIndex].player[0].createdRoom = true;
  }
  return false;
}
