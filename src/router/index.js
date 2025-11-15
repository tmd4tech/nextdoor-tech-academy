import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Views
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Courses from '../views/Courses.vue'
import CourseDetail from '../views/CourseDetail.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import LessonViewer from '../views/LessonViewer.vue'
import Blog from '../views/Blog.vue'
import BlogPost from '../views/BlogPost.vue'
import Contact from '../views/Contact.vue'
import Checkout from '../views/Checkout.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import OrderConfirmation from '../views/OrderConfirmation.vue'
import AdminDashboard from "../views/AdminDashboard.vue";

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/shop', component: Shop, name: 'Shop' },
  { path: '/product/:id', component: ProductDetail, name: 'ProductDetail' },
  { path: '/courses', component: Courses, name: 'Courses' },
  { path: '/course/:id', component: CourseDetail, name: 'CourseDetail' },
  { path: '/dashboard', component: StudentDashboard, name: 'StudentDashboard', meta: { requiresAuth: true } },
  { path: '/course/:id/lesson/:lessonId', component: LessonViewer, name: 'LessonViewer', meta: { requiresAuth: true } },
  { path: '/blog', component: Blog, name: 'Blog' },
  { path: '/blog/:id', component: BlogPost, name: 'BlogPost' },
  { path: '/contact', component: Contact, name: 'Contact' },
  { path: '/checkout', component: Checkout, name: 'Checkout', meta: { requiresAuth: true } },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/order-confirmation', component: OrderConfirmation, name: 'OrderConfirmation', meta: { requiresAuth: true } },
  { path: '/forgot-password', component: ForgotPassword, name: 'ForgotPassword' },
  { path: '/reset-password/:token', component: () => import('../views/ResetPassword.vue'), name: 'ResetPassword' },
  { path: '/social-callback', component: () => import('../views/SocialCallback.vue'), name: 'SocialCallback' },
  {
  path: "/admin",
  name: "AdminDashboard",
  component: AdminDashboard,
  meta: { requiresAuth: true, adminOnly: true },
},
/* {
  path: '/checkout',
  name: 'Checkout',
  component: () => import('../views/CheckoutPage.vue')
}, */
{
  path: '/success',
  name: 'Success',
  component: () => import('../views/SuccessPage.vue')
}

];

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Unified Route Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const user = authStore.user;

  // Protect routes that require authentication
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  // Protect admin-only routes
  if (to.meta.adminOnly && !user?.isAdmin) {
    return next({ name: 'Home' });
  }

  next();
});

export default router;
