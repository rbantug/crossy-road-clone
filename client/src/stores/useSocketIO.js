// @ts-check

import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'

import { socket } from '@/main'
import * as Types from '../../customTypes'
import { usePlayerStore } from './usePlayer'

export const useSocketIOStore = defineStore('socketIO', () => {
    const player = usePlayerStore()

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

  const showLobbyUrl = ref(false)

  /**
   * If the client is the one who created the room, the value will be updated to true. This variable is for the conditional rendering of the start game button in TheLobby.vue. Only the client who created the room can start the game after all players are ready.
   * @type {import('vue').Ref<boolean|null>}
   */
  const createdRoom = ref(null)

  const getClientIndex = computed(() => clientIndex.value)

  const getAllPlayers = computed(() => allPlayers.value)

  const getLobbyUrl = computed(() => lobbyUrl.value)

  const getIsValidUrl = computed(() => isValidUrl.value)

  const getStartGame = computed(() => startGame.value)

  const getShowLobbyUrl = computed(() => showLobbyUrl.value)

  const getCreatedRoom = computed(() => createdRoom.value)

  function listenToEvents() {
    socket.on('connect', onConnect)
    socket.on('game:init', onGameInit)
    socket.on('character:delete', onCharacterDelete)
    socket.on('character:updateData', onCharacterUpdateData)
    socket.on('character:update-client-ready', onCharacterUpdateReady)
    socket.on('game:is-valid-url', onGameIsValidUrl)
    socket.on('room:join-client', onRoomJoin)
    socket.on('room:player-leaves-room', onRoomLeave)
  }

  function onConnect() {
    console.log(`User ${socket.id} is connected!`)
  }

  function onGameInit(data) {
    allPlayers.value = data.player
    map.value = data.map
    lobbyUrl.value = data.lobbyUrl
    roomId.value = data.room_id
    showLobbyUrl.value = true

    clientIndex.value = allPlayers.value.findIndex((x) => x.id === socket.id)

    player.updatePlayerPosition(null, allPlayers.value[clientIndex.value].position)
    createdRoom.value = allPlayers.value[clientIndex.value].createdRoom
  }

  /**
   * Provides the necessary room data for the player that just joined. It will also update the "startGame" variable to prevent the game from starting.
   * @param {{data:{};gameStart:boolean}} data
   */
  function onRoomJoin({ data, gameStart }) {
    onGameInit(data)
    startGame.value = gameStart
  }

  /**
   * Removes the player from allPlayers array
   * @param {string} socketId - socket.id of the player that left the lobby
   */
  function onRoomLeave(socketId) {
    const getIndex = allPlayers.value.findIndex((x) => x.id === socketId)
    allPlayers.value.splice(getIndex, 1)
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
      roomId: roomId.value,
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

  function emitRoomLeave() {
    showLobbyUrl.value = false
    socket.emit('room:leave', roomId.value)
  }

  return {
    getClientIndex,
    getAllPlayers,
    getLobbyUrl,
    getIsValidUrl,
    getStartGame,
    getShowLobbyUrl,
    getCreatedRoom,
    listenToEvents,
    emitCharacterMove,
    emitUpdateReadyStatus,
    emitIsValidLobbyUrl,
    emitRoomCreate,
    emitRoomJoin,
    emitRoomLeave,
  }
})
