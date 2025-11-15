<template>
  <div class="course-manager">
    <h2>Course Manager</h2>

    <!-- Loading Indicator -->
    <p v-if="loading">Loading courses...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Add/Edit Course Form -->
    <form class="course-form" @submit.prevent="handleSubmit">
      <input v-model="form.title" type="text" placeholder="Course Name" required />
      <input v-model="form.category" type="text" placeholder="Category" required />
      <input v-model="form.instructor" type="text" placeholder="Instructor Name" />
      <input v-model="form.duration" type="text" placeholder="Duration (e.g., 4 weeks)" />
      <select v-model="form.level" required>
        <option disabled value="">Select Level</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
      <input v-model.number="form.price" type="number" placeholder="Price (GHS)" required />
      <textarea v-model="form.description" placeholder="Description" required></textarea>

      <label>
        Course Image:
        <input type="file" accept="image/*" @change="handleImageUpload" />
      </label>
      <img v-if="form.imageUrl" :src="form.imageUrl" alt="Course" style="max-width: 300px; margin: 10px 0;" />

      <label>
        Video URL (optional):
        <input v-model="form.videoUrl" type="text" placeholder="https://example.com/video.mp4" />
      </label>
       <label>
  Upload PDF:
  <input type="file" accept="application/pdf" @change="handlePdfUpload" />
</label>

<label>
  Upload Quiz (ZIP or JSON):
  <input type="file" accept=".zip,.json" @change="handleQuizUpload" />
</label>

      <button type="submit" class="btn btn-primary">
        {{ form._id ? 'Update Course' : 'Add Course' }}
      </button>
      <button v-if="form._id" type="button" class="btn btn-secondary" @click="resetForm">
        Cancel
      </button>
    </form>

    <!-- Courses List -->
    <div class="courses-list" v-if="courses.length">
      <h3>All Courses</h3>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Level</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course._id">
            <td>
              <img v-if="course.imageUrl" :src="course.imageUrl" alt="Course" style="max-width: 80px; height: auto;" />
              <span v-else>No image</span>
            </td>
            <td>{{ course.title }}</td>
            <td>{{ course.category }}</td>
            <td>{{ course.level }}</td>
            <td>GHS {{ course.price }}</td>
            <td>
              <button @click="editCourse(course)">Edit</button>
              <button @click="deleteCourse(course._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
   
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCourseStore } from '../../stores/courseStore'
import CourseCard from '../../components/CourseCard.vue'
import axios from 'axios'

const courseStore = useCourseStore()

// Use the course store reactive state directly
const courses = courseStore.courses
const loading = courseStore.loading
const storeError = courseStore.error

// Local error state for form operations
const error = ref('')

const form = ref({
  _id: '',
  title: '',
  category: '',
  instructor: '',
  duration: '',
  level: '',
  price: 0,
  description: '',
  image: null,
  imageUrl: '',
  videoUrl: ''
})

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.image = file
    form.value.imageUrl = URL.createObjectURL(file)
  }
}

const fetchCourses = async () => {
  try {
    await courseStore.fetchCourses()
  } catch (err) {
    console.error('Error fetching courses:', err)
  }
}

const handleSubmit = async () => {
  error.value = ''

  const fd = new FormData()

  // Add text fields
  fd.append('title', form.value.title)
  fd.append('category', form.value.category)
  fd.append('instructor', form.value.instructor)
  fd.append('duration', form.value.duration)
  fd.append('level', form.value.level)
  fd.append('price', form.value.price)
  fd.append('description', form.value.description)
  fd.append('videoUrl', form.value.videoUrl)

  // Add files
  if (form.value.image) fd.append('image', form.value.image)
  if (form.value.pdf) fd.append('pdf', form.value.pdf)
  if (form.value.quiz) fd.append('quiz', form.value.quiz)

  try {
    if (form.value._id) {
      await axios.put(`http://localhost:5000/api/courses/${form.value._id}`, fd)
    } else {
      await axios.post(`http://localhost:5000/api/courses`, fd)
    }

    resetForm()
    fetchCourses()

  } catch (err) {
    error.value = err.message || 'Failed to save course.'
  }
}


const resetForm = () => {
  form.value = {
    _id: '',
    title: '',
    category: '',
    instructor: '',
    duration: '',
    level: '',
    price: 0,
    description: '',
    image: null,
    imageUrl: '',
    videoUrl: '',
      pdf: null,
  pdfUrl: '',
  quiz: null,
  quizUrl: ''
  }
}

const editCourse = (course) => {
  form.value = { ...course, image: null }
}

const deleteCourse = async (id) => {
  if (confirm('Are you sure you want to delete this course?')) {
    try {
      await courseStore.deleteCourse(id)
    } catch (err) {
      error.value = err.message || 'Failed to delete course.'
    }
  }
}
const handlePdfUpload = (e) => {
  const file = e.target.files[0]
  if (file) form.value.pdf = file
}

const handleQuizUpload = (e) => {
  const file = e.target.files[0]
  if (file) form.value.quiz = file
}


onMounted(fetchCourses)
</script>

<style scoped>
.course-manager {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
}

.course-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.course-form input,
.course-form select,
.course-form textarea {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  width: 100%;
}

.course-form button {
  width: fit-content;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.courses-list table {
  width: 100%;
  border-collapse: collapse;
}

.courses-list th,
.courses-list td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.courses-list th {
  background: #f3f4f6;
}

.courses-list button {
  margin-right: 0.5rem;
  cursor: pointer;
}
</style>
