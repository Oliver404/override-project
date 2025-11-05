import './assets/styles/main.css'

import { Buffer } from 'buffer'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useSettingsStore } from './stores/settings'

window.Buffer = Buffer

const app = createApp(App)

app.use(createPinia())

const settingsStore = useSettingsStore()
settingsStore.initialize()

app.use(router)
app.use(i18n)

app.mount('#app')
