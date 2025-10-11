// @ts-check
import { defineStore } from 'pinia'

import { ref, computed } from 'vue'

import { usePlayerStore } from './usePlayer'
import { useMapStore } from './useMap'

export const useResetStore = defineStore('reset', () => {
  const player = usePlayerStore()
  const map = useMapStore()

  const windowIsVisible = ref(false)
  const disablePlayer = ref(false)
  const controlsIsVisible = ref(false)

  const getWindowIsVisible = computed(() => windowIsVisible.value)
  const getDisablePlayer = computed(() => disablePlayer.value)
  const getControlsIsVisible = computed(() => controlsIsVisible.value)

  /**
   * Updates reset.controlsIsVisible 
   * @param {boolean} val 
   */
  function updateControlsIsVisible(val) {
    controlsIsVisible.value = val
  }

  function showPopUpWindow() {
    windowIsVisible.value = true
    disablePlayer.value = true
    controlsIsVisible.value = false
    player.getPlayerPosition.currentRow = 0
    player.getPlayerPosition.currentTile = 0
    map.updateMetadata([])
    player.updateMovesQueue(true)
    //map.addRow()
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
  }
})
