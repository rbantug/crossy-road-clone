import * as THREE from 'three'
import { lerp } from 'three/src/math/MathUtils'
import { tileSize } from '../utils/constants'

const moveClock = new THREE.Clock(false)

export function animatePlayer(ref, movesQueue, stepCompleted, position) {
  if (!movesQueue.value.length) return
  if (!moveClock.running) moveClock.start()

  const stepTime = 0.2
  const progress = Math.min(1, moveClock.getElapsedTime() / stepTime)

  setPosition(progress, ref, movesQueue, position)
  setRotation(progress, ref, movesQueue)

  if (progress >= 1) {
    stepCompleted()
    moveClock.stop()
  }
}

function setPosition(progress, ref, movesQueue, position) {
  const startX = position.currentTile * tileSize
  const startY = position.currentRow * tileSize
  let endX = startX
  let endY = startY

  if (movesQueue.value[0] === 'left') endX -= tileSize
  if (movesQueue.value[0] === 'right') endX += tileSize
  if (movesQueue.value[0] === 'forward') endY += tileSize
  if (movesQueue.value[0] === 'backward') endY -= tileSize

  ref.position.x = lerp(startX, endX, progress)
  ref.position.y = lerp(startY, endY, progress)
  ref.children[2].position.z = Math.sin(progress * Math.PI) * 8
}

function setRotation(progress, ref, movesQueue) {
  let endRotation = 0
  if (movesQueue.value[0] === 'forward') endRotation = 0
  if (movesQueue.value[0] === 'backward') endRotation = Math.PI
  if (movesQueue.value[0] === 'left') endRotation = Math.PI * 0.5
  if (movesQueue.value[0] === 'right') endRotation = -Math.PI * 0.5

  ref.children[2].rotation.z = lerp(ref.children[2].rotation.z, endRotation, progress)
}
