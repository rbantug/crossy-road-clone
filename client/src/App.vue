<script setup lang="ts">
import { socket } from './main';
import { useSocketIOStore } from './stores/useSocketIO';

const socketIO = useSocketIOStore()

socket.off()
socketIO.listenToEvents()
</script>

<template>
  <router-view></router-view>
</template>

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
