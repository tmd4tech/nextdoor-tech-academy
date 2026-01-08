import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Public / student views
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
import OrderConfirmation from '../views/OrderConfirmation.vue'

// Admin views
import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminCourses from '../views/admin/AdminCourses.vue'
import AdminCourseForm from '../views/admin/AdminCourseForm.vue'
import AdminProducts from '../views/admin/AdminProducts.vue'
import AdminProductForm from '../views/admin/AdminProductForm.vue' // NEW
import AdminOrders from '../views/admin/AdminOrders.vue'
import AdminUsers from '../views/admin/AdminUsers.vue'
import AdminBlog from '../views/admin/AdminBlog.vue'
import AdminBlogForm from '../views/admin/AdminBlogForm.vue'
import AdminSettings from '../views/admin/AdminSettings.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },

  { path: '/shop', name: 'Shop', component: Shop },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },

  { path: '/courses', name: 'Courses', component: Courses },
  {
    path: '/courses/:id',
    name: 'CourseDetail',
    component: CourseDetail,
    props: true
  },

  // protected student routes
  {
    path: '/dashboard',
    name: 'StudentDashboard',
    component: StudentDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses/:id/lesson/:lessonId',
    name: 'LessonViewer',
    component: LessonViewer,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },
  {
    path: '/order-confirmation/:orderId',
    name: 'OrderConfirmation',
    component: OrderConfirmation,
    props: true,
    meta: { requiresAuth: true }
  },

  // blog
  { path: '/blog', name: 'Blog', component: Blog },
  { path: '/blog/:id', name: 'BlogPost', component: BlogPost, props: true },

  // contact
  { path: '/contact', name: 'Contact', component: Contact },

  // auth
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },

  // admin (all protected + admin-only)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'courses', name: 'AdminCourses', component: AdminCourses },
      { path: 'courses/new', name: 'AdminCourseCreate', component: AdminCourseForm },
      { path: 'courses/:id', name: 'AdminCourseEdit', component: AdminCourseForm },

      { path: 'products', name: 'AdminProducts', component: AdminProducts },
      { path: 'products/new', name: 'AdminProductCreate', component: AdminProductForm }, // NEW
      { path: 'products/:id', name: 'AdminProductEdit', component: AdminProductForm },   // NEW

      { path: 'orders', name: 'AdminOrders', component: AdminOrders },
      { path: 'users', name: 'AdminUsers', component: AdminUsers },
      { path: 'blog', name: 'AdminBlog', component: AdminBlog },
      { path: 'blog/new', name: 'AdminBlogCreate', component: AdminBlogForm },
      { path: 'blog/:id', name: 'AdminBlogEdit', component: AdminBlogForm },
      { path: 'settings', name: 'AdminSettings', component: AdminSettings }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// global auth + admin guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const isLoggedIn = authStore.isLoggedIn
  const user = authStore.user
  const adminEmails = ['temidayoakanmu12@gmail.com']

  const isAdmin =
    !!user &&
    adminEmails.includes(user.email) &&
    user.role === 'admin'

  if (to.meta.requiresAuth && !isLoggedIn) {
    authStore.returnUrl = to.fullPath
    return next({ name: 'Login' })
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: 'Home' })
  }

  if ((to.name === 'Login' || to.name === 'Register') && isLoggedIn) {
    return next({ name: 'Home' })
  }

  next()
})

export default router
