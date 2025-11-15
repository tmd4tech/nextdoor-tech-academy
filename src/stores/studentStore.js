import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_BASE = (import.meta.env.VITE_API_URL || 'VITE_API_URL=https://next-door-backend.onrender.com') + '/api';

export const useStudentStore = defineStore('student', () => {
  const enrolledCourses = ref([]);
  const purchasedProducts = ref([]);
  const orders = ref([]);
  const certificates = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Computed properties for stats
  const totalCoursesEnrolled = computed(() => enrolledCourses.value.length);
  const completedCourses = computed(() => enrolledCourses.value.filter(c => c.completed).length);
  const totalOrders = computed(() => orders.value.length);
  const totalSpent = computed(() => 
    orders.value
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0)
  );

  // Fetch dashboard data
  const fetchDashboard = async () => {
    const authStore = useAuthStore();
    if (!authStore.token) return;

    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get(`${API_BASE}/student/dashboard`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      enrolledCourses.value = data.enrolledCourses || [];
      purchasedProducts.value = data.purchasedProducts || [];
      orders.value = data.orders || [];
      certificates.value = data.certificates || [];
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      console.error('Dashboard fetch error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Enroll in a course
  const enrollCourse = async (courseId) => {
    const authStore = useAuthStore();
    if (!authStore.token) throw new Error('Not authenticated');

    loading.value = true;
    error.value = null;
    try {
      await axios.post(`${API_BASE}/student/enroll/${courseId}`, {}, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      // Refresh dashboard
      await fetchDashboard();
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      console.error('Enrollment error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Update course progress
  const updateCourseProgress = async (courseId, progress, completed = false) => {
    const authStore = useAuthStore();
    if (!authStore.token) throw new Error('Not authenticated');

    try {
      const { data } = await axios.put(
        `${API_BASE}/student/course/${courseId}/progress`,
        { progress, completed },
        { headers: { Authorization: `Bearer ${authStore.token}` } }
      );
      
      // Update local state
      const course = enrolledCourses.value.find(c => c._id === courseId);
      if (course) {
        course.progress = data.enrollment.progress;
        course.completed = data.enrollment.completed;
      }
      
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      console.error('Progress update error:', err);
      return false;
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    const authStore = useAuthStore();
    if (!authStore.token) return;

    loading.value = true;
    try {
      const { data } = await axios.get(`${API_BASE}/student/orders`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      orders.value = data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  // Get single order
  const getOrder = async (orderId) => {
    const authStore = useAuthStore();
    if (!authStore.token) throw new Error('Not authenticated');

    try {
      const { data } = await axios.get(`${API_BASE}/student/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      console.error('Order fetch error:', err);
      return null;
    }
  };

  return {
    enrolledCourses,
    purchasedProducts,
    orders,
    certificates,
    loading,
    error,
    totalCoursesEnrolled,
    completedCourses,
    totalOrders,
    totalSpent,
    fetchDashboard,
    enrollCourse,
    updateCourseProgress,
    fetchOrders,
    getOrder
  };
});
