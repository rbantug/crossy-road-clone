<template>
  <TresAmbientLight />
  <ThePlayer />
  <TheMap />
</template>

<script setup>
import { useTemplateRef } from 'vue'
import TheMap from './TheMap.vue'
import ThePlayer from './ClientPlayer.vue'
</script>
