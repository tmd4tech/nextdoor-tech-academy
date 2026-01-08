<template>
  <div class="page">
    <header class="page-header">
      <h2>Blog Posts</h2>
      <RouterLink class="btn" :to="{ name: 'AdminBlogCreate' }">
        + New Post
      </RouterLink>
    </header>

    <table v-if="posts.length" class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Slug</th>
          <th>Published</th>
          <th>Updated</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post._id">
          <td>{{ post.title }}</td>
          <td>{{ post.slug }}</td>
          <td>{{ post.published ? 'Yes' : 'No' }}</td>
          <td>{{ formatDate(post.updatedAt) }}</td>
          <td class="actions">
            <RouterLink
              class="link"
              :to="{ name: 'AdminBlogEdit', params: { id: post._id } }"
            >
              Edit
            </RouterLink>
            <button class="link danger" @click="remove(post._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">No blog posts yet. Create your first article.</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
const posts = ref([])

const loadPosts = async () => {
  const res = await axios.get(`${baseURL}/api/admin/blog`)
  posts.value = res.data
}

onMounted(loadPosts)

const remove = async (id) => {
  if (!confirm('Delete this post?')) return
  await axios.delete(`${baseURL}/api/admin/blog/${id}`)
  posts.value = posts.value.filter(p => p._id !== id)
}

const formatDate = (val) =>
  val ? new Date(val).toLocaleDateString() : ''
</script>

<style scoped>
.page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }
.btn { background:#f97316; color:#020617; padding:0.45rem 0.9rem; border-radius:0.5rem; font-size:0.8rem; text-decoration:none; font-weight:600; }
.table { width:100%; border-collapse:collapse; font-size:0.8rem; }
.table th, .table td { padding:0.5rem 0.35rem; border-bottom:1px solid #111827; }
.table th { text-align:left; color:#9ca3af; font-weight:500; }
.actions { display:flex; gap:0.4rem; }
.link { background:none; border:none; color:#f97316; text-decoration:none; font-size:0.8rem; cursor:pointer; padding:0; }
.link:hover { text-decoration:underline; }
.danger { color:#fca5a5; }
.empty { font-size:0.8rem; color:#6b7280; }
</style>
