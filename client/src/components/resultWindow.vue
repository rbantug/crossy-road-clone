<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Icon } from '@iconify/vue'

import { router } from '@/router'

import Countdown from './Countdown.vue'

import { useResetStore } from '@/stores/useReset'
import { usePlayerStore } from '@/stores/usePlayer'
import { useSocketIOStore } from '@/stores/useSocketIO'
import { useMapStore } from '@/stores/useMap'

const reset = useResetStore()
const player = usePlayerStore()
const socketIO = useSocketIOStore()
const map = useMapStore()

const scoreBoardData = ref([])

function resetStores() {
  socketIO.resetState()
  player.resetState()
  reset.resetState()
  map.resetState()
}

function resetPlayerAndMap() {
  resetStores()
  socketIO.emitRetryGame()
}

function exitGame() {
  socketIO.emitExitGame('exit')
  resetStores()
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
  >
    <div class="flex flex-col items-center bg-white p-5 gap-y-2">
      <h1>{{ reset.getpopupWindowText }}</h1>
      <p>
        Your score: <span>{{ player.getMaxScore }}</span>
      </p>
      <!-- Scoreboard -->
      <div class="flex flex-col items-center">
        <p>Scoreboard</p>
        <template v-for="(player, index) in socketIO.getAllPlayers" :key="player.name">
          <div class="flex items-center gap-2">
            <span v-if="player.status === 'dead'">
              <Icon icon="mdi:emoticon-dead" width="40" height="40" />
            </span>
            <span>{{ player.id }}: {{ player.score }}</span>

          </div>
        </template>
      </div>
      <div class="flex gap-2">
        <button
          v-if="reset.getActivePlayerCount === 0 || reset.getGameOutOfTime"
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
      <p v-if="reset.getActivePlayerCount > 0 &&!reset.getGameOutOfTime">Wait for the game to end for the retry button to appear</p>
      <div>
        <Countdown v-if="reset.getShowCountDownRetryBtn" :duration="1" location="ResultWindow" @kickout-player="exitGame"/>
      </div>
    </div>
  </div>
</template>
