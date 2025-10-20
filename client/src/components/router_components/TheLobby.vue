<script setup lang="ts">
import { onMounted, ref } from 'vue'
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

function startGameBtn() {
  player.updateLives(lives.value)
  map.updateDuration(duration.value)
  socketIO.emitGameParameters()
  socketIO.emitStartGame()
}

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
      <!-- TODO: set max time in minutes -->
       <div class="w-[20rem]">
         <label class="pr-4">Game Duration (in minutes):</label>
         <input type="number" class="border w-[3rem]" v-model.number="duration" />
       </div>
    </div>
    <div>
      <div v-if="socketIO.getStartGame && socketIO.getCreatedRoom" class="flex">
        <button class="p-2 border rounded cursor-pointer bg-green-200" @click="startGameBtn">
          Start Game
        </button>
      </div>
      <div v-if="socketIO.getStartGame && !socketIO.getCreatedRoom">
        Wait for the person who made the room to start the game
      </div>
    </div>
  </div>
</template>
