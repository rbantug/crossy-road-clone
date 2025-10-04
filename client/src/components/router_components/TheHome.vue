<script setup lang="ts">
import { useSocketIOStore } from '@/stores/useSocketIO';

const socketIO = useSocketIOStore()

function createRoom() {
    socketIO.emitRoomCreate()
}
</script>

<template>
     <button class="p-2 border rounded bg-green-200 cursor-pointer" @click="createRoom">Create a room</button>
     <div v-if="socketIO.getLobbyUrl && socketIO.getShowLobbyUrl">
        <router-link :to="`/lobby/${socketIO.getLobbyUrl}`">localhost:5173/lobby/{{ socketIO.getLobbyUrl }}</router-link>
     </div>
</template>