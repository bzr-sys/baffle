import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/daily', name: 'daily', component: () => import('../views/DailyView.vue') },
    { path: '/play/:game', name: 'game', component: () => import('../views/GameView.vue') },
    { path: '/play/:game/:n', name: 'play', component: () => import('../views/PlayView.vue') },
    { path: '/admin', name: 'admin', component: () => import('../views/AdminView.vue') },
  ],
})

export default router
