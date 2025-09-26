<script setup>
import { socket } from './main';
import { useGameStore } from './stores/useGame';

const game = useGameStore()

socket.off()
game.listenToEvents()
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
