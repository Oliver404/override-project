import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/docs/:pathMatch(.*)*',
      name: 'docs',
      component: () => import('../views/DocsView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
    },
    // 👇 ruta comodín para páginas inexistentes
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/P404.vue'),
    }
  ],
})

export default router
