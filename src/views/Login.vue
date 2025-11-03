<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card card">
        <div class="logo">
          <span class="logo-icon">💻</span>
          <h1>Nextdoor Tech</h1>
        </div>

        <h2>Login to Your Account</h2>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              v-model="email" 
              placeholder="Enter your email"
              required
            >
          </div>

          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              v-model="password" 
              placeholder="Enter your password"
              required
            >
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            Login
          </button>
        </form>

        <p class="forgot-password">
          <a href="#">Forgot your password?</a>
        </p>

        <div class="divider">Or</div>

        <div class="social-login">
          <button class="social-btn">
            <span class="social-icon">f</span> Facebook
          </button>
          <button class="social-btn">
            <span class="social-icon">G</span> Google
          </button>
        </div>

        <p class="signup-link">
          Don't have an account? <router-link to="/register">Sign up here</router-link>
        </p>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: test@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (authStore.login(email.value, password.value)) {
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    error.value = 'Invalid email or password'
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--dark-color));
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  padding: 2rem;
}

.logo {
  text-align: center;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  font-size: 2.5rem;
}

.logo h1 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin: 0;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}

.btn-block {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.875rem;
  font-size: 1rem;
}

.forgot-password {
  text-align: center;
  margin-bottom: 1.5rem;
}

.forgot-password a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.forgot-password a:hover {
  color: var(--dark-color);
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  color: #9ca3af;
  font-weight: 600;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 48%;
  height: 1px;
  background-color: var(--border-color);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.social-login {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  background-color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-size: 0.9rem;
}

.social-btn:hover {
  background-color: var(--light-color);
  border-color: var(--primary-color);
}

.social-icon {
  font-weight: 700;
  font-size: 1rem;
}

.signup-link {
  text-align: center;
  color: #6b7280;
}

.signup-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

.error-message {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border-left: 4px solid #ef4444;
}

.demo-credentials {
  background-color: #ecfdf5;
  border: 1px solid #d1fae5;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #065f46;
}

.demo-credentials p {
  margin: 0.25rem 0;
}

.demo-credentials strong {
  color: #047857;
}

@media (max-width: 768px) {
  .login-container {
    max-width: 100%;
  }
}
</style>