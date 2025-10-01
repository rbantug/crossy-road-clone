import { gameStore } from './main'

import { createRouter, createWebHistory } from 'vue-router'
import TheHome from './components/router_components/TheHome.vue'
import TheGame from './components/router_components/TheGame.vue'
import TheLobby from './components/router_components/TheLobby.vue'
import errorMessage from './components/router_components/errorMessage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { name: 'home', path: '/home', component: TheHome },
    {
      name: 'game',
      path: '/game/:url',
      component: TheGame,
      props: true,
      beforeEnter(to, from, next) {
        if (to.params.url !== gameStore.getLobbyUrl) {
          next('error')
        }
        next()
      },
    },
    {
      name: 'lobby',
      path: '/lobby/:url',
      component: TheLobby,
      props: true,
      // TODO: Add navigation guard for invalid lobby url
      beforeEnter(to, from, next) {
        /* gameStore.emitIsValidLobbyUrl(to.params.url)
        if (gameStore.getIsValidUrl) {
          next()
        } else {
          router.push('/error')
        } */
       if (!to.params.url) {
        next('error')
       }
       next()
      },
    },
    { name: 'error', path: '/:anything(.*)', component: errorMessage },
  ],
})

export { router }
