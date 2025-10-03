// TODO: Create a lobby so that players will enter the game at the same time

<script setup>
import { useGameStore } from '@/stores/useGame'
import { socket } from '@/main'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineProps({
  url: String,
})

const game = useGameStore()

const route = useRoute()
const router = useRouter()

const loading = ref(true)

function toggleReadyBtn() {
  game.emitUpdateReadyStatus()
}

function joinLobby() {
  if (!game.getLobbyUrl) {
    game.emitRoomJoin(route.params.url)
  }

  setTimeout(() => {
    if (game.getAllPlayers.length === 0) {
      router.push('/error')
    } else {
      loading.value = false
    }
  }, 2000)
}

function leaveLobby() {
  game.emitRoomLeave()
  router.push('/home')
}

onMounted(async () => {
  joinLobby()
  //if (game.getAllPlayers.length === 0) {router.push('/error')}
})
</script>

<template>
  <div v-if="loading">Loading</div>
  <div v-else class="flex flex-col">
    <div class="grid grid-cols-3 gap-2">
      <div
        class="relative p-5 border flex flex-col"
        v-for="({ id, ready }, index) in game.getAllPlayers"
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
    <div v-if="game.getStartGame && game.getCreatedRoom" class="flex">
      <button class="p-2 border rounded cursor-pointer bg-green-200">Start Game</button>
    </div>
    <div v-if="game.getStartGame && !game.getCreatedRoom">Wait for the person who made the room to start the game</div>
  </div>
</template>
