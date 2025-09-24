<script setup>
import { useGameStore } from '@/stores/useGame';

/* const { fetchData } = useGameStore()

function toggleGame() {
    fetchData()
} */
</script>

<template>
    <router-link :to="'/game'">Start game</router-link>
</template>