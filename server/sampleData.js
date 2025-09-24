import { randomInt } from 'crypto';

const data = {
  /* players: {
    one: {
      currentRow: 0,
      currentTile: -2,
    },
    two: {
      currentRow: 0,
      currentTile: 2,
    },
  }, */
  players: {}
};

const tileSet = new Set()

function outputTile() {
  let tileIndex
  do {
    tileIndex = randomInt(-8, 9)
  } while (tileSet.has(tileIndex))
  
  return tileIndex
}

export { data, outputTile }
