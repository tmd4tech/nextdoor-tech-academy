<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card card">
        <div class="logo">
          <!-- <span class="logo-icon">💻</span> -->
          <h1>Nextdoor Tech Academy</h1>
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
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              v-model="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            Login
          </button>
        </form>

        <p class="forgot-password">
          <a href="#" @click.prevent="handleForgotPassword">Forgot your password?</a>
        </p>

        <div class="divider">Or continue with</div>

        <div class="social-login">
          <!-- GoogleLogin is registered globally by vue3-google-login -->
          <GoogleLogin :callback="handleGoogleCallback">
            <button type="button" class="social-btn social-google">
              <!-- <span class="social-icon">G</span> -->
              Google
            </button>
          </GoogleLogin>
        </div>

        <p class="signup-link">
          Don't have an account?
          <router-link to="/register">Sign up here</router-link>
        </p>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="info" class="info-message">
          {{ info }}
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
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const info = ref('')

const baseURL = import.meta.env.VITE_API_BASE_URL

const redirectAfterLogin = () => {
  const redirect = route.query.redirect || '/'
  router.push(redirect)
}

const handleLogin = async () => {
  error.value = ''
  info.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  try {
    const ok = await authStore.login(email.value, password.value)

    console.log('AFTER LOGIN', {
      ok,
      isLoggedIn: authStore.isLoggedIn,
      user: authStore.user
    })

    if (ok) {
      redirectAfterLogin()
    } else {
      error.value = 'Invalid email or password'
    }
  } catch (err) {
    console.error('Login failed:', err)
    error.value = err.message || 'Login failed'
  }
}

// callback from vue3-google-login, response.code is the auth code
const handleGoogleCallback = async (response) => {
  console.log('Google callback response:', response) // contains .code
  error.value = ''
  info.value = ''
  try {
    const ok = await authStore.loginWithGoogle(response.code)
    console.log('AFTER GOOGLE LOGIN', {
      ok,
      isLoggedIn: authStore.isLoggedIn,
      user: authStore.user
    })
    if (ok) {
      redirectAfterLogin()
    } else {
      error.value = 'Google login failed'
    }
  } catch (err) {
    console.error('Google login failed:', err)
    error.value = err.message || 'Google login failed'
  }
}

const handleForgotPassword = async () => {
  error.value = ''
  info.value = ''

  const targetEmail =
    email.value || window.prompt('Enter the email you registered with:')

  if (!targetEmail) return

  try {
    await axios.post(`${baseURL}/api/auth/forgot-password`, {
      email: targetEmail.trim()
    })
    info.value =
      'If an account exists for that email, a reset link has been sent.'
  } catch (err) {
    console.error('Forgot password error:', err)
    // keep message generic for security
    info.value =
      'If an account exists for that email, a reset link has been sent.'
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #1d4ed8 0, #020617 55%, #020617 100%);
  padding: 1.5rem;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  padding: 2.25rem 2rem 2rem;
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

/* headings */
.login-card h2 {
  text-align: center;
  margin-bottom: 1.4rem;
  font-size: 1.2rem;
}

/* form */
.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.45rem;
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

/* main button */
.btn-block {
  width: 100%;
  margin-top: 0.25rem;
  margin-bottom: 0.9rem;
  padding: 0.8rem;
  font-size: 0.95rem;
}

/* forgot password */
.forgot-password {
  text-align: center;
  margin-bottom: 1.2rem;
}

.forgot-password a {
  color: #f97316;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.forgot-password a:hover {
  text-decoration: underline;
}

/* divider */
.divider {
  text-align: center;
  margin: 1.1rem 0 0.9rem;
  position: relative;
  color: #9ca3af;
  font-weight: 500;
  font-size: 0.8rem;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #e5e7eb;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

/* social login – only Google */
.social-login {
  display: flex;
  justify-content: center;
  margin-bottom: 1.4rem;
}

.social-btn {
  flex: 1;
  padding: 0.7rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  transition: all 0.2s ease;
  border: none;
}

/* Google button: white pill with subtle border */
.social-google {
  background-color: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.09);
}

.social-google:hover {
  border-color: #f97316;
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.16);
}

.social-icon {
  font-weight: 700;
  font-size: 1rem;
}

/* signup link */
.signup-link {
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.9rem;
}

.signup-link a {
  color: #f97316;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

/* error */
.error-message {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 0.6rem;
  margin-bottom: 1rem;
  font-size: 0.86rem;
  border-left: 4px solid #ef4444;
}

/* info */
.info-message {
  background-color: #e0f2fe;
  color: #075985;
  padding: 0.75rem;
  border-radius: 0.6rem;
  margin-bottom: 1rem;
  font-size: 0.86rem;
  border-left: 4px solid #0284c7;
}

/* demo credentials */
.demo-credentials {
  background-color: #ecfdf5;
  border: 1px solid #d1fae5;
  padding: 0.85rem;
  border-radius: 0.6rem;
  margin-top: 0.5rem;
  font-size: 0.82rem;
  color: #065f46;
}

.demo-credentials p {
  margin: 0.2rem 0;
}

.demo-credentials strong {
  color: #047857;
}

/* responsive */
@media (max-width: 768px) {
  .login-container {
    max-width: 100%;
  }
}
</style>
