// @ts-check
import { defineStore } from 'pinia'

import { ref, computed } from 'vue'

import { generateRows } from '@/components/utils/generateRows'

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

  return {
    getMetadata,
    updateMetadata,
    pushNewMetadata,
    addRow,
    addVehicleRef,
    
  }
})
