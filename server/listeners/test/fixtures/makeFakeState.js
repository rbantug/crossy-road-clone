export default function makeFakeState(overrides) {
    /**
     * @type {import("../../../customTypes").state}
     */
    const state = {
      clientIndex: null,
      roomIndex: null,
      gameStart: false,
      roomId: null,
      lobbyUrl: null,
      gameUrl: null,
    };

    return {
        ...state,
        ...overrides
    }
}