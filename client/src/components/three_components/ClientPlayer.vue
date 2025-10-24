<template>
  <TresGroup ref="playerGroup">
    <TheCamera />
    <DirectionalLight :target="playerGroup" />
    <ThePlayer />
  </TresGroup>
</template>

<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { nextTick, shallowRef, ref } from 'vue'

import { usePlayerStore } from '@/stores/usePlayer'
import { useResetStore } from '@/stores/useReset'
import { useMapStore } from '@/stores/useMap'
import { useSocketIOStore } from '@/stores/useSocketIO'

import * as THREE from 'three'
import { animatePlayer } from '../animation_and_collision/animatePlayer'
import DirectionalLight from './DirectionalLight.vue'
import TheCamera from './TheCamera.vue'
import ThePlayer from './ThePlayer.vue'
import { tileSize } from '../utils/constants'
import { socket } from '@/main'

const player = usePlayerStore()
const reset = useResetStore()
const map = useMapStore()
const socketIO = useSocketIOStore()

const playerGroup = shallowRef<THREE.Object3D>(null)
const isIframe = ref(false)

nextTick(() => {
  playerGroup.value.position.x = player.getPlayerPosition.currentTile * tileSize
  playerGroup.value.position.y = player.getPlayerPosition.currentRow * tileSize
})

const { onBeforeRender } = useLoop()

function hitTest() {
  const row = map.getMetadata[player.getPlayerPosition.currentRow - 1]
  if (!row) return

  if (row.type === 'car' || row.type === 'truck') {
    const playerHitBox = new THREE.Box3()
    playerHitBox.setFromObject(playerGroup.value)

    row.vehicles.forEach(({ ref }) => {
      if (!ref) throw Error('Vehicle reference does not exist')

      const vehicleHitBox = new THREE.Box3()
      vehicleHitBox.setFromObject(ref)

      if (playerHitBox.intersectsBox(vehicleHitBox)) {
        let currentLives = player.getLives
        if (currentLives === 1) {
          // TODO: after a player dies, update the activeAlivePlayers in data.room

          socketIO.emitPlayerIsDead()
          //@ts-ignore
          playerGroup.value.children[2].children[1].material.visible = false
          reset.playerDead()
        }
        socketIO.emitPlayerHit()
        player.updateLives(currentLives - 1)
        isIframe.value = true
        setTimeout(() => {
          isIframe.value = false
        }, 3000)
      }
    })
  }
}

function blinkingEffect(ref) {
  ref.children[2].children[1].material.visible = !ref.children[2].children[1].material.visible
  ref.children[2].children[3].material.visible = !ref.children[2].children[3].material.visible
}

onBeforeRender(({ elapsed }) => {
  animatePlayer(
    playerGroup.value,
    player.getMovesQueue,
    player.getPlayerPosition,
    socket.id,
    socketIO.getClientIndex,
  )
  if (isIframe.value) {
    if (elapsed % 1 < 0.5) {
    blinkingEffect(playerGroup.value)
    }
  } else {
    //@ts-ignore
    playerGroup.value.children[2].children[3].material.visible = true
    //@ts-ignore
    playerGroup.value.children[2].children[1].material.visible = true
    hitTest()
  }
  
})
</script>
