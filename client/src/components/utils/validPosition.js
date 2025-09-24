import { calculateFinalPosition } from './calculateFinalPosition'
import { maxTileIndex, minTileIndex } from './constants'

export function validPosition(currentPosition, moves, metadata) {
  const finalPosition = calculateFinalPosition(currentPosition, moves)

  if (
    finalPosition.rowIndex === -1 ||
    finalPosition.tileIndex === maxTileIndex + 1 ||
    finalPosition.tileIndex === minTileIndex - 1
  ) {
    return false
  }

  const destinationRow = metadata[finalPosition.rowIndex - 1]
  if (
    destinationRow &&
    destinationRow.type === 'forest' &&
    destinationRow.trees.some((x) => finalPosition.tileIndex === x.tileIndex)
  ) {
    return false
  }

  return true
}
