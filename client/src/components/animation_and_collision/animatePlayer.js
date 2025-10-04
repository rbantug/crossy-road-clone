// @ts-check

import * as THREE from 'three'
import { lerp } from 'three/src/math/MathUtils'
import { tileSize } from '../utils/constants'

import { playerStore } from '@/main'

const moveClock = new THREE.Clock(false)

/**
 * 
 * @param {THREE.Object3D} ref - The 3DObject ref
 * @param {Array} movesQueue - Array of the player's moves that is not yet processed by animatePlayer() 
 * @param {Object} position - The position of the player. An object with 'currentRow' and 'currentTile' properties. 
 * @param {String} clientId - The socket id of the player
 * @param {Number} sharedDataIndex - The index where the player's data is located in sharedData
 * @returns 
 */

export function animatePlayer(ref, movesQueue, position, clientId, sharedDataIndex) {
  if (!movesQueue.length) return
  if (!moveClock.running) moveClock.start()

  const stepTime = 0.2
  const progress = Math.min(1, moveClock.getElapsedTime() / stepTime)

  setPosition(progress, ref, movesQueue, position)
  setRotation(progress, ref, movesQueue)

  if (progress >= 1) {
    playerStore.stepCompleted(clientId, sharedDataIndex)
    moveClock.stop()
  }
}

function setPosition(progress, ref, movesQueue, position) {
  const startX = position.currentTile * tileSize
  const startY = position.currentRow * tileSize
  let endX = startX
  let endY = startY

  if (movesQueue[0] === 'left') endX -= tileSize
  if (movesQueue[0] === 'right') endX += tileSize
  if (movesQueue[0] === 'forward') endY += tileSize
  if (movesQueue[0] === 'backward') endY -= tileSize

  ref.position.x = lerp(startX, endX, progress)
  ref.position.y = lerp(startY, endY, progress)
  ref.children[2].position.z = Math.sin(progress * Math.PI) * 8
}

function setRotation(progress, ref, movesQueue) {
  let endRotation = 0
  if (movesQueue[0] === 'forward') endRotation = 0
  if (movesQueue[0] === 'backward') endRotation = Math.PI
  if (movesQueue[0] === 'left') endRotation = Math.PI * 0.5
  if (movesQueue[0] === 'right') endRotation = -Math.PI * 0.5

  ref.children[2].rotation.z = lerp(ref.children[2].rotation.z, endRotation, progress)
}
