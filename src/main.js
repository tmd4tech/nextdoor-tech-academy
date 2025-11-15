import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import { useAuthStore } from './stores/authStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialize auth from localStorage (restore token/user and validate)
// Wait for initialization before mounting so routes that depend on auth behave correctly on refresh.
;(async () => {
	try {
		// Dynamic import to ensure Pinia is installed and avoid HMR/import ordering issues
		const mod = await import('./stores/authStore')
		const auth = mod.useAuthStore(pinia)
		await auth.initializeAuth()
	} catch (err) {
		console.error('Error during auth initialization', err)
	}
	app.use(router)
	app.mount('#app')
})()