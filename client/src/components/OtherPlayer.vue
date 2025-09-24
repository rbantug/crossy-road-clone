<script setup>
import { useLoop } from '@tresjs/core'
import { useTemplateRef } from 'vue'

import ThePlayer from './ThePlayer.vue'
import { useGameStore } from '@/stores/useGame'
import { animatePlayer } from './animation_and_collision/animatePlayer'

const game = useGameStore()

const { onBeforeRender } = useLoop()

const player = useTemplateRef('player')

const otherPlayerData = onBeforeRender(() => {
  animatePlayer(player)
})
</script>

<template>
  <ThePlayer ref="player" />
</template>
