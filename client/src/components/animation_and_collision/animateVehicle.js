import { maxTileIndex, minTileIndex, tileSize } from '../utils/constants'

const beginningOfRow = (minTileIndex - 2) * tileSize
const endOfRow = (maxTileIndex + 2) * tileSize

export function animateVehicle(delta, vehicleRef, direction, speed) {
  if (direction) {
    vehicleRef.position.x =
      vehicleRef.position.x > endOfRow ? beginningOfRow : vehicleRef.position.x + speed * delta
  } else {
    vehicleRef.position.x =
      vehicleRef.position.x < beginningOfRow ? endOfRow : vehicleRef.position.x - speed * delta
  }
}
