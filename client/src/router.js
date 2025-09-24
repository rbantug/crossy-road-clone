import { createRouter, createWebHistory } from 'vue-router'
import TheHome from './components/TheHome.vue'
import TheGame from './components/TheGame.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/home', component: TheHome },
    { path: '/game', component: TheGame },
  ],
}) 

export { router }