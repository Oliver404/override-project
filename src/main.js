import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import './assets/main.css'

// Initialize the store's language and theme settings before creating the app
store.initializeTheme();
store.initializeLanguage().then(() => {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
});