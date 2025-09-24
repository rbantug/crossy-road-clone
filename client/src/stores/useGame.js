import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { socket } from '@/main'

import { generateRows } from '@/components/utils/generateRows'
import { validPosition } from '@/components/utils/validPosition'

export const useGameStore = defineStore('game', () => {
  //////////////////////
  // Player
  //////////////////////

  const playerPosition = shallowRef({
    currentRow: 0,
    currentTile: 0,
  })

  const movesQueue = ref([])
  const maxScore = ref(0)

  const getPlayerPosition = computed(() => playerPosition.value)

  function stepCompleted() {
    const direction = movesQueue.value.shift()

    if (direction === 'forward') playerPosition.value.currentRow++
    if (direction === 'backward') playerPosition.value.currentRow--
    if (direction === 'left') playerPosition.value.currentTile--
    if (direction === 'right') playerPosition.value.currentTile++

    if (playerPosition.value.currentRow > metadata.value.length - 10) addRow()

    maxScore.value = Math.max(maxScore.value, playerPosition.value.currentRow)
  }

  function queueMove(direction) {
    const isValid = validPosition(
      {
        rowIndex: playerPosition.value.currentRow,
        tileIndex: playerPosition.value.currentTile,
      },
      [...movesQueue.value, direction],
      metadata.value,
    )

    if (!isValid) return

    movesQueue.value.push(direction)
  }

  ////////////////////////
  // Map
  ////////////////////////

  const metadata = ref([])

  function addRow() {
    const newMetaData = generateRows(10)
    const startIndex = metadata.value.length

    newMetaData.forEach((data, index) => {
      const rowIndex = startIndex + index + 1
      data.id = rowIndex
    })

    metadata.value.push(...newMetaData)
  }

  function addVehicleRef(rowIndex, vehicleIndex, vehicleRef) {
    const row = metadata.value[rowIndex - 1].vehicles

    row[vehicleIndex - 1].ref = vehicleRef
  }

  const getMetadata = computed(() => metadata.value)

  ////////////////////////
  // Retry pop up window
  ////////////////////////

  const windowIsVisible = ref(false)
  const disablePlayer = ref(false)

  const getDisablePlayer = computed(() => disablePlayer.value)

  function showPopUpWindow() {
    windowIsVisible.value = true
    disablePlayer.value = true
    playerPosition.value.currentRow = 0
    playerPosition.value.currentTile = 0
    metadata.value = []
    movesQueue.value = []
    addRow()
  }

  function resetGame() {
    maxScore.value = 0
    windowIsVisible.value = false
    disablePlayer.value = false
  }

  ///////////////////////////
  // socket.io LISTENERS
  ///////////////////////////

  const sharedData = shallowRef({})

  const getSharedData = computed(() => sharedData.value)

  function listenToEvents() {
    socket.on('connect', onConnect)
    socket.on('game:init', onGameInit)
    socket.on('character:delete', onCharacterDelete)
    socket.on('character:updateData', onCharacterUpdateData)
  }

  function onConnect() {
    console.log(`User ${socket.id} is connected!`)
  }

  function onGameInit(data) {
    sharedData.value = data
    playerPosition.value = data[socket.id].position
  }

  function onCharacterDelete(id) {
    // argument is the socket id of the deleted client
    delete sharedData.value.players[id]
  }

  function onCharacterUpdateData(data) {
    sharedData.value.players[data.id].position = data.position
    sharedData.value.players[data.id].movesQueue.push(data.latestMove)
    sharedData.value.players[data.id].score = data.score
  }

  ///////////////////////////
  // socket.io EMITS
  ///////////////////////////

  function emitCharacterMove(latestMove) {
    // the argument is the latest move added to the movesQueue
    const userData = sharedData.value[socket.id]
    userData.latestMove = latestMove

    socket.emit('character:move', userData)
  }

  return {
    metadata,
    playerPosition,
    movesQueue,
    maxScore,
    queueMove,
    stepCompleted,
    addRow,
    windowIsVisible,
    addVehicleRef,
    showPopUpWindow,
    disablePlayer,
    resetGame,
    getMetadata,
    getPlayerPosition,
    getDisablePlayer,
    sharedData,
    getSharedData,
    listenToEvents,
    emitCharacterMove,
  }
})
