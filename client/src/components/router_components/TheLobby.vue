// TODO: Create a lobby so that players will enter the game at the same time

<script setup>
import { useGameStore } from '@/stores/useGame'
import { socket } from '@/main'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  url: String,
})

const game = useGameStore()

const route = useRoute()

function toggleReadyBtn() {
  game.emitUpdateReadyStatus()
}

function joinLobby() {
  if (!game.getLobbyUrl) {
    game.emitRoomJoin(route.params.url)
  }
}

function leaveLobby() {
  
}

onMounted(() => {
  joinLobby()
})
</script>

<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-3 gap-2">
      <div class="relative p-5 border flex flex-col" v-for="({ id, ready }, index) in game.getAllPlayers">
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
        <span class="absolute right-1 top-0.5 p-1 cursor-pointer" @click="leaveLobby">x</span>
      </div>
    </div>
    <div v-if="game.getStartGame" class="flex">
      <button class="p-2 border rounded cursor-pointer bg-green-200">Start Game</button>
    </div>
  </div>
</template>
