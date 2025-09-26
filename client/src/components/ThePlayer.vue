<script setup>
import { nextTick, shallowRef } from 'vue'

import { tileSize } from './utils/constants'

const props = defineProps({
  position: {
    type: Object,
    required: false,
  },
  movesQueue: {
    type: Array,
    required: false,
  },
})

const player = shallowRef('player')

nextTick(() => {
  playerGroup.value.position.x = props.position.currentTile * tileSize
  playerGroup.value.position.y = props.position.currentRow * tileSize
})
</script>

<template>
  <TresGroup ref="player">
    <!-- player body -->
    <TresMesh :position="[0, 0, 10]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[15, 15, 20]" />
      <TresMeshLambertMaterial color="white" flat-shading />
    </TresMesh>

    <!-- player cap -->
    <TresMesh :position="[0, 0, 21]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[2, 4, 2]" />
      <TresMeshLambertMaterial color="red" flat-shading />
    </TresMesh>
  </TresGroup>
</template>
