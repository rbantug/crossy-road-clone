<template>
  <TresGroup
    :position-x="props.initialTileIndex * tileSize"
    :rotate-z="directionFacing"
    cast-shadow
    ref="truckGroup"
    name="Truck"
  >
    <!-- cargo -->
    <TresMesh :position="[-15, 0, 25]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[70, 35, 35]" />
      <TresMeshLambertMaterial :color="0xb4c6fc" flat-shading />
    </TresMesh>

    <!-- cabin -->
    <TresMesh :position="[35, 0, 20]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[30, 30, 30]" />
      <TresMeshLambertMaterial :color="props.color" flat-shading />
    </TresMesh>

    <TheWheel :position-x="37" />
    <TheWheel :position-x="5" />
    <TheWheel :position-x="-35" />
  </TresGroup>
</template>

<script setup>
import { animateVehicle } from '@/components/animation_and_collision/animateVehicle'
import { tileSize } from '@/components/utils/constants'
import { useLoop } from '@tresjs/core'
import { computed, onMounted, shallowRef } from 'vue'
import TheWheel from './TheWheel.vue'

import { useGameStore } from '@/stores/useGame'

const game = useGameStore()

const props = defineProps({
  initialTileIndex: {
    type: Number,
    required: true,
  },
  direction: {
    type: Boolean,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
  rowIndex: {
    type: Number,
    required: true,
  },
  vehicleIndex: {
    type: Number,
    required: true,
  },
})

const directionFacing = computed(() => {
  if (!props.direction) return Math.PI
  return 0
})

const truckGroup = shallowRef()
const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  animateVehicle(delta, truckGroup.value, props.direction, props.speed)
})

onMounted(() => {
  game.addVehicleRef(props.rowIndex, props.vehicleIndex, truckGroup.value)
})
</script>
