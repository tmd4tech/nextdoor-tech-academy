<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card card">
        <div class="logo">
          <span class="logo-icon">💻</span>
          <h1>Nextdoor Tech</h1>
        </div>

        <h2>Login to Your Account</h2>

        <!-- Regular Login Form -->
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" v-model="email" placeholder="Enter your email" required />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            {{ loading ? "Logging in..." : "Login" }}
          </button>
        </form>

        <p class="forgot-password">
          <router-link to="/forgot-password">Forgot your password?</router-link>
        </p>

        <div class="divider">Or</div>

        <!-- Social Login Buttons -->
        <div class="social-login">
          <button class="social-btn facebook" @click="loginWithFacebook">
            <span class="social-icon">f</span> Login with Facebook
          </button>

          <button class="social-btn google" @click="loginWithGoogle">
            <span class="social-icon">G</span> Login with Google
          </button>
        </div>

        <p class="signup-link">
          Don't have an account? <router-link to="/register">Sign up here</router-link>
        </p>

        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = computed(() => authStore.loading)

// ---------- Regular Login ----------
const handleLogin = async () => {
  error.value = ''
  try {
    const success = await authStore.login(email.value, password.value)
    if (!success) {
      error.value = authStore.error || 'Login failed. Please try again.'
      return
    }

    console.log('Logged in user:', authStore.user)
    console.log('Token:', authStore.token)

    const redirectRoute = authStore.user.isAdmin ? '/admin' : '/dashboard'
    router.push(redirectRoute)
  } catch (err) {
    console.error('Login failed:', err)
    error.value = 'Login failed. Please try again.'
  }
}

// ---------- Social Login ----------
const loginWithGoogle = () => {
  const width = 500
  const height = 600
  const left = window.innerWidth / 2 - width / 2
  const top = window.innerHeight / 2 - height / 2

  const popup = window.open(
    `${import.meta.env.VITE_API_URL}/api/auth/social/google`,
    "Google Login",
    `width=${width},height=${height},top=${top},left=${left}`
  )

  window.addEventListener("message", function listener(event) {
    if (event.origin !== import.meta.env.VITE_API_URL) return
    if (event.data.token) {
      authStore.loginWithToken(event.data.token).then(() => {
        const redirectRoute = authStore.user.isAdmin ? '/admin' : '/dashboard'
        router.push(redirectRoute)
      })
      popup.close()
      window.removeEventListener("message", listener)
    }
  })
}

const loginWithFacebook = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/social/facebook`
}

// Handle token from query (after social login full-page redirect)
onMounted(async () => {
  const token = route.query.token
  if (token) {
    await authStore.loginWithToken(token)
    const redirectRoute = authStore.user.isAdmin ? '/admin' : '/dashboard'
    router.push(redirectRoute)
  } else {
    // authStore initialization is handled globally in main.js; nothing to do here
  }
})
</script>


<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.1);
  background: #fff;
}

.logo {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo-icon {
  font-size: 3rem;
  display: block;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.social-btn.facebook { background-color: #1877f2; color: white; }
.social-btn.google { background-color: #fff; color: #333; border: 1px solid #ccc; }

.social-btn:hover { opacity: 0.9; }
.error-message { color: red; margin-top: 1rem; text-align: center; }
.divider { text-align: center; margin: 1rem 0; font-weight: bold; }
</style>
