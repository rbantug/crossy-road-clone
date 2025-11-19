//@ts-check
import { Socket } from "socket.io";

import makePlayer from "../../entities/player/index.js";

/**
 * 
 * @param {{ playerDB: import("../../interface.d.ts").returnMakePlayerDB }} parameters 
 */
export default function makeAddPlayer({ playerDB }) {
    /**
     * @param {{ room_id: string, socket: Socket }} parameter
     */
    return async function addPlayer({ room_id, socket }) {
        const player = makePlayer({
            id: socket.id
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

        return newPlayer
    }
}