//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onGameRetry} parameters
 */
export default function onGameRetry({
  io,
  socket,
  utilAddRow,
  playerService,
  roomService,
  createLobbyUrl,
}) {
  /**
   * @param { string } room_id
   */
  return async (room_id) => {
    io.to(room_id).emit('game:show-retryBtn-cd', socket.id);

    // delete player data from room.player and leave the old room
    await playerService.deletePlayer({ room_id, socket_id: socket.id });

    socket.leave(room_id)

    // if room.hasNewRoom is false, create a new room and player
    const { hasNewRoom, player } = await roomService.listRoomById({ room_id });

    if (!hasNewRoom) {
      const lobbyUrl = createLobbyUrl();
      const newRows = utilAddRow(0);

      const {
        room_id: newRoomID,
        tileSet,
        map,
      } = await roomService.addRoom({ override: { lobbyUrl, map: newRows } });

      const newPlayer = await playerService.addPlayer({
        room_id: newRoomID,
        socket,
        tileSet,
        override: { createdRoom: true, room_id: newRoomID },
      });

      socket.join(newRoomID);

      await roomService.editRoom({
        room_id,
        updateProp: { newLobbyUrl: lobbyUrl, hasNewRoom: true },
      });

      socket.emit('game:init', {
        room_id: newRoomID,
        player: newPlayer,
        map: map,
        lobbyUrl: lobbyUrl,
      });

      socket.emit('game:go-to-new-lobby', lobbyUrl);
    } else {
      // ELSE if data.room.hasNewRoom is true, emit the new lobbyUrl

      // retrieve newLobbyUrl from old room data
      const { newLobbyUrl } = await roomService.listRoomById({ room_id })
      const getNewRoom = await roomService.listAllRooms({ query: { lobbyUrl: newLobbyUrl } })

      // find new room and join it
      const newRoomId = getNewRoom[0].room_id;
      socket.join(newRoomId);

      socket.emit('game:go-to-new-lobby', newLobbyUrl);
    }

    // if old room has no more players, delete it
    if (player.length === 0) {
      await roomService.deleteRoom({ room_id })
    }
  };
}
