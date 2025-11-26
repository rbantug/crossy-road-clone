//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onRoomCreate} parameters
 */
export default function onRoomCreate({
  socket,
  roomService,
  playerService,
  utilAddRow,
}) {
  /**
   * @param { string } lobbyUrl
   */
  return async (lobbyUrl) => {
    const newRows = utilAddRow(0);

    // create new room
    const { room_id, tileSet, map } = await roomService.addRoom({ override: { map: newRows, lobbyUrl } });

    const newPlayer = await playerService.addPlayer({
      room_id,
      socket,
      tileSet,
      override: { createdRoom: true, room_id },
    });

    socket.join(room_id);

    socket.emit('game:init', {
      room_id,
      player: newPlayer,
      map,
    });
  };
}
