import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const returnUrl = ref(null) // used by router guard to remember where to go after login
  const baseURL = import.meta.env.VITE_API_BASE_URL

  const isLoggedIn = computed(() => !!token.value)

  const normalizeUser = raw => {
    const safe = raw || {}

    return {
      ...safe, // keeps safe.role and other fields from backend
      fullName:
        safe.fullName ||
        [safe.firstName, safe.lastName].filter(Boolean).join(' ') ||
        '',
      phone: safe.phone || safe.phoneNumber || '',
      enrolledCourses: Array.isArray(safe.enrolledCourses)
        ? safe.enrolledCourses
        : [],
      purchasedProducts: Array.isArray(safe.purchasedProducts)
        ? safe.purchasedProducts
        : []
    }
  }

  const persistAuth = () => {
    localStorage.setItem(
      'nextdoor_auth',
      JSON.stringify({ token: token.value, user: user.value })
    )
  }

  const clearPersistedAuth = () => {
    localStorage.removeItem('nextdoor_auth')
  }

  const setAuthState = data => {
    token.value = data.token
    user.value = normalizeUser(data.user)
    axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
    persistAuth()
  }

  // Restore from localStorage on store creation
  const saved = localStorage.getItem('nextdoor_auth')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.token && parsed.user) {
        token.value = parsed.token
        user.value = parsed.user
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
      }
    } catch (e) {
      console.error('Failed to parse saved auth', e)
      clearPersistedAuth()
    }
  }

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${baseURL}/api/auth/login`, {
        email,
        password
      })

      // data must contain { token, user: { ..., role: 'admin' | 'student' } }
      setAuthState(data)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const loginWithGoogle = async authCode => {
    try {
      const { data } = await axios.post(`${baseURL}/api/auth/google`, {
        code: authCode
      })
      setAuthState(data)
      return true
    } catch (error) {
      console.error('Google login error:', error)
      return false
    }
  }

  const register = async (fullName, email, phone, password) => {
    try {
      const [firstName, ...rest] = fullName.trim().split(' ')
      const lastName = rest.join(' ') || firstName

      await axios.post(`${baseURL}/api/auth/signup`, {
        firstName,
        lastName,
        email,
        password,
        phoneNumber: phone
      })

      return true
    } catch (error) {
      console.error('Registration error:', error)

      if (error.response?.data?.errors?.length) {
        throw new Error(error.response.data.errors[0].msg)
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Registration failed')
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    returnUrl.value = null
    delete axios.defaults.headers.common.Authorization
    clearPersistedAuth()
  }

  const updateProfile = updates => {
    if (!user.value) return
    user.value = normalizeUser({
      ...user.value,
      ...updates
    })
    persistAuth()
  }

  const enrollCourse = courseId => {
    if (!user.value) return false
    if (!Array.isArray(user.value.enrolledCourses)) {
      user.value.enrolledCourses = []
    }
    if (!user.value.enrolledCourses.includes(courseId)) {
      user.value.enrolledCourses.push(courseId)
      persistAuth()
      return true
    }
    return false
  }

  const purchaseProduct = productId => {
    if (!user.value) return false
    if (!Array.isArray(user.value.purchasedProducts)) {
      user.value.purchasedProducts = []
    }
    if (!user.value.purchasedProducts.includes(productId)) {
      user.value.purchasedProducts.push(productId)
      persistAuth()
      return true
    }
    return false
  }

  return {
    user,
    token,
    returnUrl,
    isLoggedIn,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    enrollCourse,
    purchaseProduct
  }
})
