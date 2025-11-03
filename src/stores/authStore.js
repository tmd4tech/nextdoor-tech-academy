import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const users = ref([
    {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      fullName: 'John Doe',
      phone: '+233 24 123 4567',
      enrolledCourses: [1, 2],
      purchasedProducts: [1, 3, 6]
    }
  ])

  const isLoggedIn = computed(() => user.value !== null)

  const login = (email, password) => {
    const foundUser = users.value.find(u => u.email === email && u.password === password)
    if (foundUser) {
      user.value = { ...foundUser }
      return true
    }
    return false
  }

  const register = (fullName, email, phone, password) => {
    const userExists = users.value.find(u => u.email === email)
    if (userExists) {
      return false
    }
    
    const newUser = {
      id: users.value.length + 1,
      email,
      password,
      fullName,
      phone,
      enrolledCourses: [],
      purchasedProducts: []
    }
    
    users.value.push(newUser)
    user.value = newUser
    return true
  }

  const logout = () => {
    user.value = null
  }

  const updateProfile = (updates) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      const userIndex = users.value.findIndex(u => u.id === user.value.id)
      if (userIndex !== -1) {
        users.value[userIndex] = user.value
      }
    }
  }

  const enrollCourse = (courseId) => {
    if (user.value && !user.value.enrolledCourses.includes(courseId)) {
      user.value.enrolledCourses.push(courseId)
      const userIndex = users.value.findIndex(u => u.id === user.value.id)
      if (userIndex !== -1) {
        users.value[userIndex].enrolledCourses.push(courseId)
      }
      return true
    }
    return false
  }

  return {
    user,
    isLoggedIn,
    login,
    register,
    logout,
    updateProfile,
    enrollCourse
  }
})