//@ts-check
import { Socket } from 'socket.io';

import makePlayer from '../../entities/player/index.js';

/**
 *
 * @param {{ playerDB: import("../../interface.d.ts").returnMakePlayerDB, roomDB: import("../../interface.d.ts").returnMakeRoomDB, randomInt: Function }} parameters
 */
export default function makeAddPlayer({ playerDB, roomDB, randomInt }) {
  /**
   * @param { object } parameters
   * @param { string } parameters.room_id
   * @param { Socket } parameters.socket
   * @param { number[] } parameters.tileSet
   * @param { Record<string,any> } [parameters.override={}] - "override" will override the default value in the player entity
   */
  return async function addPlayer({ room_id, socket, tileSet, override = {} }) {
    let tileIndex;

    do {
      tileIndex = randomInt(-8, 9);
    } while (tileSet.includes(tileIndex));

    const player = makePlayer({
      id: socket.id,
      position: { currentTile: tileIndex, currentRow: 0 },
      ...override,
      type: 'newPlayer',
    });

    // update the room tileSet
    await roomDB.updateRoomTileSet({
      room_id,
      currentTile: tileIndex,
      operation: 'push'
    })

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
