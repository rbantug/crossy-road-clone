<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from '@/stores/useGame';

const game = useGameStore()
const router = useRouter()
const route = useRoute()

function createRoom() {
    game.emitRoomCreate()
}
</script>

<template>
    <!-- <router-link to="/lobby">Play game</router-link> -->
     <button class="p-2 border rounded bg-green-200 cursor-pointer" @click="createRoom">Create a room</button>
     <div v-if="game.getLobbyUrl">
        <router-link :to="`/lobby/${game.getLobbyUrl}`">localhost:5173/lobby/{{ game.getLobbyUrl }}</router-link>
     </div>
</template>