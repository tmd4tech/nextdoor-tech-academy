<template>
  <div class="dashboard">
    <div class="cards-grid">
      <div class="stat-card">
        <h3>Total Revenue (30d)</h3>
        <p class="value">₵{{ stats.totalRevenue.toLocaleString() }}</p>
      </div>
      <div class="stat-card">
        <h3>Active Students</h3>
        <p class="value">{{ stats.activeStudents }}</p>
      </div>
      <div class="stat-card">
        <h3>Orders Today</h3>
        <p class="value">{{ stats.ordersToday }}</p>
      </div>
      <div class="stat-card">
        <h3>Courses Published</h3>
        <p class="value">{{ stats.courses }}</p>
      </div>
    </div>

    <div class="grid-2">
      <section class="panel">
        <header><h3>Recent Orders</h3></header>
        <table v-if="recentOrders.length" class="table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.customer }}</td>
              <td>₵{{ order.total }}</td>
              <td>
                <span class="badge" :data-status="order.status">
                  {{ order.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="empty">No orders yet.</p>
      </section>

      <section class="panel">
        <header><h3>Top Courses</h3></header>
        <ul class="list">
          <li v-for="course in topCourses" :key="course.id">
            <div>
              <strong>{{ course.title }}</strong>
              <p>{{ course.enrollments }} students • ₵{{ course.price }}</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const stats = ref({
  totalRevenue: 0,
  activeStudents: 0,
  ordersToday: 0,
  courses: 0
})
const recentOrders = ref([])
const topCourses = ref([])
const baseURL = import.meta.env.VITE_API_BASE_URL

onMounted(async () => {
  try {
    const [s, o, c] = await Promise.all([
      axios.get(`${baseURL}/api/admin/stats`),
      axios.get(`${baseURL}/api/admin/orders?limit=5`),
      axios.get(`${baseURL}/api/admin/top-courses?limit=5`)
    ])
    stats.value = s.data
    recentOrders.value = o.data
    topCourses.value = c.data
  } catch (err) {
    console.error('Failed to load dashboard', err)
  }
})
</script>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.stat-card {
  background: #020617;
  border-radius: 0.9rem;
  padding: 1rem;
  border: 1px solid #111827;
}
.stat-card h3 {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 0.4rem;
}
.value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f97316;
}
.grid-2 {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 1.2rem;
}
.panel {
  background: #020617;
  border-radius: 0.9rem;
  padding: 1rem;
  border: 1px solid #111827;
}
.panel header h3 {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}
.table th,
.table td {
  padding: 0.45rem 0.35rem;
  border-bottom: 1px solid #111827;
}
.table th {
  text-align: left;
  color: #9ca3af;
  font-weight: 500;
}
.badge {
  padding: 0.18rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  text-transform: capitalize;
}
.badge[data-status='paid'] {
  background: #022c22;
  color: #6ee7b7;
}
.badge[data-status='pending'] {
  background: #1e293b;
  color: #eab308;
}
.badge[data-status='cancelled'] {
  background: #450a0a;
  color: #fecaca;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.list li {
  padding: 0.55rem 0;
  border-bottom: 1px solid #111827;
}
.list li:last-child {
  border-bottom: none;
}
.list p {
  margin: 0.15rem 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
}
.empty {
  font-size: 0.8rem;
  color: #6b7280;
}
@media (max-width: 900px) {
  .grid-2 {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
