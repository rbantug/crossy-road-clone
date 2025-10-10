// @ts-check

import { randomInt } from 'crypto';
import { nanoid } from 'nanoid';

const data = {
  room: [],
};

function outputPlayerData(socket, set) {
  let tileIndex;
  do {
    tileIndex = randomInt(-8, 9);
  } while (set.has(tileIndex));

  set.add(tileIndex);

  const playerData = {
    id: socket.id,
    position: {
      currentRow: 0,
      currentTile: tileIndex,
    },
    score: 0,
    movesQueue: [],
    ready: false,
    createdRoom: false
  };

  return playerData;
}

function createRoomId() {
  return nanoid();
}

function createLobbyUrl() {
  return nanoid(7);
}

function createGameUrl() {
  return nanoid(9)
}

export { createGameUrl, createLobbyUrl, createRoomId, data, outputPlayerData };
