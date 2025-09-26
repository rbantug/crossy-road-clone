<template>
  <TresGroup ref="playerGroup">
    <TheCamera />
    <DirectionalLight :target="playerGroup" />
    <ThePlayer />
  </TresGroup>
</template>

<script setup>
import { useLoop } from '@tresjs/core'
import { nextTick, shallowRef, useTemplateRef } from 'vue'

import { useGameStore } from '@/stores/useGame'
import { storeToRefs } from 'pinia'
import * as THREE from 'three'
import { animatePlayer } from './animation_and_collision/animatePlayer'
import DirectionalLight from './DirectionalLight.vue'
import TheCamera from './TheCamera.vue'
import ThePlayer from './ThePlayer.vue'
import { tileSize } from './utils/constants'

const game = useGameStore()

const { movesQueue, windowIsVisible, playerPosition } = storeToRefs(game)

const playerGroup = shallowRef('playerGroup')

nextTick(() => {
  playerGroup.value.position.x = playerPosition.value.currentTile * tileSize
  playerGroup.value.position.y = playerPosition.value.currentRow * tileSize
})

const { onBeforeRender } = useLoop()

function hitTest() {
  const row = game.getMetadata[game.playerPosition.currentRow - 1]
  if (!row) return

  if (row.type === 'car' || row.type === 'truck') {
    const playerHitBox = new THREE.Box3()
    playerHitBox.setFromObject(playerGroup.value)

    row.vehicles.forEach(({ ref }) => {
      if (!ref) throw Error('Vehicle reference does not exist')

      const vehicleHitBox = new THREE.Box3()
      vehicleHitBox.setFromObject(ref)

      if (playerHitBox.intersectsBox(vehicleHitBox)) {
        if (!windowIsVisible) return
        game.showPopUpWindow()
      }
    })
  }
}

onBeforeRender(() => {
  animatePlayer(playerGroup.value, movesQueue, game.stepCompleted, playerPosition.value)
  hitTest()
})
</script>
