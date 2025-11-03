<template>
  <div class="student-dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>Welcome, {{ authStore.user.fullName }}! 👋</h1>
        <p>Manage your courses, orders, and profile</p>
      </div>

      <div class="dashboard-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          class="tab-button"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <!-- My Courses Tab -->
      <div v-if="activeTab === 'My Courses'" class="tab-content">
        <h2>Your Enrolled Courses</h2>
        <div class="courses-grid">
          <div v-for="course in enrolledCourses" :key="course.id" class="course-item">
            <img :src="`https://via.placeholder.com/300x150?text=${course.title}`" :alt="course.title">
            <div class="course-info">
              <h3>{{ course.title }}</h3>
              <p class="instructor">{{ course.instructor }}</p>
              <div class="progress-bar">
                <div class="progress" style="width: 65%"></div>
              </div>
              <p class="progress-text">65% Complete</p>
              <router-link :to="`/course/${course.id}/lesson/1`" class="btn btn-primary">
                Continue Learning
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- My Orders Tab -->
      <div v-if="activeTab === 'My Orders'" class="tab-content">
        <h2>Your Orders</h2>
        <div class="orders-list">
          <div v-for="product in purchasedProducts" :key="product.id" class="order-item">
            <img :src="`https://via.placeholder.com/80x80?text=${product.name}`" :alt="product.name">
            <div class="order-info">
              <h3>{{ product.name }}</h3>
              <p>{{ product.brand }} - {{ product.category }}</p>
              <p class="price">GHS {{ product.price }}</p>
            </div>
            <div class="order-status">
              <span class="status-badge">✓ Delivered</span>
              <p class="order-date">Delivered on Oct 25, 2025</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Tab -->
      <div v-if="activeTab === 'Profile'" class="tab-content">
        <h2>Your Profile</h2>
        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-group">
            <label>Full Name</label>
            <input v-model="profileForm.fullName" type="text" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="profileForm.email" type="email" required>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input v-model="profileForm.phone" type="tel" required>
          </div>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
      </div>

      <!-- Certificates Tab -->
      <div v-if="activeTab === 'Certificates'" class="tab-content">
        <h2>Your Certificates</h2>
        <div class="certificates-list">
          <div class="certificate-item">
            <div class="cert-icon">🏆</div>
            <div class="cert-info">
              <h3>Basic Phone Repair Fundamentals</h3>
              <p>Completed on Oct 20, 2025</p>
            </div>
            <button class="btn btn-outline">Download Certificate</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useCourseStore } from '../stores/courseStore'
import { useProductStore } from '../stores/productStore'

const authStore = useAuthStore()
const courseStore = useCourseStore()
const productStore = useProductStore()

const activeTab = ref('My Courses')
const tabs = ['My Courses', 'My Orders', 'Profile', 'Certificates']

const profileForm = ref({
  fullName: authStore.user.fullName,
  email: authStore.user.email,
  phone: authStore.user.phone
})

const enrolledCourses = computed(() => {
  return authStore.user.enrolledCourses.map(id => courseStore.getCourseById(id)).filter(c => c)
})

const purchasedProducts = computed(() => {
  return authStore.user.purchasedProducts.map(id => productStore.getProductById(id)).filter(p => p)
})

const saveProfile = () => {
  authStore.updateProfile({
    fullName: profileForm.value.fullName,
    email: profileForm.value.email,
    phone: profileForm.value.phone
  })
  alert('Profile updated successfully!')
}
</script>

<style scoped>
.student-dashboard {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.dashboard-header {
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--dark-color));
  color: white;
  padding: 2rem;
  border-radius: 0.75rem;
}

.dashboard-header h1 {
  color: white;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: rgba(255, 255, 255, 0.9);
}

.dashboard-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
  flex-wrap: wrap;
}

.tab-button {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  margin-bottom: -2px;
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-button:hover {
  color: var(--primary-color);
}

.tab-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.75rem;
}

.tab-content h2 {
  margin-bottom: 1.5rem;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.course-item {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.course-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.course-info {
  padding: 1.5rem;
}

.course-info h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.instructor {
  color: var(--primary-color);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: grid;
  grid-template-columns: 80px 1fr 150px;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
}

.order-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.order-info h3 {
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.order-info p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0.25rem 0;
}

.price {
  color: var(--primary-color);
  font-weight: 700 !important;
}

.order-status {
  text-align: right;
}

.status-badge {
  display: inline-block;
  background-color: #d1fae5;
  color: #065f46;
  padding: 0.35rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.order-date {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.profile-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}

.certificates-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.certificate-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  background-color: linear-gradient(135deg, rgba(20, 184, 166, 0.05), rgba(31, 41, 55, 0.05));
}

.cert-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.cert-info {
  flex: 1;
}

.cert-info h3 {
  margin-bottom: 0.25rem;
}

.cert-info p {
  color: #6b7280;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .order-item {
    grid-template-columns: 60px 1fr;
  }

  .order-status {
    grid-column: 1 / -1;
    text-align: left;
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-tabs {
    overflow-x: auto;
  }
}
</style>