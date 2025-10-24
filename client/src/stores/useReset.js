// @ts-check
import { defineStore } from 'pinia'

import { ref, computed } from 'vue'

import { usePlayerStore } from './usePlayer'
import { useMapStore } from './useMap'
import { useSocketIOStore } from './useSocketIO'

export const useResetStore = defineStore('reset', () => {
  const player = usePlayerStore()
  const map = useMapStore()
  const socketIO = useSocketIOStore()

  const windowIsVisible = ref(false)
  const disablePlayer = ref(false)
  const controlsIsVisible = ref(false)
  const livesIsVisible = ref(false)
  const popupWindowText = ref(null)
  const activePlayerCount = ref(null)
  const gameOutOfTime = ref(false)

  const getWindowIsVisible = computed(() => windowIsVisible.value)
  const getDisablePlayer = computed(() => disablePlayer.value)
  const getControlsIsVisible = computed(() => controlsIsVisible.value)
  const getLivesIsVisible = computed(() => livesIsVisible.value)
  const getpopupWindowText = computed(() => popupWindowText.value)
  const getActivePlayerCount = computed(() => activePlayerCount.value)
  const getGameOutOfTime = computed(() => gameOutOfTime.value)

  /**
   * Updates reset.controlsIsVisible 
   * @param {boolean} val 
   */
  function updateControlsIsVisible(val) {
    controlsIsVisible.value = val
  }

  /**
   * Updates reset.livesIsVisible
   * @param {boolean} val 
   */
  function updateLivesIsVisible(val) {
    livesIsVisible.value = val
  }

  /**
   * 
   * @param {number} val 
   */
  function updateActivePlayerCount(val) {
    activePlayerCount.value = val
  }

  function showPopUpWindow() {
    windowIsVisible.value = true
    disablePlayer.value = true
    controlsIsVisible.value = false
    livesIsVisible.value = false
    player.getPlayerPosition.currentRow = 0
    player.getPlayerPosition.currentTile = 0
    map.updateMetadata([])
    player.updateMovesQueue(true)
  }

  function playerDead() {
    socketIO.clientIsDead()
    popupWindowText.value = 'You. Dead.'
    showPopUpWindow()
  }

  function playerOutOfTime() {
    if (popupWindowText.value === null) {
      popupWindowText.value = 'Out of time (A placeholder for now)'
    }
    gameOutOfTime.value = true
    showPopUpWindow()
  }

  function resetGame() {
    player.updateMaxScore(0)
    windowIsVisible.value = false
    disablePlayer.value = false
  }

  return {
    getWindowIsVisible,
    getDisablePlayer,
    getControlsIsVisible,
    updateControlsIsVisible,
    showPopUpWindow,
    resetGame,
    getLivesIsVisible,
    updateLivesIsVisible,
    playerDead,
    playerOutOfTime,
    getpopupWindowText,
    getActivePlayerCount,
    updateActivePlayerCount,
    getGameOutOfTime,
  }
})
