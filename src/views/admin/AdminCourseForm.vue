<template>
  <div class="page">
    <header class="page-header">
      <h2>{{ isEdit ? 'Edit Course' : 'Create Course' }}</h2>
    </header>

    <form class="form" @submit.prevent="handleSubmit">
      <div class="field">
        <label>Title</label>
        <input v-model="form.title" type="text" required />
      </div>

      <div class="field">
        <label>Slug</label>
        <input v-model="form.slug" type="text" placeholder="basic-phone-repair" />
      </div>

      <div class="field">
        <label>Price (GHS)</label>
        <input v-model.number="form.price" type="number" min="0" step="0.01" />
      </div>

      <div class="field">
        <label>Short Description (summary)</label>
        <textarea v-model="form.summary" rows="2" />
      </div>

      <div class="field">
        <label>Full Course Description</label>
        <textarea
          v-model="form.description"
          rows="4"
          placeholder="Detailed description of what this course covers..."
          required
        />
      </div>

      <div class="field">
        <label>Course syllabus (one item per line)</label>
        <textarea
          v-model="form.syllabus"
          rows="4"
          placeholder="Week 1: Introduction to phone components
Week 2: Screen replacement techniques
Week 3: Battery and charging port repair"
        />
      </div>

      <div class="field">
        <label>Duration</label>
        <input v-model="form.duration" type="text" placeholder="4 weeks" />
      </div>

      <div class="field">
        <label>Category</label>
        <input v-model="form.category" type="text" placeholder="Phone Repair" />
      </div>

      <div class="field">
        <label>Course image URL</label>
        <input
          v-model="form.image"
          type="text"
          placeholder="https://... or course-phone-basic.jpg"
        />
      </div>

      <div class="field">
        <label>Level</label>
        <select v-model="form.level">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div class="field inline">
        <label>
          <input v-model="form.isPublished" type="checkbox" />
          <span>Published</span>
        </label>
      </div>

      <div class="field">
        <label>Modules (one per line)</label>
        <textarea
          v-model="modulesInput"
          rows="4"
          placeholder="Intro to tools
Board-level basics
Hands-on screen replacements"
        />
      </div>

      <div class="actions">
        <button type="submit" class="btn primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course' }}
        </button>
        <RouterLink class="btn ghost" :to="{ name: 'AdminCourses' }">Cancel</RouterLink>
      </div>

      <ul v-if="validationErrors.length" class="error-list">
        <li v-for="(err, idx) in validationErrors" :key="idx">{{ err }}</li>
      </ul>
      <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const baseURL = import.meta.env.VITE_API_BASE_URL

const form = ref({
  title: '',
  slug: '',
  price: 0,
  summary: '',
  description: '',
  syllabus: '',
  level: 'beginner',
  duration: '',
  category: '',
  image: '',
  isPublished: false,
  modules: []
})

const modulesInput = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const validationErrors = ref([])
const isSubmitting = ref(false)

const isEdit = computed(() => !!route.params.id)

onMounted(async () => {
  if (!isEdit.value) return

  try {
    const token = localStorage.getItem('token')
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {}

    const { data } = await axios.get(
      `${baseURL}/api/courses/${route.params.id}`,
      config
    )

    const c = data.course || data

    form.value = {
      title: c.title ?? '',
      slug: c.slug ?? '',
      price: c.price ?? 0,
      summary: c.summary ?? '',
      description: c.description ?? '',
      syllabus: c.syllabus ?? '',
      level: c.level || 'beginner',
      duration: c.duration || '',
      category: c.category || '',
      image: c.image || '',
      isPublished: c.isPublished ?? false,
      modules: c.modules || []
    }
    modulesInput.value = (c.modules || []).join('\n')
  } catch (err) {
    console.error('Failed to load course', err)
    errorMessage.value = 'Failed to load course data.'
  }
})

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  validationErrors.value = []
  isSubmitting.value = true

  form.value.modules = modulesInput.value
    .split('\n')
    .map(m => m.trim())
    .filter(Boolean)

  try {
    const token = localStorage.getItem('token')
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {}

    if (isEdit.value) {
      await axios.put(
        `${baseURL}/api/courses/admin/${route.params.id}`,
        form.value,
        config
      )
      successMessage.value = 'Course updated successfully.'
    } else {
      await axios.post(
        `${baseURL}/api/courses/admin`,
        form.value,
        config
      )
      successMessage.value = 'Course created successfully.'
    }

    router.push({ name: 'AdminCourses' })
  } catch (err) {
    console.error('Course save failed', err)
    const data = err.response?.data

    if (data && Array.isArray(data.errors)) {
      validationErrors.value = data.errors.map(e => e.msg || String(e))
    } else if (data && data.message) {
      errorMessage.value = data.message
    } else {
      errorMessage.value = 'Failed to save course.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form{max-width:600px;}
.field{margin-bottom:0.9rem;display:flex;flex-direction:column;gap:0.3rem;}
.field label{font-size:0.85rem;color:#e5e7eb;}
.field input,.field textarea,.field select{
  background:#020617;border-radius:0.5rem;border:1px solid #1f2937;
  padding:0.55rem 0.6rem;color:#e5e7eb;font-size:0.85rem;
}
.field input:focus,.field textarea:focus,.field select:focus{outline:none;border-color:#f97316;}
.field.inline label{display:inline-flex;align-items:center;gap:0.35rem;}
.actions{margin-top:1rem;display:flex;gap:0.5rem;}
.btn{border-radius:0.5rem;padding:0.5rem 1rem;font-size:0.82rem;cursor:pointer;border:1px solid transparent;text-decoration:none;}
.primary{background:#f97316;color:#020617;border-color:#f97316;}
.ghost{background:transparent;color:#e5e7eb;border-color:#4b5563;}
.error{color:#fca5a5;font-size:0.8rem;margin-top:0.4rem;}
.success{color:#6ee7b7;font-size:0.8rem;margin-top:0.4rem;}
.error-list{margin-top:0.5rem;color:#fca5a5;font-size:0.8rem;padding-left:1.1rem;}
</style>
