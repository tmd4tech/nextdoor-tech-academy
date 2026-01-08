// src/stores/courseStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useCourseStore = defineStore('course', () => {
  const courses = ref([
    {
      id: 1,
      title: 'Basic Phone Repair Fundamentals',
      instructor: 'Kwame Mensah',
      category: 'Phone Repair',
      level: 'Beginner',
      duration: '4 weeks',
      price: 500,
      rating: 4.8,
      students: 234,
      image: 'course-phone-basic.jpg',
      description: 'Learn the fundamentals of phone repair including screen replacement, battery replacement, and basic troubleshooting',
      syllabus: [
        'Week 1: Introduction to Phone Components',
        'Week 2: Screen Replacement Techniques',
        'Week 3: Battery and Charging Port Repair',
        'Week 4: Software Troubleshooting'
      ],
      prerequisites: 'None',
      certificate: true,
      modules: [
        {
          id: 1,
          title: 'Module 1: Phone Components',
          lessons: [
            { id: 1, title: 'Introduction to Phone Parts', duration: '15 min', videoUrl: 'video1.mp4' },
            { id: 2, title: 'Understanding Displays', duration: '20 min', videoUrl: 'video2.mp4' }
          ]
        },
        {
          id: 2,
          title: 'Module 2: Screen Replacement',
          lessons: [
            { id: 3, title: 'Screen Removal Techniques', duration: '25 min', videoUrl: 'video3.mp4' },
            { id: 4, title: 'Screen Installation', duration: '20 min', videoUrl: 'video4.mp4' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Laptop Repair Masterclass',
      instructor: 'Ama Adjei',
      category: 'Laptop Repair',
      level: 'Intermediate',
      duration: '8 weeks',
      price: 1200,
      rating: 4.9,
      students: 156,
      image: 'course-laptop-advanced.jpg',
      description: 'Comprehensive laptop repair training covering hardware diagnostics, motherboard repair, and component replacement',
      syllabus: [
        'Week 1-2: Laptop Architecture & Disassembly',
        'Week 3-4: Motherboard Diagnostics',
        'Week 5-6: Component Level Repair',
        'Week 7-8: Advanced Troubleshooting'
      ],
      prerequisites: 'Basic electronics knowledge',
      certificate: true,
      modules: []
    },
    {
      id: 3,
      title: 'iPhone Repair Specialist',
      instructor: 'Kofi Asante',
      category: 'Phone Repair',
      level: 'Advanced',
      duration: '6 weeks',
      price: 950,
      rating: 4.7,
      students: 89,
      image: 'course-iphone-specialist.jpg',
      description: 'Advanced iPhone repair techniques including microsoldering, water damage repair, and Face ID troubleshooting',
      syllabus: [
        'Week 1: iPhone Architecture Deep Dive',
        'Week 2: Microsoldering Basics',
        'Week 3-4: Board Level Repair',
        'Week 5: Face ID & Security Repairs',
        'Week 6: Water Damage Recovery'
      ],
      prerequisites: 'Basic Phone Repair course or equivalent experience',
      certificate: true,
      modules: []
    },
    {
      id: 4,
      title: 'Computer Software Troubleshooting',
      instructor: 'Yaw Boateng',
      category: 'Software Training',
      level: 'Beginner',
      duration: '3 weeks',
      price: 400,
      rating: 4.6,
      students: 312,
      image: 'course-software-basics.jpg',
      description: 'Learn to diagnose and fix common software issues in Windows and Mac operating systems',
      syllabus: [
        'Week 1: Operating System Basics',
        'Week 2: Common Software Problems',
        'Week 3: System Optimization'
      ],
      prerequisites: 'None',
      certificate: true,
      modules: []
    },
    {
      id: 5,
      title: 'Tech Business & Customer Service',
      instructor: 'Akua Owusu',
      category: 'Business Skills',
      level: 'Beginner',
      duration: '2 weeks',
      price: 350,
      rating: 4.5,
      students: 198,
      image: 'course-business-skills.jpg',
      description: 'Essential skills for running a successful tech repair business including customer management and pricing strategies',
      syllabus: [
        'Week 1: Starting Your Repair Business',
        'Week 2: Customer Service Excellence'
      ],
      prerequisites: 'None',
      certificate: true,
      modules: []
    }
  ])

  const loading = ref(false)
  const error = ref(null)

  const getCourseById = (id) => {
    return courses.value.find(c => c.id === parseInt(id))
  }

  const getCoursesByCategory = (category) => {
    if (category === 'All') return courses.value
    return courses.value.filter(c => c.category === category)
  }

  // optional: derived list for featured courses
  const featuredCourses = computed(() => courses.value.slice(0, 3))

  // fetch courses from backend (if you have an API)
  const fetchCourses = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get('/api/courses')
      courses.value = res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch courses'
    } finally {
      loading.value = false
    }
  }

  // create a new course from the admin form
  const createCourse = async (payload) => {
    // payload can be simple: { title, price, level, duration, category, description, thumbnailUrl, modules }
    loading.value = true
    error.value = null
    try {
      const res = await axios.post('/api/courses', payload)
      // push new course into state so UI updates immediately
      courses.value.unshift(res.data)
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create course'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    loading,
    error,
    featuredCourses,
    getCourseById,
    getCoursesByCategory,
    fetchCourses,
    createCourse
  }
})
