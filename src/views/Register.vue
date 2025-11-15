<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card card">
        <div class="logo">
          <span class="logo-icon">💻</span>
          <h1>Nextdoor Tech</h1>
        </div>

        <h2>Create Your Account</h2>

        <!-- Registration Form -->
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" v-model="fullName" placeholder="Enter your full name" required />
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input type="email" v-model="email" placeholder="Enter your email" required />
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" v-model="phone" placeholder="Enter your phone number" required />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="password" placeholder="Enter a strong password" required />
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" v-model="confirmPassword" placeholder="Confirm your password" required />
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            {{ loading ? "Creating Account..." : "Create Account" }}
          </button>
        </form>

        <p class="login-link">
          Already have an account? <router-link to="/login">Login here</router-link>
        </p>

        <div class="divider">Or</div>

        <!-- Social Registration -->
        <div class="social-login">
          <button class="social-btn facebook" @click="registerWithFacebook">
            <span class="social-icon">f</span> Register with Facebook
          </button>

          <button class="social-btn google" @click="registerWithGoogle">
            <span class="social-icon">G</span> Register with Google
          </button>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

const loading = computed(() => authStore.loading)

const handleRegister = async () => {
  error.value = ''
  success.value = ''

  if (!fullName.value || !email.value || !phone.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  const result = await authStore.register(fullName.value, email.value, phone.value, password.value)
  
  if (result) {
    success.value = 'Account created successfully! Redirecting...'
    setTimeout(() => router.push('/'), 2000)
  } else {
    error.value = authStore.error || 'Registration failed. Email might already exist.'
  }
}

// ---------- Social Register/Login ----------
const registerWithGoogle = () => {
  const width = 500
  const height = 600
  const left = (window.innerWidth - width) / 2
  const top = (window.innerHeight - height) / 2
  window.open(
    `${import.meta.env.VITE_API_URL}/api/auth/social/google`,
    "GoogleLogin",
    `width=${width},height=${height},top=${top},left=${left}`
  )
}

const registerWithFacebook = () => {
  const width = 500
  const height = 600
  const left = (window.innerWidth - width) / 2
  const top = (window.innerHeight - height) / 2
  window.open(
    `${import.meta.env.VITE_API_URL}/api/auth/social/facebook`,
    "FacebookLogin",
    `width=${width},height=${height},top=${top},left=${left}`
  )
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  padding: 1rem;
}

.register-container {
  width: 100%;
  max-width: 450px;
}

.register-card {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.logo {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo-icon { font-size: 2.5rem; }
.logo h1 { font-size: 1.5rem; margin: 0; color: #4f46e5; }
.register-card h2 { text-align: center; margin-bottom: 1.5rem; }

.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-weight: 600; margin-bottom: 0.35rem; }
.form-group input { width: 100%; padding: 0.65rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
.form-group input:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }

.btn-primary { width: 100%; padding: 0.75rem; border-radius: 0.5rem; background: #4f46e5; color: #fff; border: none; font-weight: bold; }
.btn-primary:hover { opacity: 0.9; cursor: pointer; }

.login-link { text-align: center; margin-top: 1rem; font-size: 0.9rem; }
.login-link a { color: #4f46e5; text-decoration: none; font-weight: 600; }
.login-link a:hover { text-decoration: underline; }

.divider { text-align: center; margin: 1.5rem 0; position: relative; color: #9ca3af; font-weight: 600; }
.divider::before, .divider::after { content: ''; position: absolute; top: 50%; width: 48%; height: 1px; background-color: #d1d5db; }
.divider::before { left: 0; } .divider::after { right: 0; }

.social-login { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
.social-btn { flex: 1; padding: 0.75rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.35rem; font-size: 0.9rem; border: 1px solid #d1d5db; }
.social-btn.facebook { background-color: #1877f2; color: white; }
.social-btn.google { background-color: #fff; color: #333; }
.social-btn:hover { opacity: 0.9; }

.error-message { background-color: #fee2e2; color: #991b1b; padding: 0.75rem; border-radius: 0.5rem; margin-top: 1rem; text-align: center; font-size: 0.9rem; }
.success-message { background-color: #d1fae5; color: #065f46; padding: 0.75rem; border-radius: 0.5rem; margin-top: 1rem; text-align: center; font-size: 0.9rem; }
</style>
