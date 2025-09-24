<template>
  <TresGroup
    :position-x="props.initialTileIndex * tileSize"
    :rotation-z="directionFacing"
    ref="carGroup"
    name="car"
  >
    <!-- Car Body -->
    <TresMesh :position-z="10" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[60, 30, 15]" />
      <TresMeshLambertMaterial :color="props.color" flat-shading />
    </TresMesh>

    <!-- Car wind shield -->
    <TresMesh :position="[-5, 0, 25]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[33, 24, 12]" />
      <TresMeshLambertMaterial color="white" flat-shading />
    </TresMesh>

    <!-- Wheels -->
    <TheWheel :positionX="18" />
    <TheWheel :positionX="-18" />
  </TresGroup>
</template>

<script setup>
import { tileSize } from '@/components/utils/constants'
import TheWheel from './TheWheel.vue'

import { useLoop } from '@tresjs/core'
import { computed, onMounted, shallowRef } from 'vue'

import { animateVehicle } from '@/components/animation_and_collision/animateVehicle'

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

const carGroup = shallowRef()

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  animateVehicle(delta, carGroup.value, props.direction, props.speed)
})

onMounted(() => {
  game.addVehicleRef(props.rowIndex, props.vehicleIndex, carGroup.value)
})
</script>
