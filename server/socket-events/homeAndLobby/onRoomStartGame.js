//@ts-check

import * as GlobalTypes from '../../../globalCustomTypes.js';
import * as Types from '../../customTypes.js';

/**
 * This will send the game url to all clients in the room. All players will be considered connected in the game.
 * @param {Types.onRoomStartGame} parameters
 * @returns
 */
export default function onRoomStartGame({ io, state, data, createGameUrl }) {
  return () => {
    const roomIndex = data.room.findIndex((x) => state.roomId === x.room_id);

    const gameUrl = createGameUrl();
    state.gameUrl = gameUrl;
    data.room[roomIndex].gameUrl = gameUrl;
    data.room[roomIndex].player.forEach(
      /**
       *
       * @param {GlobalTypes.PlayerSchema} x
       */
      (x) => {
        x.gameConnectionStatus = 'connected';
      }
    );
    const AAPlayers = data.room[roomIndex].player.length;

    data.room[roomIndex].activeAlivePlayers = AAPlayers;

    //@ts-ignore
    io.to(state.roomId).emit('room:get-game-url', gameUrl, AAPlayers);
  };
}
