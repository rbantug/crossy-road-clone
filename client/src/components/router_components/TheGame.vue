<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { Icon } from '@iconify/vue'
import { GlobalEvents } from 'vue-global-events'

import TheMap from '../TheMap.vue'
import ClientPlayer from '../ClientPlayer.vue'
import OtherPlayer from '../OtherPlayer.vue'

import { nextTick, onMounted, ref } from 'vue'

import { useResetStore } from '@/stores/useReset'
import { usePlayerStore } from '@/stores/usePlayer'
import { useSocketIOStore } from '@/stores/useSocketIO'
import { router } from '@/router'

const reset = useResetStore()
const player = usePlayerStore()
const socketIO = useSocketIOStore()

function onPress(e) {
  if (!reset.getDisablePlayer) {
    if (e.key === 'a') {
      player.queueMove('left')
    }
    if (e.key === 's') {
      player.queueMove('backward')
    }
    if (e.key === 'd') {
      player.queueMove('right')
    }
    if (e.key === 'w') {
      player.queueMove('forward')
    }
  }
}

function resetPlayerAndMap() {
  reset.resetGame()
}

function exitGame() {
  socketIO.emitRoomLeave()
  socketIO.clearAllPlayers()
  reset.resetGame()
  router.replace('/home')
}

const isLoading = ref(true)

const scoreboardIsVisible = ref(false)
const scoreBoardData = ref([])
function toggleScoreboard() {
  scoreboardIsVisible.value = !scoreboardIsVisible.value
}

nextTick(() => {
  scoreBoardData.value = socketIO.getAllPlayers.map((x) => {
    return { name: x.id, score: x.score }
  })
})

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
    reset.updateControlsIsVisible(true)
    reset.updateLivesIsVisible(true)
  }, 2000)
})
</script>

<template>
  <GlobalEvents @keypress="(e) => onPress(e)" />
  <div v-if="isLoading">
    <div>Loading...</div>
    <!-- TODO: Create a loading bar for importing models in the future -->
  </div>
  <div v-if="!reset.getWindowIsVisible && !isLoading">
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
  <div
    class="absolute bottom-10 min-w-full flex items-end justify-center"
    v-if="reset.getControlsIsVisible"
  >
    <div class="grid grid-cols-3 gap-2 w-[10rem]">
      <button
        class="w-full h-[40px] bg-white border-2 border-solid border-gray-400 shadow outline-0 cursor-pointer col-span-full"
        @click="player.queueMove('forward')"
      >
        <div class="flex justify-center scale-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="m7 14l5-5l5 5z" />
          </svg>
        </div>
      </button>
      <button
        class="w-full h-[40px] bg-white border-2 border-solid border-gray-400 shadow outline-0 cursor-pointer"
        @click="player.queueMove('left')"
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
        @click="player.queueMove('backward')"
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
        @click="player.queueMove('right')"
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
    {{ player.getMaxScore }}
  </div>
  <!-- lives -->
  <div class="absolute top-5 right-5 flex gap-2" v-if="reset.getLivesIsVisible">
    <div v-for="(x, index) in player.getLives">
      <div class="">
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
          <path
            fill="#e30000"
            d="M9 2H5v2H3v2H1v6h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2V6h-2V4h-2V2h-4v2h-2v2h-2V4H9zm0 2v2h2v2h2V6h2V4h4v2h2v6h-2v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2H3V6h2V4z"
            stroke-width="1"
            stroke="#e30000"
          />
        </svg>
      </div>
    </div>
  </div>
  <!-- pop up window -->
  <div
    class="absolute min-w-full min-h-full top-0 flex items-center justify-center"
    v-if="reset.getWindowIsVisible"
  >
    <div class="flex flex-col items-center bg-white p-5 gap-y-2">
      <h1>You. Dead.</h1>
      <p>
        Your score: <span>{{ player.getMaxScore }}</span>
      </p>
      <button class="bg-green-200 py-5 w-full font-2P cursor-pointer" @click="toggleScoreboard">
        Show Scoreboard
      </button>
      <!-- Scoreboard -->
      <div v-if="scoreboardIsVisible">
        <template v-for="(player, index) in socketIO.getAllPlayers" :key="player.name">
          <p>{{ player.id }}: {{ player.score }}</p>
        </template>
      </div>
      <div class="flex gap-2">
        <button
          class="w-[10rem] bg-red-400 py-5 px-5 font-2P cursor-pointer"
          @click="resetPlayerAndMap"
        >
          Retry?
        </button>
        <button
          class="w-[10rem] bg-blue-400 py-5 px-5 font-2P text-center cursor-pointer"
          @click="exitGame"
        >
          Exit
        </button>
      </div>

      <!-- TODO: retry button will now wait for all players to finish the game. Once done, all players will be redirected to a new lobby with a new url -->
    </div>
  </div>
  <!-- TODO: create another pop up window where the player can modify some game options or exit the game -->
  <!-- TODO: add a timer -->
</template>
