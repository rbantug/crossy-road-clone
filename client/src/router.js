import { createRouter, createWebHistory } from 'vue-router'
import TheHome from './components/router_components/TheHome.vue'
import TheGame from './components/router_components/TheGame.vue'
import errorMessage from './components/router_components/errorMessage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { name: 'home', path: '/home', component: TheHome },
    { name: 'game', path: '/game', component: TheGame },
    { path: '/:anything(.*)', component: errorMessage },
  ],
}) 

export { router }