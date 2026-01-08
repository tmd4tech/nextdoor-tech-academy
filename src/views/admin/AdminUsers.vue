<template>
  <div class="page">
    <header class="page-header">
      <h2>Users</h2>
    </header>

    <table v-if="users.length" class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Enrollments</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u._id">
          <td>{{ u.name }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.role }}</td>
          <td>{{ u.enrollmentCount }}</td>
          <td>{{ formatDate(u.createdAt) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">No users yet.</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
const users = ref([])

onMounted(async () => {
  const res = await axios.get(`${baseURL}/api/admin/users`)
  users.value = res.data
})

const formatDate = (v) => (v ? new Date(v).toLocaleDateString() : '')
</script>

<style scoped>
@import './table.css';
</style>
