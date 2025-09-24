<template class="top">
  <div v-if="!windowIsVisible">
    <TresCanvas shadows anti-alias alpha window-size>
      <TresAmbientLight />
      <TresGroup ref="group">
        <ClientPlayer />
        <OtherPlayer />
        <TheMap ref="mapGroup" />
      </TresGroup>
    </TresCanvas>
  </div>
  <!-- Controls -->
  <div class="absolute bottom-10 min-w-full flex items-end justify-center" v-if="!windowIsVisible">
    <div class="grid grid-cols-3 gap-2 w-[10rem]">
      <button
        class="w-full h-[40px] bg-white border-2 border-solid border-gray-400 shadow outline-0 cursor-pointer col-span-full"
        @click="game.queueMove('forward')"
      >
        <div class="flex justify-center scale-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="m7 14l5-5l5 5z" />
          </svg>
        </div>
      </button>
      <button
        class="w-full h-[40px] bg-white border-2 border-solid border-gray-400 shadow outline-0 cursor-pointer"
        @click="game.queueMove('left')"
      >
        <div class="flex justify-center scale-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m13.15 16.15l-3.625-3.625q-.125-.125-.175-.25T9.3 12t.05-.275t.175-.25L13.15 7.85q.075-.075.163-.112T13.5 7.7q.2 0 .35.138T14 8.2v7.6q0 .225-.15.363t-.35.137q-.05 0-.35-.15"
            />
          </svg>
        </div>
      </button>
      <button
        class="w-full h-[40px] bg-white border-2 border-solid border-gray-400 shadow outline-0 cursor-pointer"
        @click="game.queueMove('backward')"
      >
        <div class="flex justify-center scale-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M11.475 14.475L7.85 10.85q-.075-.075-.112-.162T7.7 10.5q0-.2.138-.35T8.2 10h7.6q.225 0 .363.15t.137.35q0 .05-.15.35l-3.625 3.625q-.125.125-.25.175T12 14.7t-.275-.05t-.25-.175"
            />
          </svg>
        </div>
      </button>
      <button
        class="w-full h-[40px] bg-white border-2 border-solid border-gray-400 shadow outline-0 cursor-pointer"
        @click="game.queueMove('right')"
      >
        <div class="flex justify-center scale-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M10 17V7l5 5z" />
          </svg>
        </div>
      </button>
    </div>
  </div>
  <!-- score -->
  <div class="absolute top-5 left-5 text-3xl text-white font-2P">
    {{ maxScore }}
  </div>
  <!-- pop up window -->
  <div
    class="absolute min-w-full min-h-full top-0 flex items-center justify-center"
    v-if="windowIsVisible"
  >
    <div class="flex flex-col items-center bg-white p-5">
      <h1>You. Dead.</h1>
      <p>
        Your score: <span>{{ maxScore }}</span>
      </p>
      <button class="bg-red-400 py-5 px-14 font-2P cursor-pointer" @click="resetPlayerAndMap">
        Retry?
      </button>
    </div>
  </div>
</template>

<script setup>
import { TresCanvas } from '@tresjs/core'
import TheMap from './components/TheMap.vue'
import ClientPlayer from './components/ClientPlayer.vue'
import OtherPlayer from './components/OtherPlayer.vue'

import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useGameStore } from './stores/useGame'
import { socket } from './main'

const game = useGameStore()
const { windowIsVisible, maxScore } = storeToRefs(game)

socket.off()
game.listenToEvents()

function onPress(e) {
  if (!game.disablePlayer) {
    if (e.key === 'a') {
      game.queueMove('left')
    }
    if (e.key === 's') {
      game.queueMove('backward')
    }
    if (e.key === 'd') {
      game.queueMove('right')
    }
    if (e.key === 'w') {
      game.queueMove('forward')
    }
  }
}

function resetPlayerAndMap() {
  game.resetGame()
}

onMounted(() => {
  window.addEventListener('keydown', (e) => onPress(e))
})
</script>

<style scoped>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'Press Start 2P', cursive;
}
</style>
