<script setup>
import * as THREE from 'three'
import { onMounted, useTemplateRef, ref, shallowRef } from 'vue'

import { Camera } from '@/THREE/main_components/Camera'
import { DirectionalLight } from '@/THREE/main_components/DirectionalLight'
import { Renderer } from '@/THREE/main_components/Renderer'
import { player, player2 } from '@/THREE/main_components/Player'
import { animatePlayer } from '@/THREE/animation_and_collision/animatePlayer'
import { map, initMap } from '@/THREE/main_components/Map'
import { useGameStore } from '@/stores/useGame'
import { tileSize } from '@/THREE/constants'

const game = useGameStore()

const threeContainer = useTemplateRef('threeContainer')
const scene = shallowRef(new THREE.Scene())
const camera = shallowRef(Camera())
const dirLight = shallowRef(DirectionalLight())
const ambientLight = shallowRef(new THREE.AmbientLight())
const renderer = shallowRef(Renderer())

const windowSize = ref({
  width: window.innerWidth,
  height: window.innerHeight
})

dirLight.value.target = player
player.add(camera.value)
player.add(dirLight.value)
console.log(game.getPositionP1)
player.position.x = game.getPositionP1.currentTile * tileSize

scene.value.add(player)
scene.value.add(ambientLight.value)
scene.value.add(map)

// player 2
console.log(game.getPositionP2)
player2.position.x = game.getPositionP2.currentTile * tileSize
scene.value.add(player2)


function animate() {
  animatePlayer()
  renderer.value.render(scene.value, camera.value)
}

onMounted(() => {
  threeContainer.value.appendChild(renderer.value.domElement)
  initMap()
  renderer.value.setAnimationLoop(animate)

  window.addEventListener("resize", () => {
    windowSize.value.width = window.innerWidth
    windowSize.value.height = window.innerHeight

    camera.value.aspect = windowSize.value.width / windowSize.value.height
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(windowSize.value.width, windowSize.value.height)
  })
})
</script>

<template>
  <div ref="threeContainer" id="game" class="flex"></div>
</template>

<style scoped></style>
