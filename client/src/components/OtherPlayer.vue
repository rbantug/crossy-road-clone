<script setup lang="ts">
import ThePlayer from './ThePlayer.vue'
import { useSocketIOStore } from '@/stores/useSocketIO'
import { socket } from '@/main'

const socketIO = useSocketIOStore()
</script>

<template>
  <template v-for="(player, index) in socketIO.getAllPlayers">
    <ThePlayer
      v-if="player.id !== socket.id"
      :position="player.position"
      :moves-queue="player.movesQueue"
      :shared-data-index="index"
      :client-id="player.id"
    />
  </template>
</template>
