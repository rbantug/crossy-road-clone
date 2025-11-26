// @ts-check

import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'

import { router } from '@/router'
import { socket } from '@/main'
import * as Types from '../../customTypes'
import * as GlobalTypes from '../../../globalCustomTypes.js'
import { usePlayerStore } from './usePlayer'
import { useMapStore } from './useMap'
import { useResetStore } from './useReset'

export const useSocketIOStore = defineStore('socketIO', () => {
  const player = usePlayerStore()
  const map = useMapStore()
  const reset = useResetStore()

  ///////////////////////////
  // socket.io LISTENERS
  ///////////////////////////

  /**
   * Player data that is shared among the players
   * @type { import('vue').Ref<GlobalTypes.PlayerSchema[]> }
   */
  const allPlayers = ref([])

  /**
   * This will update the client's score in the allPlayers array. This is for the scoreboard.
   * @param { number } val - The client's current score
   */
  function updateClientScore(val) {
    allPlayers.value[clientIndex.value].score = val
  }

  function clearAllPlayers() {
    allPlayers.value = []
  }

  function clientIsDead() {
    allPlayers.value[clientIndex.value].status = 'dead'
  }

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
    socket.on('character:update-client-ready', onCharacterUpdateReady)
    socket.on('game:is-valid-url', onGameIsValidUrl)
    socket.on('room:join-client', onRoomJoin)
    socket.on('room:player-leaves-room', onRoomLeave)
    socket.on('room:getLobbyUrl', onRoomGetLobbyUrl)
    socket.on('room:get-game-url', onRoomGetGameUrl)
    socket.on('game:add-rows', onGameAddRow)
    socket.on('game:character-update-move', onCharacterUpdateMove)
    socket.on('game:other-player-iframe', onGamePlayerIframe)
    socket.on('game:other-player-is-dead', onGameOtherPlayerIsDead)
    socket.on('game:set-client-game-params', onGameSetParameters)
    socket.on('game:set-score', onGameSetScore)
    socket.on('game:go-to-new-lobby', onGameGoToNewLobby)
    socket.on('game:show-retryBtn-cd', onGameRetryBtnCD)
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
   * @param {import('../../customTypes').onRoomJoin} parameters
   */
  function onRoomJoin({ data, gameStart, gameParam }) {
    onGameInit(data)
    startGame.value = gameStart
    player.updateLives(gameParam.lives)
    map.updateEnableDuration(gameParam.enableDuration)

    if (gameParam.enableDuration) {
      map.updateDuration(gameParam.duration)
    }
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
    //@ts-ignore
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

  function onRoomGetGameUrl(url, activePlayerCount) {
    reset.updateActivePlayerCount(activePlayerCount)
    gameUrl.value = url
    allPlayers.value[clientIndex.value].gameConnectionStatus = 'connected'
    router.replace(`/game/${url}`)
    socket.emit('room:set-game-url-other-players', url, {
      lives: player.getLives,
      enableDuration: map.getEnableDuration,
      duration: map.getDuration,
    })
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

  /**
   *
   * @param {string} clientId - The socket id of the other player that died
   * @param {number} AAPlayers - The current count of active and alive players
   */
  function onGameOtherPlayerIsDead(clientId, AAPlayers) {
    reset.updateActivePlayerCount(AAPlayers)

    if (clientId === socket.id) return

    const getIndex = allPlayers.value.findIndex((x) => x.id === clientId)
    allPlayers.value[getIndex].status = 'dead'
  }

  function onGameSetParameters(clientId, { lives, duration, enableDuration }) {
    if (clientId === socket.id) return

    player.updateLives(lives)
    map.updateDuration(duration)
    map.updateEnableDuration(enableDuration)
  }

  /**
   * This will update the score of other players
   * @param {number} score - score of another player
   * @param {string} id - the id of the other player
   */
  function onGameSetScore(score, id) {
    if (socket.id === id) return

    const getIndex = allPlayers.value.findIndex((x) => x.id === id)
    allPlayers.value[getIndex].score = score
  }

  function onGameGoToNewLobby(url) {
    router.replace(`/lobby/${url}`)
    reset.updateWindowIsVisible(false)
  }

  function onGameRetryBtnCD(id) {
    if (socket.id === id) return
    if (!reset.getShowCountDownRetryBtn) {
      reset.updateShowCountDownRetryBtn(true)
    }
  }
  ///////////////////////////
  // socket.io EMITS
  ///////////////////////////

  function emitCharacterMove(latestMove) {
    // the argument is the latest move added to the movesQueue
    socket.emit('game:character-move', latestMove, roomId)
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
    showLobbyUrl.value = false
    socket.emit('room:create', lobbyUrl.value)
  }

  function emitRoomJoin(lobbyUrl) {
    socket.emit('room:join', lobbyUrl)
  }

  function emitRoomLeave() {
    showLobbyUrl.value = false
    socket.emit('room:leave', roomId.value)
  }
  function emitStartGame() {
    startGame.value = false
    socket.emit('game:start-from-lobby', roomId.value)
  }

  function emitRequestNewRows() {
    socket.emit('game:request-new-rows', roomId)
  }

  function emitPlayerHit() {
    socket.emit('game:player-hit', roomId)
  }

  function emitPlayerIsDead() {
    socket.emit('game:player-is-dead', roomId)
  }

  function emitGameParameters() {
    let reqObj = {
      lives: player.getLives,
      enableDuration: map.getEnableDuration,
    }

    if (map.getEnableDuration) {
      reqObj.duration = map.getDuration
    }

    socket.emit('game:set-game-parameters', reqObj, roomId)
  }

  function emitScore() {
    socket.emit('game:score', player.getMaxScore, roomId)
  }

  function emitExitGame() {
    socket.emit('game:exit', roomId)
  }

  function emitRetryGame() {
    socket.emit('game:retry', roomId)
  }

  function resetState() {
    allPlayers.value = []
    clientIndex.value = null
    lobbyUrl.value = null
    gameUrl.value = null
    roomId.value = null
    isValidUrl.value = null
    startGame.value = false
    showLobbyUrl.value = false
    createdRoom.value = null
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
    emitPlayerHit,
    emitPlayerIsDead,
    emitGameParameters,
    emitScore,
    emitExitGame,
    emitRetryGame,
    updateClientScore,
    clearAllPlayers,
    clientIsDead,
    resetState,
  }
})
