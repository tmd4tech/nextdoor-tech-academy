<template>
  <div class="admin-dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li
          v-for="tab in tabs"
          :key="tab.key"
          :class="{ active: activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          {{ tab.label }}
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <div v-if="loading" class="loading">Loading {{ activeTabLabel }}...</div>

      <component
        v-else
        :is="activeTabComponent"
        @refresh="refreshCurrentTab"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductManager from '../views/admin/ProductManager.vue'
import CourseManager from '../views/admin/CourseManager.vue'
import BlogManager from '../views/admin/BlogManager.vue'

const tabs = [
  { key: 'products', label: 'Products', component: ProductManager },
  { key: 'courses', label: 'Courses', component: CourseManager },
  { key: 'blog', label: 'Blog', component: BlogManager }
]

const activeTab = ref('products')
const loading = ref(false)

// Get active tab's component dynamically
const activeTabComponent = computed(() => {
  const tab = tabs.find(t => t.key === activeTab.value)
  return tab ? tab.component : null
})

const activeTabLabel = computed(() => {
  const tab = tabs.find(t => t.key === activeTab.value)
  return tab ? tab.label : ''
})

// Switch tab with loading indicator
const switchTab = (key) => {
  if (key === activeTab.value) return
  loading.value = true
  setTimeout(() => {
    activeTab.value = key
    loading.value = false
  }, 200) // small delay for smoother UX
}

// Refresh current tab if child emits @refresh
const refreshCurrentTab = () => {
  // For now, just reload component by switching off/on
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 200)
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background: #1f2937;
  color: white;
  padding: 2rem 1rem;
}

.sidebar h2 {
  margin-bottom: 2rem;
  font-size: 1.5rem;
  text-align: center;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 0.8rem 1rem;
  cursor: pointer;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  transition: background 0.3s;
}

.sidebar li.active,
.sidebar li:hover {
  background: #374151;
}

/* Content */
.content {
  flex: 1;
  padding: 2rem;
  background: #f3f4f6;
}

/* Loading */
.loading {
  font-size: 1.2rem;
  color: #1f2937;
  text-align: center;
  padding: 2rem;
}
</style>
