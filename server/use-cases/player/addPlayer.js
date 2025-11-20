//@ts-check
import { Socket } from 'socket.io';

import makePlayer from '../../entities/player/index.js';

/**
 *
 * @param {{ playerDB: import("../../interface.d.ts").returnMakePlayerDB, randomInt: Function }} parameters
 */
export default function makeAddPlayer({ playerDB, randomInt }) {
  /**
   * @param {{ room_id: string, socket: Socket, tileSet: number[] }} parameter
   */
  return async function addPlayer({ room_id, socket, tileSet }) {
    let tileIndex;

    do {
      tileIndex = randomInt(-8, 9);
    } while (tileSet.includes(tileIndex));

    tileSet.push(tileIndex);

    const player = makePlayer({
      id: socket.id,
      position: { currentTile: tileIndex },
      type: 'newPlayer',
    });

    const newPlayer = await playerDB.insertOnePlayer({
      room_id,
      body: {
        id: player.getId(),
        position: player.getPosition(),
        score: player.getScore(),
        movesQueue: player.getMovesQueue(),
        ready: player.getReady(),
        createdRoom: player.getCreatedRoom(),
        status: player.getStatus(),
        hit: player.getHit(),
        gameConnectionStatus: player.getGameConnectionStatus(),
        roomId: player.getRoomId(),
        gameStart: player.getGameStart(),
      },
    });

    return newPlayer;
  };
}
