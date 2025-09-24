import * as THREE from 'three'

import { maxTileIndex, minTileIndex } from './constants'

const colorList = ['#ff0000', '#66ff33', '#0000ff', '#ff00ff', '#ffff00']

export function generateRows(amount) {
  const rows = []
  for (let i = 0; i < amount; i++) {
    const rowData = createRow()
    rows.push(rowData)
  }
  return rows
}

function createRow() {
  const type = randomElement(['forest', 'car', 'truck'])

  if (type === 'forest') return createForestRow()
  if (type === 'car') return createCarLane()
  return createTruckLane()
}

function randomElement(arr) {
  return arr[Math.trunc(THREE.MathUtils.randInt(0, arr.length - 1))]
}

function createForestRow() {
  const occupiedTiles = new Set()
  const trees = new Array(4).fill(null).map(() => {
    let tileIndex
    do {
      tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex)
    } while (occupiedTiles.has(tileIndex))
    occupiedTiles.add(tileIndex)

    const treeHeight = randomElement([20, 45, 60])

    return { tileIndex, height: treeHeight }
  })
  return {
    type: 'forest',
    trees,
  }
}

function createCarLane() {
  const direction = randomElement([true, false])

  const speed = randomElement([100, 150, 200, 250])

  const randomVehicleNums = randomElement([1, 2, 3])

  const occupiedTiles = new Set()

  let carId = 0

  const vehicles = new Array(randomVehicleNums).fill(null).map(() => {
    carId++
    let tileIndex
    do {
      tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex)
    } while (occupiedTiles.has(tileIndex))
    occupiedTiles.add(tileIndex - 1)
    occupiedTiles.add(tileIndex)
    occupiedTiles.add(tileIndex + 1)

    const color = randomElement(colorList)

    return { initialTileIndex: tileIndex, color, id: carId }
  })

  return {
    type: 'car',
    direction,
    speed,
    vehicles,
  }
}

function createTruckLane() {
  const direction = randomElement([true, false])

  const speed = randomElement([100, 150, 200, 250])

  const randomVehicleNums = randomElement([1, 2])

  const occupiedTiles = new Set()

  let truckId = 0

  const vehicles = new Array(randomVehicleNums).fill(null).map(() => {
    truckId++
    let tileIndex
    do {
      tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex)
    } while (occupiedTiles.has(tileIndex))
    occupiedTiles.add(tileIndex - 2)
    occupiedTiles.add(tileIndex - 1)
    occupiedTiles.add(tileIndex)
    occupiedTiles.add(tileIndex + 1)
    occupiedTiles.add(tileIndex + 2)

    const color = randomElement(colorList)

    return { initialTileIndex: tileIndex, color, id: truckId }
  })

  return {
    type: 'truck',
    direction,
    speed,
    vehicles,
  }
}
