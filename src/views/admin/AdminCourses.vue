<template>
  <div class="page">
    <header class="page-header">
      <h2>Courses</h2>
      <RouterLink class="btn" :to="{ name: 'AdminCourseCreate' }">
        + New Course
      </RouterLink>
    </header>

    <table v-if="courses.length" class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Enrollments</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course.id">
          <td>{{ course.title }}</td>
          <td>₵{{ course.price }}</td>
          <td>{{ course.enrollmentCount }}</td>
          <td>{{ course.isPublished ? 'Published' : 'Draft' }}</td>
          <td class="actions">
            <RouterLink
              class="link"
              :to="{ name: 'AdminCourseEdit', params: { id: course.id } }"
            >
              Edit
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">
      No courses yet. Create your first course.
    </p>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { RouterLink } from 'vue-router'

const baseURL = import.meta.env.VITE_API_BASE_URL
const courses = ref([])
const errorMessage = ref('')

const loadCourses = async () => {
  try {
    const token = localStorage.getItem('token')
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {}

    // Admin list: GET /api/courses/admin -> plain array
    const res = await axios.get(`${baseURL}/api/courses/admin`, config)

    courses.value = (res.data || []).map(c => ({
      id: c.id,
      title: c.title,
      price: Number(c.price) || 0,
      enrollmentCount: c.enrollmentCount ?? 0,
      isPublished: c.isPublished ?? false
    }))
  } catch (err) {
    console.error('Failed to load courses list', err)
    errorMessage.value = 'Failed to load courses.'
  }
}

onMounted(loadCourses)
</script>

<style scoped>
.page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;}
.page-header h2{margin:0;font-size:1rem;}
.btn{background:#f97316;color:#020617;padding:0.45rem 0.9rem;border-radius:0.5rem;font-size:0.8rem;text-decoration:none;font-weight:600;}
.table{width:100%;border-collapse:collapse;font-size:0.8rem;}
.table th,.table td{padding:0.5rem 0.35rem;border-bottom:1px solid #111827;}
.table th{text-align:left;color:#9ca3af;font-weight:500;}
.actions{display:flex;gap:0.4rem;}
.link{color:#f97316;text-decoration:none;font-size:0.8rem;}
.link:hover{text-decoration:underline;}
.empty{font-size:0.8rem;color:#6b7280;}
.error{margin-top:0.5rem;color:#fca5a5;font-size:0.8rem;}
</style>
