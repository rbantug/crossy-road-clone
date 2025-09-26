<script setup>
import ThePlayer from './ThePlayer.vue'
import { useGameStore } from '@/stores/useGame'
import { socket } from '@/main'
socket

const game = useGameStore()
</script>

<template>
  <template v-for="player in game.getSharedData">
    <ThePlayer
      v-if="player.id !== socket.id"
      :position="player.position"
      :moves-queue="player.movesQueue"
    />
  </template>
</template>
