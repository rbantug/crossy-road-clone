<script setup lang="ts">
import { ref, nextTick } from 'vue'

import { router } from '@/router'

import { useResetStore } from '@/stores/useReset'
import { usePlayerStore } from '@/stores/usePlayer'
import { useSocketIOStore } from '@/stores/useSocketIO'

const reset = useResetStore()
const player = usePlayerStore()
const socketIO = useSocketIOStore()

const scoreboardIsVisible = ref(false)
const scoreBoardData = ref([])
function toggleScoreboard() {
  scoreboardIsVisible.value = !scoreboardIsVisible.value
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

nextTick(() => {
  scoreBoardData.value = socketIO.getAllPlayers.map((x) => {
    return { name: x.id, score: x.score }
  })
})
</script>

<template>
  <div
    class="absolute min-w-full min-h-full top-0 flex items-center justify-center"
    v-if="reset.getWindowIsVisible"
  >
    <div class="flex flex-col items-center bg-white p-5 gap-y-2">
      <h1>{{ reset.getpopupWindowText }}</h1>
      <p>
        Your score: <span>{{ player.getMaxScore }}</span>
      </p>
      <button class="bg-green-200 py-5 w-full font-2P cursor-pointer" @click="toggleScoreboard">
        Show Scoreboard
      </button>
      <!-- Scoreboard -->
      <div v-if="scoreboardIsVisible">
        <template v-for="(player, index) in scoreBoardData" :key="player.name">
          <p>{{ player.name }}: {{ player.score }}</p>
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
</template>
