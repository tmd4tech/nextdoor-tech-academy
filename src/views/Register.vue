<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card card">
        <div class="logo">
          <span class="logo-icon">💻</span>
          <h1>Nextdoor Tech</h1>
        </div>

        <h2>Create Your Account</h2>

        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              v-model="fullName" 
              placeholder="Enter your full name"
              required
            >
          </div>

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
            <label>Phone Number</label>
            <input 
              type="tel" 
              v-model="phone" 
              placeholder="Enter your phone number"
              required
            >
          </div>

          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              v-model="password" 
              placeholder="Enter a strong password"
              required
            >
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              v-model="confirmPassword" 
              placeholder="Confirm your password"
              required
            >
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            Create Account
          </button>
        </form>

        <p class="login-link">
          Already have an account? <router-link to="/login">Login here</router-link>
        </p>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

const handleRegister = () => {
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

  if (authStore.register(fullName.value, email.value, phone.value, password.value)) {
    success.value = 'Account created successfully! Redirecting to dashboard...'
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } else {
    error.value = 'Email already exists. Please use a different email.'
  }
}
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--dark-color));
  padding: 1rem;
}

.register-container {
  width: 100%;
  max-width: 450px;
}

.register-card {
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

.register-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.35rem;
  color: var(--dark-color);
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.65rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}

.btn-block {
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.875rem;
  font-size: 1rem;
}

.login-link {
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
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

.success-message {
  background-color: #d1fae5;
  color: #065f46;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border-left: 4px solid #10b981;
}

@media (max-width: 768px) {
  .register-container {
    max-width: 100%;
  }
}
</style>