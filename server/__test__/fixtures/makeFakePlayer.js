import { randomInt } from 'crypto'
import { nanoid } from "nanoid";

export default function makeFakePlayer(overrides) {
    /**
     * @type {import("../../../../globalCustomTypes").PlayerSchema}
     */
    const playerData = {
      id: nanoid(20),
      position: {
        currentRow: 0,
        currentTile: randomInt(-8,9),
      },
      score: 0,
      movesQueue: [],
      ready: false,
      createdRoom: false,
      status: 'alive',
      hit: false,
      gameConnectionStatus: 'exit',
    };

    return {
        ...playerData,
        ...overrides
    }
}