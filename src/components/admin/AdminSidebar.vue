<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <h2 class="brand">Nextdoor Admin</h2>
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/admin" exact-active-class="active">Dashboard</RouterLink>
      <RouterLink to="/admin/courses" exact-active-class="active">Courses</RouterLink>
      <RouterLink to="/admin/products" exact-active-class="active">Products</RouterLink>
      <RouterLink to="/admin/orders" exact-active-class="active">Orders</RouterLink>
      <RouterLink to="/admin/users" exact-active-class="active">Users</RouterLink>
      <RouterLink to="/admin/blog" exact-active-class="active">Blog</RouterLink>
      <RouterLink to="/admin/settings" exact-active-class="active">Settings</RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.admin-sidebar {
  background: #020617;
  color: #e5e7eb;
  padding: 1.5rem 1.25rem;
  border-right: 1px solid #1e293b;
  min-height: 100vh;
}
.sidebar-header {
  margin-bottom: 1.5rem;
}
.brand {
  font-size: 1.2rem;
  font-weight: 700;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.sidebar-nav a {
  color: #9ca3af;
  text-decoration: none;
  padding: 0.55rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.92rem;
}
.sidebar-nav a:hover {
  background: #111827;
  color: #f97316;
}
.sidebar-nav a.active {
  background: #f97316;
  color: #030712;
}
</style>
