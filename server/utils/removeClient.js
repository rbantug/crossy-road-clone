//@ts-check

import * as Types from '../customTypes.js'

/**
 *
 * @param {Types.utilRemoveClient} parameters
 * @returns {Promise<boolean>} If true, the room was deleted because there are no more players.
 */

export async function utilRemoveClient({ roomService, playerService, socket, room_id }) {
  const playerData = await playerService.listPlayer({ room_id, socket_id: socket.id })

  // decrement data.room[roomIndex].readyCount if player.ready is true
  const roomData = await roomService.listRoomById({ room_id })
  let readyCount = roomData.readyCount;
  if (playerData.ready) {
    readyCount--
  }

  // remove client's starting currentTile from tileSet
  const playerCurrentTile = playerData.position.currentTile;
  await roomService.editRoom({ room_id, updateProp: { deleteCurrentTile: playerCurrentTile } })

  // If the person who made the room leaves, the second user who joined the room should inherit the (problem) responsibility.
  const clientCreatedRoom = playerData.createdRoom;

  socket.leave(room_id);

  const totalPlayers = await playerService.deletePlayer({ room_id, socket_id: socket.id })

  await roomService.editRoom({
    room_id,
    updateProp: { readyCount },
  });

  if (totalPlayers === 0) {
    await roomService.deleteRoom({ room_id })
    return true;
  }

  if (clientCreatedRoom) {
    const allPlayers = await playerService.listAllPlayers({ room_id })
    const index0PlayerId = allPlayers[0].id
    await playerService.editPlayer({ room_id, socket_id: index0PlayerId, updateProp: { createdRoom: true } })
  }

  return false;
}
