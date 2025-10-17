// @ts-check
import { defineStore } from 'pinia'

import { ref, shallowRef, computed } from 'vue'

import { useSocketIOStore } from './useSocketIO'
import { useMapStore } from './useMap'
import { validPosition } from '@/components/utils/validPosition'
import { socket } from '@/main'

export const usePlayerStore = defineStore('player', () => {
  const socketIO = useSocketIOStore()
  const map = useMapStore()

  const playerPosition = shallowRef({
    currentRow: 0,
    currentTile: 0,
  })

  const movesQueue = ref([])
  const maxScore = ref(0)

  const getPlayerPosition = computed(() => playerPosition.value)
  const getMovesQueue = computed(() => movesQueue.value)
  const getMaxScore = computed(() => maxScore.value)

  /**
   *
   * @param {null|'currentRow'|'currentTile'} prop
   * @param {*} val
   */

  function updatePlayerPosition(prop = null, val) {
    if (prop === null) {
      playerPosition.value = val
    } else if (prop === 'currentRow' || prop === 'currentTile') {
      playerPosition.value[prop] = val
    }
  }

  /**
   *
   * @param {boolean} clear - If true, it will reset movesQueue to an empty array. It is false by default.
   * @param {string} pushVal - A string that will be added at the end of the movesQueue array.
   */
  function updateMovesQueue(clear = false, pushVal = null) {
    if (clear) {
      movesQueue.value = []
      return
    }
    movesQueue.value.push(pushVal)
  }

  function updateMaxScore(val) {
    maxScore.value = val
  }

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

      if (playerPosition.value.currentRow > map.getMetadata.length - 10)
        socketIO.emitRequestNewRows()

      maxScore.value = Math.max(maxScore.value, playerPosition.value.currentRow)
      socketIO.updateClientScore(maxScore.value)
      socketIO.emitScore()
    } else {
      const direction = socketIO.getAllPlayers[SDI].movesQueue.shift()

      if (direction === 'forward') socketIO.getAllPlayers[SDI].position.currentRow++
      if (direction === 'backward') socketIO.getAllPlayers[SDI].position.currentRow--
      if (direction === 'left') socketIO.getAllPlayers[SDI].position.currentTile--
      if (direction === 'right') socketIO.getAllPlayers[SDI].position.currentTile++
    }
  }

  function queueMove(direction) {
    const isValid = validPosition(
      {
        rowIndex: playerPosition.value.currentRow,
        tileIndex: playerPosition.value.currentTile,
      },
      [...movesQueue.value, direction],
      map.getMetadata,
    )

    if (!isValid) return

    movesQueue.value.push(direction)
    socketIO.emitCharacterMove(direction)
  }

  const lives = ref(3)

  const getLives = computed(() => lives.value)

  /**
   * Updates the player's lives
   * @param {number} val 
   */
  function updateLives(val) {
    lives.value = val
  }

  return {
    getPlayerPosition,
    getMovesQueue,
    getMaxScore,
    stepCompleted,
    queueMove,
    updatePlayerPosition,
    updateMovesQueue,
    updateMaxScore,
    getLives,
    updateLives
  }
})
