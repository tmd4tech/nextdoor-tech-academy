import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
})

app.mount('#app')
