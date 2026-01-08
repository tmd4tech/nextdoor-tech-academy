<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card card">
        <div class="logo">
          <!-- <span class="logo-icon">💻</span> -->
          <h1>Nextdoor Tech Academy</h1>
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
            />
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input
              type="email"
              v-model="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              v-model="phone"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              v-model="password"
              placeholder="Enter a strong password"
              required
            />
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              v-model="confirmPassword"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            Create Account
          </button>
        </form>

        <p class="login-link">
          Already have an account?
          <router-link to="/login">Login here</router-link>
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

const handleRegister = async () => {
  error.value = ''
  success.value = ''

  if (
    !fullName.value ||
    !email.value ||
    !phone.value ||
    !password.value ||
    !confirmPassword.value
  ) {
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

  try {
    const result = await authStore.register(
      fullName.value,
      email.value,
      phone.value,
      password.value
    )
    if (result) {
      success.value =
        'Account created successfully! Redirecting to dashboard...'
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      error.value = 'Registration failed'
    }
  } catch (err) {
    error.value = err.message || 'Registration failed'
  }
}
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #1d4ed8 0, #020617 55%, #020617 100%);
  padding: 1.5rem;
}

.register-container {
  width: 100%;
  max-width: 460px;
}

.register-card {
  padding: 2.3rem 2rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.55);
}

/* logo */
.logo {
  text-align: center;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
}

.logo-icon {
  font-size: 2.4rem;
}

.logo h1 {
  font-size: 1.4rem;
  color: #0f172a;
  margin: 0;
}

/* heading */
.register-card h2 {
  text-align: center;
  margin-bottom: 1.4rem;
  font-size: 1.2rem;
}

/* form */
.form-group {
  margin-bottom: 1.05rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.35rem;
  color: #111827;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.7rem 0.8rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.25);
}

/* button */
.btn-block {
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.85rem;
  font-size: 0.95rem;
}

/* link to login */
.login-link {
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.9rem;
}

.login-link a {
  color: #f97316;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

/* messages */
.error-message {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 0.6rem;
  margin-bottom: 0.6rem;
  font-size: 0.86rem;
  border-left: 4px solid #ef4444;
}

.success-message {
  background-color: #d1fae5;
  color: #065f46;
  padding: 0.75rem;
  border-radius: 0.6rem;
  margin-bottom: 0.6rem;
  font-size: 0.86rem;
  border-left: 4px solid #10b981;
}

/* responsive */
@media (max-width: 768px) {
  .register-container {
    max-width: 100%;
  }
}
</style>
