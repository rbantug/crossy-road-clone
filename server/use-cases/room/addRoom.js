//@ts-check

import makeRoom from '../../entities/room/index.js';

/**
 *
 * @param {{ roomDB:import("../../interface.js").returnMakeRoomDB }} parameter
 */
export default function makeAddRoom({ roomDB }) {
  return async function addRoom() {
    const room = makeRoom({});

    const newRoom = await roomDB.insertOneRoom({
      body: {
        room_id: room.getId(),
        player: room.getPlayer(),
        map: room.getMap(),
        lobbyUrl: room.getLobbyUrl(),
        gameUrl: room.getGameUrl(),
        tileSet: room.getTileSet(),
        readyCount: room.getReadyCount(),
        activeAlivePlayers: room.getActiveAlivePlayers(),
        hasNewRoom: room.getHasNewRoom(),
        newLobbyUrl: room.getNewLobbyUrl(),
        gameParameters: room.getGameParameters(),
      },
    });

    return newRoom;
  };
}
