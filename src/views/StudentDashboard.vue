<template>
  <div class="student-dashboard">
    <div class="container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <div>
            <h1>Welcome, {{ authStore.user?.fullName || 'Student' }}! 👋</h1>
            <p>Manage your courses, orders, and profile</p>
          </div>
          <div class="header-stats">
            <div class="stat-card">
              <div class="stat-number">{{ studentStore.totalCoursesEnrolled }}</div>
              <div class="stat-label">Courses Enrolled</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ studentStore.completedCourses }}</div>
              <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ studentStore.totalOrders }}</div>
              <div class="stat-label">Orders</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">GHS {{ studentStore.totalSpent }}</div>
              <div class="stat-label">Total Spent</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading/Error States -->
      <div v-if="studentStore.loading" class="loading-message">Loading dashboard...</div>
      <div v-if="studentStore.error" class="error-message">{{ studentStore.error }}</div>

      <!-- Tabs -->
      <div class="dashboard-tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="tab-button"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tabIcons[tab] }} {{ tab }}
        </button>
      </div>

      <!-- My Courses Tab -->
      <div v-if="activeTab === 'My Courses'" class="tab-content">
        <h2>Your Enrolled Courses</h2>
        <div v-if="studentStore.enrolledCourses.length > 0" class="courses-grid">
          <div v-for="course in studentStore.enrolledCourses" :key="course._id" class="course-item">
            <div class="course-image-wrapper">
              <img :src="course.imageUrl || placeholderImage" :alt="course.title" />
              <span v-if="course.completed" class="completed-badge">✓ Completed</span>
            </div>
            <div class="course-info">
              <h3>{{ course.title }}</h3>
              <p class="category">{{ course.category }}</p>
              <p class="level">Level: {{ course.level }}</p>
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress" :style="{ width: course.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ course.progress }}% Complete</span>
              </div>
              <router-link :to="`/lesson-viewer/${course._id}`" class="btn btn-primary">
                {{ course.completed ? 'Review Course' : 'Continue Learning' }}
              </router-link>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">No courses enrolled yet. <router-link to="/courses">Explore courses</router-link></p>
      </div>

      <!-- My Orders Tab -->
      <div v-if="activeTab === 'My Orders'" class="tab-content">
        <h2>Your Orders</h2>
        <div v-if="studentStore.orders.length > 0" class="orders-list">
          <div v-for="order in studentStore.orders" :key="order._id" class="order-item">
            <div class="order-header">
              <div class="order-number">
                <strong>Order #{{ order._id.slice(-6).toUpperCase() }}</strong>
                <span class="order-date">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div :class="['status-badge', `status-${order.status}`]">
                {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
              </div>
            </div>
            <div class="order-items">
              <div v-for="(item, idx) in order.items" :key="idx" class="order-line-item">
                <span>{{ item.name }} × {{ item.quantity }}</span>
                <span class="item-price">GHS {{ item.price }}</span>
              </div>
            </div>
            <div class="order-footer">
              <div class="total">
                <strong>Total: GHS {{ order.totalAmount }}</strong>
              </div>
              <button class="btn btn-outline" @click="viewOrder(order._id)">View Details</button>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">No orders yet. <router-link to="/shop">Start shopping</router-link></p>
      </div>

      <!-- Products Purchased Tab -->
      <div v-if="activeTab === 'Products'" class="tab-content">
        <h2>Your Purchased Products</h2>
        <div v-if="studentStore.purchasedProducts.length > 0" class="products-grid">
          <div v-for="product in studentStore.purchasedProducts" :key="product._id" class="product-card">
            <img :src="product.imageUrl || placeholderImage" :alt="product.name" />
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="brand">{{ product.brand }}</p>
              <p class="category">{{ product.category }}</p>
              <div class="product-footer">
                <span class="price">GHS {{ product.price }}</span>
                <button class="btn btn-small" @click="downloadInvoice(product._id)">
                  📄 Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">No products purchased yet. <router-link to="/shop">Browse products</router-link></p>
      </div>

      <!-- Profile Tab -->
      <div v-if="activeTab === 'Profile'" class="tab-content">
        <h2>Your Profile</h2>
        <div class="profile-container">
          <form @submit.prevent="saveProfile" class="profile-form">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="profileForm.fullName" type="text" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="profileForm.email" type="email" required />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input v-model="profileForm.phone" type="tel" />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
          <div v-if="profileSuccess" class="success-message">Profile updated successfully!</div>
        </div>
      </div>

      <!-- Certificates Tab -->
      <div v-if="activeTab === 'Certificates'" class="tab-content">
        <h2>Your Certificates</h2>
        <div v-if="studentStore.certificates.length > 0" class="certificates-list">
          <div v-for="cert in studentStore.certificates" :key="cert._id" class="certificate-item">
            <div class="cert-icon">🏆</div>
            <div class="cert-info">
              <h3>{{ cert.courseName }}</h3>
              <p>Completed on {{ formatDate(cert.issuedAt) }}</p>
            </div>
            <button class="btn btn-outline" @click="downloadCertificate(cert._id)">
              📥 Download
            </button>
          </div>
        </div>
        <p v-else class="empty-state">No certificates yet. Complete a course to earn one!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useStudentStore } from '../stores/studentStore';

const authStore = useAuthStore();
const studentStore = useStudentStore();

const activeTab = ref('My Courses');
const tabs = ['My Courses', 'My Orders', 'Products', 'Profile', 'Certificates'];
const tabIcons = {
  'My Courses': '📚',
  'My Orders': '📦',
  'Products': '🛍️',
  'Profile': '👤',
  'Certificates': '🏆'
};

const loading = ref(false);
const profileSuccess = ref(false);
const placeholderImage = 'https://via.placeholder.com/300x200?text=Course';

const profileForm = ref({
  fullName: authStore.user?.fullName || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || ''
});

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Save profile
const saveProfile = async () => {
  loading.value = true;
  profileSuccess.value = false;
  try {
    const success = await authStore.updateProfile({
      fullName: profileForm.value.fullName,
      email: profileForm.value.email,
      phone: profileForm.value.phone
    });
    if (success) {
      profileSuccess.value = true;
      setTimeout(() => { profileSuccess.value = false }, 3000);
    }
  } catch (err) {
    console.error('Profile update error:', err);
  } finally {
    loading.value = false;
  }
};

// View order
const viewOrder = async (orderId) => {
  const order = await studentStore.getOrder(orderId);
  if (order) {
    console.log('Order details:', order);
    alert(`Order #${order._id.slice(-6).toUpperCase()}\nStatus: ${order.status}\nTotal: GHS ${order.totalAmount}`);
  }
};

// Download certificate
const downloadCertificate = (certId) => {
  alert('Certificate download functionality coming soon!');
};

// Download invoice
const downloadInvoice = (productId) => {
  alert('Invoice download functionality coming soon!');
};

// Fetch data on mount
onMounted(async () => {
  await studentStore.fetchDashboard();
});

// Update profile form when user changes
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      profileForm.value = {
        fullName: newUser.fullName || '',
        email: newUser.email || '',
        phone: newUser.phone || ''
      };
    }
  }
);
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.student-dashboard {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
  background: #f9fafb;
}

/* Header */
.dashboard-header {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.header-content h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.header-content p {
  opacity: 0.9;
}

.header-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Messages */
.loading-message,
.error-message,
.success-message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}

.loading-message {
  background: #e3f2fd;
  color: #1565c0;
}

.error-message {
  background: #ffebee;
  color: #c62828;
}

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
}

/* Tabs */
.dashboard-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
  flex-wrap: wrap;
}

.tab-button {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.95rem;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  margin-bottom: -2px;
}

.tab-button.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.tab-button:hover {
  color: #007bff;
}

/* Tab Content */
.tab-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-content h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #1f2937;
}

.empty-state {
  text-align: center;
  color: #6b7280;
  padding: 2rem;
  font-size: 1rem;
}

.empty-state a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.empty-state a:hover {
  text-decoration: underline;
}

/* Courses Grid */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.course-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.course-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.course-image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f3f4f6;
}

.course-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.completed-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

.course-info {
  padding: 1.5rem;
}

.course-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.category,
.level {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0.25rem 0;
}

.progress-section {
  margin: 1rem 0;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: #6b7280;
}

/* Orders */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.order-number {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-date {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: normal;
}

.status-badge {
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

.status-paid {
  background: #d1fae5;
  color: #065f46;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-processing {
  background: #dbeafe;
  color: #0c4a6e;
}

.status-shipped {
  background: #e0e7ff;
  color: #3730a3;
}

.status-delivered {
  background: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.order-items {
  margin-bottom: 1rem;
}

.order-line-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.95rem;
  color: #4b5563;
}

.item-price {
  font-weight: 600;
  color: #007bff;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.total {
  font-size: 1rem;
  color: #1f2937;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.brand {
  font-size: 0.85rem;
  color: #007bff;
  font-weight: 600;
}

.category {
  font-size: 0.85rem;
  color: #6b7280;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.price {
  font-weight: 700;
  color: #007bff;
}

/* Profile */
.profile-container {
  max-width: 500px;
}

.profile-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* Certificates */
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
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(249, 115, 22, 0.05));
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
  color: #1f2937;
}

.cert-info p {
  color: #6b7280;
  font-size: 0.9rem;
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not([disabled]) {
  background: #0056b3;
  transform: translateY(-2px);
}

.btn-primary[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  border: 1px solid #e5e7eb;
  background: white;
  color: #1f2937;
}

.btn-outline:hover {
  background: #f3f4f6;
}

.btn-small {
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
}

/* Mobile */
@media (max-width: 768px) {
  .dashboard-tabs {
    overflow-x: auto;
  }

  .tab-button {
    white-space: nowrap;
  }

  .header-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .courses-grid,
  .products-grid {
    grid-template-columns: 1fr;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .certificate-item {
    flex-wrap: wrap;
  }
}
</style>
