import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DocsView from '../views/DocsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // Using a named route redirect for more robust navigation
      redirect: { name: 'home', params: { lang: 'en' } }
    },
    {
      path: '/:lang',
      name: 'home',
      component: HomeView,
      // Ensure lang is one of the supported languages
      beforeEnter: (to, from, next) => {
        const lang = to.params.lang;
        if (['en', 'es'].includes(lang)) {
          next();
        } else {
          next({ name: 'home', params: { lang: 'en' } }); // Redirect to default if lang is invalid
        }
      }
    },
    {
      path: '/:lang/docs/:page?',
      name: 'docs',
      component: DocsView
    }
  ]
})

export default router