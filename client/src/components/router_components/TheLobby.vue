<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useSocketIOStore } from '@/stores/useSocketIO'
import { usePlayerStore } from '@/stores/usePlayer'
import { useMapStore } from '@/stores/useMap'

import { socket } from '@/main'

defineProps({
  url: String,
})

const socketIO = useSocketIOStore()
const player = usePlayerStore()
const map = useMapStore()

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const lives = ref(3)
const duration = ref(5)
const toggleDuration = ref(true)
const showGameParamErrorMsg = ref(false)

function toggleReadyBtn() {
  socketIO.emitUpdateReadyStatus()
}

function joinLobby() {
  if (!socketIO.getLobbyUrl) {
    socketIO.emitRoomJoin(route.params.url)
  }

  setTimeout(() => {
    if (socketIO.getAllPlayers.length === 0) {
      router.replace('/error')
    } else {
      loading.value = false
    }
  }, 2000)
}

function leaveLobby() {
  socketIO.emitRoomLeave()
  router.replace('/home')
}

function setGameParam() {
  player.updateLives(lives.value)
  map.updateEnableDuration(toggleDuration.value)

  if (toggleDuration.value) {
    map.updateDuration(duration.value)
  }

  socketIO.emitGameParameters()
  showGameParamErrorMsg.value = false
}

function startGameBtn() {
  if (lives.value !== player.getLives || toggleDuration.value !== map.getEnableDuration || duration.value !== map.getDuration) {
    showGameParamErrorMsg.value = true
    return
  }

  socketIO.emitStartGame()
}

const outputDuration = computed(() => {
  if (map.getEnableDuration && map.getDuration > 0) {
    return `${map.getDuration} minute${map.getDuration >= 1 ? 's' : null}`
  }
  return 'No timer'
})

onMounted(async () => {
  joinLobby()
})
</script>

<template>
  <div v-if="loading">Loading</div>
  <div v-else class="flex flex-col">
    <div class="grid grid-cols-3 gap-2 pb-10">
      <div
        class="relative p-5 border flex flex-col"
        v-for="({ id, ready }, index) in socketIO.getAllPlayers"
      >
        <p>id: {{ id }}</p>
        <p>{{ ready ? 'ready' : 'not ready' }}</p>
        <button
          v-if="socket.id === id"
          class="p-2 border rounded cursor-pointer"
          :class="{ 'bg-blue-200': ready, 'bg-red-200': !ready }"
          @click="toggleReadyBtn"
        >
          {{ ready ? 'Wait a minute' : "I'm ready" }}
        </button>
        <span
          v-if="socket.id === id"
          class="absolute right-1 top-0.5 p-1 cursor-pointer"
          @click="leaveLobby"
          >x</span
        >
      </div>
    </div>
    <div class="flex flex-col pb-10" v-if="socketIO.getCreatedRoom">
      <div class="w-[20rem]">
        <label class="pr-4">Lives:</label>
        <input type="number" class="border w-[3rem]" v-model.number="lives" />
      </div>
      <div>
        <label class="pr-4">Enable Timer</label>
        <input type="checkbox" v-model="toggleDuration" />
      </div>
      <div class="w-[20rem]">
        <label class="pr-4" :class="{ 'text-gray-400': !toggleDuration }"
          >Game Duration (in minutes):</label
        >
        <input
          type="number"
          class="border w-[3rem]"
          :class="{ 'text-gray-400': !toggleDuration }"
          :disabled="!toggleDuration"
          v-model.number="duration"
        />
      </div>
      <button class="p-2 w-[8rem] border rounded cursor-pointer bg-blue-200" @click="setGameParam">
        Set Game Parameters
      </button>
    </div>
    <div v-if="!socketIO.getCreatedRoom" class="flex flex-col gap-y-2">
      <p>Lives: {{ player.getLives }}</p>
      <p>Duration: {{ outputDuration }}</p>
    </div>
    <div>
      <div v-if="socketIO.getStartGame && socketIO.getCreatedRoom" class="flex">
        <button class="p-2 border rounded cursor-pointer bg-green-200" @click="startGameBtn">
          Start Game
        </button>
        <p v-if="showGameParamErrorMsg">Update the changes to the game parameters</p>
      </div>
      <div v-if="socketIO.getStartGame && !socketIO.getCreatedRoom">
        Wait for the person who made the room to start the game
      </div>
    </div>
  </div>
</template>
