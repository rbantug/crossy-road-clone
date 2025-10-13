<script setup lang="ts">
import { nextTick, shallowRef } from 'vue'
import { useLoop } from '@tresjs/core'

import { tileSize } from './utils/constants'
import { animatePlayer } from './animation_and_collision/animatePlayer'
import { Object3D } from 'three'

const props = defineProps({
  position: {
    type: Object,
    required: false,
  },
  movesQueue: {
    type: Array,
    required: false,
  },
  sharedDataIndex: {
    type: Number,
    required: false,
  },
  clientId: {
    type: String,
    required: false,
  },
})

const { onBeforeRender } = useLoop()

const player = shallowRef<Object3D>(null)

nextTick(() => {
  player.value.position.x = props.position.currentTile * tileSize
  player.value.position.y = props.position.currentRow * tileSize

  onBeforeRender(() => {
    animatePlayer(
      player.value,
      props.movesQueue,
      props.position,
      props.clientId,
      props.sharedDataIndex,
    )
  })
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
