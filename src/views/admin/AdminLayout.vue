<template>
  <div class="admin-layout">
    <AdminSidebar />

    <main class="admin-main">
      <header class="admin-header">
        <h1>{{ pageTitle }}</h1>
        <div class="admin-header-right">
          <span class="role-pill">Admin</span>
          <button class="logout-btn" @click="logout">Logout</button>
        </div>
      </header>

      <section class="admin-content">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  const name = route.name || ''
  if (name === 'AdminDashboard') return 'Dashboard'
  if (name?.toString().startsWith('AdminCourse')) return 'Courses'
  if (name === 'AdminProducts') return 'Products'
  if (name === 'AdminOrders') return 'Orders'
  if (name === 'AdminUsers') return 'Users'
  if (name?.toString().startsWith('AdminBlog')) return 'Blog'
  if (name === 'AdminSettings') return 'Settings'
  return 'Admin'
})

const logout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;
  background: #020617;
}
.admin-main {
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
}
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  background: rgba(2, 6, 23, 0.9);
  backdrop-filter: blur(10px);
  z-index: 10;
}
.admin-header h1 {
  font-size: 1.1rem;
  margin: 0;
}
.admin-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.role-pill {
  background: #022c22;
  color: #6ee7b7;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
}
.logout-btn {
  background: transparent;
  border: 1px solid #f97316;
  color: #f97316;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  cursor: pointer;
}
.logout-btn:hover {
  background: #f97316;
  color: #020617;
}
.admin-content {
  padding: 1.5rem;
}
@media (max-width: 900px) {
  .admin-layout {
    grid-template-columns: 220px minmax(0, 1fr);
  }
}
</style>
