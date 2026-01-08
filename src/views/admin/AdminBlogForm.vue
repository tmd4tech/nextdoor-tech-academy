<template>
  <div class="page">
    <header class="page-header">
      <h2>{{ isEdit ? 'Edit Post' : 'Create Post' }}</h2>
    </header>

    <form class="form" @submit.prevent="handleSubmit">
      <div class="field">
        <label>Title</label>
        <input v-model="form.title" type="text" required />
      </div>

      <div class="field">
        <label>Slug</label>
        <input v-model="form.slug" type="text" placeholder="how-to-fix-phone-screen" />
      </div>

      <div class="field">
        <label>Excerpt</label>
        <textarea v-model="form.excerpt" rows="3" />
      </div>

      <div class="field">
        <label>Content (Markdown or HTML)</label>
        <textarea v-model="form.content" rows="10" />
      </div>

      <div class="field inline">
        <label>
          <input v-model="form.published" type="checkbox" />
          <span>Published</span>
        </label>
      </div>

      <div class="actions">
        <button type="submit" class="btn primary">
          {{ isEdit ? 'Update Post' : 'Create Post' }}
        </button>
        <RouterLink class="btn ghost" :to="{ name: 'AdminBlog' }">
          Cancel
        </RouterLink>
      </div>
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
  excerpt: '',
  content: '',
  published: false
})

const isEdit = computed(() => !!route.params.id)

onMounted(async () => {
  if (!isEdit.value) return
  const res = await axios.get(`${baseURL}/api/admin/blog/${route.params.id}`)
  form.value = {
    title: res.data.title,
    slug: res.data.slug,
    excerpt: res.data.excerpt,
    content: res.data.content,
    published: res.data.published
  }
})

const handleSubmit = async () => {
  if (isEdit.value) {
    await axios.put(`${baseURL}/api/admin/blog/${route.params.id}`, form.value)
  } else {
    await axios.post(`${baseURL}/api/admin/blog`, form.value)
  }
  router.push({ name: 'AdminBlog' })
}
</script>

<style scoped>
.form { max-width: 700px; }
.field { margin-bottom: 0.9rem; display:flex; flex-direction:column; gap:0.3rem; }
.field label { font-size:0.85rem; color:#e5e7eb; }
.field input, .field textarea {
  background:#020617; border-radius:0.5rem; border:1px solid #1f2937;
  padding:0.55rem 0.6rem; color:#e5e7eb; font-size:0.85rem;
}
.field input:focus, .field textarea:focus { outline:none; border-color:#f97316; }
.field.inline label { display:inline-flex; align-items:center; gap:0.35rem; }
.actions { margin-top:1rem; display:flex; gap:0.5rem; }
.btn { border-radius:0.5rem; padding:0.5rem 1rem; font-size:0.82rem; cursor:pointer; border:1px solid transparent; text-decoration:none; }
.primary { background:#f97316; color:#020617; border-color:#f97316; }
.ghost { background:transparent; color:#e5e7eb; border-color:#4b5563; }
</style>
