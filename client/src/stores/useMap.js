// @ts-check
import { defineStore } from 'pinia'

import { ref, computed } from 'vue'

export const useMapStore = defineStore('map', () => {
  const metadata = ref([])

  const getMetadata = computed(() => metadata.value)

  /**
   * This is for updating the entire metadata array
   * @param {Array} val 
   */
  function updateMetadata(val) {
    metadata.value = val
  }

  /**
   * This is for pushing new rows to the metadata
   * @param {Array} val 
   */
  function pushNewMetadata(val) {
    metadata.value.push(...val)
  }

  function addVehicleRef(rowIndex, vehicleIndex, vehicleRef) {
    const row = metadata.value[rowIndex - 1].vehicles

    row[vehicleIndex - 1].ref = vehicleRef
  }

  const duration = ref(5)
  const getDuration = computed(() => duration.value)
  function updateDuration(val) {
    duration.value = val
  }

  /**
   * @type {import('vue').Ref<boolean|null>}
   */
  const enableDuration = ref(true)
  const getEnableDuration = computed(() => enableDuration.value)

  /**
   * 
   * @param {boolean} val 
   */
  function updateEnableDuration(val) {
    enableDuration.value = val
  }

  function resetState() {
    metadata.value = []
    duration.value = 5
    enableDuration.value = true
  }

  return {
    getMetadata,
    updateMetadata,
    pushNewMetadata,
    addVehicleRef,
    getDuration,
    updateDuration,
    getEnableDuration,
    updateEnableDuration,
    resetState,
  }
})
