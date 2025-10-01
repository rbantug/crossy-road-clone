// @ts-check

import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

import { router } from '@/router'
import { socket } from '@/main'
import { generateRows } from '@/components/utils/generateRows'
import { validPosition } from '@/components/utils/validPosition'

import * as Types from '../../customTypes'

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

  /**
   * After the animation, the player should be at a new position. This function should remove the first element in the movesQueue queue/array and update the player's position.
   *
   * If it is the client player that moves, the function should also update the score and check if there is a need to add more rows using addRow()
   * @param {string} clientId - If the clientId is of the current client, it will update everything. If it is not the clientId, it will update the movesQueue and position only
   * @param {number} SDI - short for 'shared data index'. If this is another player, this parameter should contain the index for the other player's data in sharedData
   */

  function stepCompleted(clientId, SDI) {
    if (clientId === socket.id) {
      const direction = movesQueue.value.shift()

      if (direction === 'forward') playerPosition.value.currentRow++
      if (direction === 'backward') playerPosition.value.currentRow--
      if (direction === 'left') playerPosition.value.currentTile--
      if (direction === 'right') playerPosition.value.currentTile++

      if (playerPosition.value.currentRow > metadata.value.length - 10) addRow()

      maxScore.value = Math.max(maxScore.value, playerPosition.value.currentRow)
    } else {
      const direction = allPlayers.value[SDI].movesQueue.value.shift()

      if (direction === 'forward') allPlayers.value[SDI].position.currentRow++
      if (direction === 'backward') allPlayers.value[SDI].position.currentRow--
      if (direction === 'left') allPlayers.value[SDI].position.currentTile--
      if (direction === 'right') allPlayers.value[SDI].position.currentTile++
    }
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

  /**
   * Player data that is shared among the players
   * @type { import('vue').Ref }
   */
  const allPlayers = ref([])

  /**
   * Map data that is shared among the players
   * @type { import('vue').ShallowRef }
   */
  const map = shallowRef([])

  /**
   * This is the index of the current client in sharedData. The value will be updated on onGameInit()
   * @type {import('vue').Ref<number|null>}
   */

  const clientIndex = ref(null)

  /**
   * url parameter for the lobby
   * @type {import('vue').Ref<string|null>}
   */
  const lobbyUrl = ref(null)

  /**
   * Socket.io room id
   * @type {import('vue').Ref<string|null>}
   */
  const roomId = ref(null)

  const isValidUrl = ref(null)

  const startGame = ref(false)

  const getClientIndex = computed(() => clientIndex.value)

  const getAllPlayers = computed(() => allPlayers.value)

  const getLobbyUrl = computed(() => lobbyUrl.value)

  const getIsValidUrl = computed(() => isValidUrl.value)

  const getStartGame = computed(() => startGame.value)

  function listenToEvents() {
    socket.on('connect', onConnect)
    socket.on('game:init', onGameInit)
    socket.on('character:delete', onCharacterDelete)
    socket.on('character:updateData', onCharacterUpdateData)
    socket.on('character:update-client-ready', onCharacterUpdateReady)
    socket.on('game:is-valid-url', onGameIsValidUrl)
  }

  function onConnect() {
    console.log(`User ${socket.id} is connected!`)
  }

  function onGameInit(data) {
    allPlayers.value = data.player
    map.value = data.map
    lobbyUrl.value = data.lobbyUrl
    roomId.value = data.room_id

    clientIndex.value = allPlayers.value.findIndex((x) => x.id === socket.id)

    playerPosition.value = allPlayers.value[clientIndex.value].position
  }

  function onCharacterDelete(id) {
    // argument is the socket id of the deleted client
    const getIndex = allPlayers.value.findIndex((x) => x.id === id)

    allPlayers.value.splice(getIndex, 1)
  }

  /**
   * This should update the data of other players in 'sharedData'
   *
   * @param {Types.PlayerSchema} data
   */

  function onCharacterUpdateData(data) {
    const getIndex = allPlayers.value.findIndex((x) => x.id === data.id)

    // TODO: update data of other players
  }

  /**
   * Should update the ready status of other players
   * @param {{ id:string; ready:boolean, gameStart:boolean }} data
   */
  function onCharacterUpdateReady({ id, ready, gameStart }) {
    const getIndex = allPlayers.value.findIndex((x) => x.id === id)

    allPlayers.value[getIndex].ready = ready
    startGame.value = gameStart
  }

  function onGameIsValidUrl(data) {
    isValidUrl.value = data
  }

  ///////////////////////////
  // socket.io EMITS
  ///////////////////////////

  function emitCharacterMove(latestMove) {
    // the argument is the latest move added to the movesQueue
    const clientData = allPlayers.value[clientIndex.value]
    clientData.latestMove = latestMove

    socket.emit('character:move', clientData)
  }

  function emitUpdateReadyStatus() {
    allPlayers.value[clientIndex.value].ready = !allPlayers.value[clientIndex.value].ready

    socket.emit('character:update-server-ready', {
      id: socket.id,
      ready: allPlayers.value[clientIndex.value].ready,
      roomId: roomId.value
    })
  }

  function emitIsValidLobbyUrl(url) {
    socket.emit('room:is-valid-url', url)
  }

  function emitRoomCreate() {
    socket.emit('room:create')
  }

  function emitRoomJoin(lobbyUrl) {
    socket.emit('room:join', lobbyUrl)
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
    allPlayers,
    getAllPlayers,
    getClientIndex,
    getLobbyUrl,
    getIsValidUrl,
    getStartGame,
    listenToEvents,
    emitCharacterMove,
    emitUpdateReadyStatus,
    emitRoomCreate,
    emitIsValidLobbyUrl,
    emitRoomJoin,
  }
})
