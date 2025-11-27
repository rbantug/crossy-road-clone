//@ts-check

import * as GlobalTypes from '../../../globalCustomTypes.js';
import * as Types from '../../customTypes.js';

/**
 * This will send the game url to all clients in the room. All players will be considered connected in the game.
 * @param {Types.onRoomStartGame} parameters
 */
export default function onRoomStartGame({ io, roomService, playerService, createGameUrl }) {
  /**
   * @param { string } room_id
   */
  return async (room_id) => {
    const gameUrl = createGameUrl();

    await playerService.editAllPlayers({
      room_id,
      updateProp: { gameConnectionStatus: 'connected' },
    });

    const getRoom = await roomService.listRoomById({ room_id })

    const AAPlayers = getRoom.player.length

    await roomService.editRoom({ room_id, updateProp: { activeAlivePlayers: AAPlayers, gameUrl: gameUrl } })

    io.to(room_id).emit('room:get-game-url', gameUrl, AAPlayers);
  };
}
