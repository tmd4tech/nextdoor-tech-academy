import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './authStore'

const API_BASE = (import.meta.env.VITE_API_URL || 'VITE_API_URL=https://next-door-backend.onrender.com') + '/api'

export const useCourseStore = defineStore('course', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCourses = async () => {
    loading.value = true
    try {
      const { data } = await axios.get(`${API_BASE}/courses`)
      courses.value = data
      error.value = null
    } catch (err) {
      error.value = err.response?.data?.message || err.message
    } finally {
      loading.value = false
    }
  }

  const getCourseById = (id) => {
    return courses.value.find(course => course._id === id)
  }

const addCourse = async (course) => {
  try {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('token')
    if (!token) throw new Error('Admin token missing — please log in as admin')

    const formData = new FormData()

    const allowedFields = [
      'title','category','level','price','description',
      'instructor','duration','imageUrl','videoUrl','pdfUrl','quizUrl'
    ]

    allowedFields.forEach(key => {
      if (course[key] !== undefined && course[key] !== null && course[key] !== '') {
        formData.append(key, course[key])
      }
    })

    if (course.image) formData.append('image', course.image)
    if (course.pdf) formData.append('pdf', course.pdf)
    if (course.quiz) formData.append('quiz', course.quiz)

    const { data } = await axios.post(`${API_BASE}/courses`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })

    courses.value.push(data)
    return data
  } catch (err) {
    error.value = err.message || (err.response?.data?.message || 'Error adding course')
    throw err
  }
}

const updateCourse = async (course) => {
  try {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('token')
    if (!token) throw new Error('Admin token missing — please log in as admin')

    const formData = new FormData()

    const allowedFields = [
      'title','category','level','price','description',
      'instructor','duration','imageUrl','videoUrl','pdfUrl','quizUrl'
    ]

    allowedFields.forEach(key => {
      if (course[key] !== undefined && course[key] !== null && course[key] !== '') {
        formData.append(key, course[key])
      }
    })

    if (course.image) formData.append('image', course.image)
    if (course.pdf) formData.append('pdf', course.pdf)
    if (course.quiz) formData.append('quiz', course.quiz)

    const { data } = await axios.put(`${API_BASE}/courses/${course._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })

    const index = courses.value.findIndex(c => c._id === course._id)
    if (index !== -1) courses.value[index] = data
    return data
  } catch (err) {
    error.value = err.message || 'Error updating course'
    throw err
  }
}


  const deleteCourse = async (id) => {
    try {
      const authStore = useAuthStore()
      const token = authStore.token || localStorage.getItem('token')
      if (!token) throw new Error('Admin token missing — please log in as admin')
      
      await axios.delete(`${API_BASE}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      courses.value = courses.value.filter(c => c._id !== id)
    } catch (err) {
      error.value = err.message || (err.response?.data?.message || 'Error deleting course')
      console.error('Error deleting course:', error.value)
      throw err
    }
  }

  return {
    courses,
    loading,
    error,
    fetchCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
  }
})
