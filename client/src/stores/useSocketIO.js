// @ts-check

import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'

import { router } from '@/router'
import { socket } from '@/main'
import * as Types from '../../customTypes'
import { usePlayerStore } from './usePlayer'
import { useMapStore } from './useMap'

export const useSocketIOStore = defineStore('socketIO', () => {
  const player = usePlayerStore()
  const map = useMapStore()

  ///////////////////////////
  // socket.io LISTENERS
  ///////////////////////////

  /**
   * Player data that is shared among the players
   * @type { import('vue').Ref }
   */
  const allPlayers = ref([])

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
   * url for the game
   * @type {import('vue').Ref<string|null>}
   */
  const gameUrl = ref(null)

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

  const getGameUrl = computed(() => gameUrl.value)

  function listenToEvents() {
    socket.on('connect', onConnect)
    socket.on('game:init', onGameInit)
    socket.on('character:delete', onCharacterDelete)
    socket.on('character:update-client-ready', onCharacterUpdateReady)
    socket.on('game:is-valid-url', onGameIsValidUrl)
    socket.on('room:join-client', onRoomJoin)
    socket.on('room:player-leaves-room', onRoomLeave)
    socket.on('room:getLobbyUrl', onRoomGetLobbyUrl)
    socket.on('room:get-game-url', onRoomGetGameUrl)
    socket.on('game:add-rows', onGameAddRow)
    socket.on('game:character-update-move', onCharacterUpdateMove)
    socket.on('game:other-player-iframe', onGamePlayerIframe)
  }

  function onConnect() {
    console.log(`User ${socket.id} is connected!`)
  }

  function onGameInit(data) {
    allPlayers.value = data.player
    //map.value = data.map
    map.updateMetadata(data.map)
    lobbyUrl.value = data.lobbyUrl
    roomId.value = data.room_id

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
   * @param {string} deletedClientId - socket.id of the player that left the lobby
   * @param {string|null} newRoomLeadId - the socket.id of the player who is now the room lead. This user needs to click on the start game button to start the game.
   */
  function onRoomLeave(deletedClientId, newRoomLeadId = null) {
    const getIndex = allPlayers.value.findIndex((x) => x.id === deletedClientId)
    allPlayers.value.splice(getIndex, 1)

    // update your clientIndex
    clientIndex.value = allPlayers.value.findIndex((x) => x.id === socket.id)

    if (newRoomLeadId !== null) {
      const getIndex = allPlayers.value.findIndex((x) => x.id === newRoomLeadId)
      allPlayers.value[getIndex].createdRoom = true
      createdRoom.value = true
    }
    console.log(allPlayers.value)
    emitUpdateAllClientIndex()
  }

  function onCharacterDelete(id) {
    // argument is the socket id of the deleted client
    const getIndex = allPlayers.value.findIndex((x) => x.id === id)

    allPlayers.value.splice(getIndex, 1)
  }

  /**
   * This should update the data of other players in 'sharedData'
   *
   * @param {{
   *  clientId:string,
   *  move:string
   * }} parameters
   */

  function onCharacterUpdateMove({ clientId, move }) {
    if (socket.id === clientId) return

    const getIndex = allPlayers.value.findIndex((x) => x.id === clientId)
    allPlayers.value[getIndex].movesQueue.push(move)
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

  // TODO: Do you still need to check for valid lobby urls?
  function onGameIsValidUrl(data) {
    isValidUrl.value = data
  }

  function onRoomGetLobbyUrl(url) {
    lobbyUrl.value = url
    showLobbyUrl.value = true
  }

  function onRoomGetGameUrl(url) {
    gameUrl.value = url
    router.push(`/game/${url}`)
  }

  /**
   * Pushes new rows to the map.metadata
   * @param {Array} newRows
   */
  function onGameAddRow(newRows) {
    map.pushNewMetadata(newRows)
  }

  /**
   * 
   * @param {string} clientId - The socket.id of the other player that got hit
   */
  function onGamePlayerIframe(clientId) {
    if (clientId === socket.id) return

    const getIndex = allPlayers.value.findIndex((x) => x.id === clientId)
    allPlayers.value[getIndex].hit = true
    setTimeout(() => {
      allPlayers.value[getIndex].hit = false
    }, 3000)
  }
  ///////////////////////////
  // socket.io EMITS
  ///////////////////////////

  function emitCharacterMove(latestMove) {
    // the argument is the latest move added to the movesQueue
    socket.emit('game:character-move', latestMove)
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
    socket.emit('room:sendLobbyUrl')
  }

  function emitGoToRoom() {
    socket.emit('room:create')
  }

  function emitRoomJoin(lobbyUrl) {
    socket.emit('room:join', lobbyUrl)
  }

  function emitRoomLeave() {
    showLobbyUrl.value = false
    socket.emit('room:leave', roomId.value)
  }
  function emitStartGame() {
    socket.emit('game:start-from-lobby')
  }

  /**
   * This will tell the server to update the state.clientIndex of all clients in the same room.
   */
  function emitUpdateAllClientIndex() {
    socket.emit('room:update-client-index', roomId.value)
  }

  function emitRequestNewRows() {
    socket.emit('game:request-new-rows')
  }

  function emitPlayerHit() {
    socket.emit('game:player-hit')
  }

  return {
    getClientIndex,
    getAllPlayers,
    getLobbyUrl,
    getIsValidUrl,
    getStartGame,
    getShowLobbyUrl,
    getCreatedRoom,
    getGameUrl,
    listenToEvents,
    emitCharacterMove,
    emitUpdateReadyStatus,
    emitIsValidLobbyUrl,
    emitRoomCreate,
    emitRoomJoin,
    emitRoomLeave,
    emitGoToRoom,
    emitStartGame,
    emitRequestNewRows,
    emitPlayerHit
  }
})
