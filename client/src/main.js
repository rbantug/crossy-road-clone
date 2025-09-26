import './assets/main.css'

import { useGameStore } from './stores/useGame'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { io } from 'socket.io-client'
import { router } from './router'

export const socket = io('http://localhost:3000')

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

export const gameStore = useGameStore()

app.mount('#app')
