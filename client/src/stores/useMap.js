// @ts-check
import { defineStore } from 'pinia'

import { ref, computed } from 'vue'

import { generateRows } from '@/components/utils/generateRows'

export const useMapStore = defineStore('map', () => {
  const metadata = ref([])

  const getMetadata = computed(() => metadata.value)

  function updateMetadata(val) {
    metadata.value = val
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
    addRow,
    addVehicleRef,
  }
})
