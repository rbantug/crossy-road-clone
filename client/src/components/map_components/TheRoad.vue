<template>
  <TresGroup :position-y="props.rowIndex * tileSize" name="road">
    <TresMesh receive-shadow>
      <TresPlaneGeometry :args="[tilePerRow * tileSize, tileSize]" />
      <TresMeshLambertMaterial color="#666699" />
    </TresMesh>
    <template v-if="props.vehicle === 'car'">
      <TheCar
        v-for="car in vehicleData"
        :key="car.id"
        :initial-tile-index="car.initialTileIndex"
        :direction="props.direction"
        :color="car.color"
        :speed="props.speed"
        :row-index="props.rowIndex"
        :vehicle-index="car.id"
      />
    </template>
    <template v-if="props.vehicle === 'truck'">
      <TheTruck
        v-for="car in vehicleData"
        :key="car.id"
        :initial-tile-index="car.initialTileIndex"
        :direction="props.direction"
        :color="car.color"
        :speed="props.speed"
        :row-index="props.rowIndex"
        :vehicle-index="car.id"
      />
    </template>
  </TresGroup>
</template>

<script setup>
import { tilePerRow, tileSize } from '@/components/utils/constants'
import TheCar from './resources/TheCar.vue'
import TheTruck from './resources/TheTruck.vue'

const props = defineProps({
  rowIndex: {
    type: Number,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  vehicleData: {
    type: Array,
    required: true,
  },
  direction: {
    type: Boolean,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
})
</script>
