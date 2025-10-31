import { nanoid } from "nanoid";

export default function makeFakeRoom(overrides) {

    /**
     * @type { import("../../../../globalCustomTypes").RoomSchema }
     */
    const roomData = {
      room_id: nanoid(),
      player: [],
      map: [],
      lobbyUrl: nanoid(7),
      gameUrl: nanoid(9),
      tileSet: new Set(),
      readyCount: 0,
      activeAlivePlayers: null,
      hasNewRoom: false,
      newLobbyUrl: null,
      gameParameters: {
        duration: 5,
        enableDuration: true,
        lives: 3,
      },
    };

    return {
        ...roomData,
        ...overrides
    }
}