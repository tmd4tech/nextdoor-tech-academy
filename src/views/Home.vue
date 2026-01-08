<template>
  <div class="home">
    <!-- 🌟 HERO SECTION -->
    <section class="hero">
      <!-- background slideshow layer -->
      <div class="hero-bg-layer"></div>

      <div class="hero-overlay"></div>

      <div class="hero-content container">
        <h1 class="fade-up">Nextdoor Tech Academy</h1>
        <p class="fade-up delay-1">
          Shop quality gadgets and learn hands‑on repair skills from industry experts.
        </p>
        <div class="hero-buttons fade-up delay-2">
          <router-link to="/shop" class="btn btn-primary">
            Shop Gadgets &amp; Parts
          </router-link>
          <router-link to="/courses" class="btn btn-outline">
            Learn Repairs
          </router-link>
        </div>
      </div>
    </section>

    <!-- 🛍️ FEATURED CATEGORIES -->
    <section class="featured-categories section">
      <div class="container">
        <h2>Shop by Category</h2>
        <p class="section-subtitle">Everything you need to repair and upgrade</p>
        <div class="category-grid">
          <div class="category-card" v-for="cat in categories" :key="cat">
            <div class="category-icon">📱</div>
            <h3>{{ cat }}</h3>
            <router-link :to="`/shop?category=${cat}`">
              Browse {{ cat }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 💎 FEATURED PRODUCTS -->
    <section class="featured-products section alt-bg">
      <div class="container">
        <h2>Popular Products</h2>
        <p class="section-subtitle">Top‑rated tools and components</p>
        <div class="grid grid-3">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- 🎓 FEATURED COURSES -->
    <section class="featured-courses section">
      <div class="container">
        <h2>Student‑Favorite Courses</h2>
        <p class="section-subtitle">
          Build real repair skills with practical modules
        </p>
        <div class="grid grid-3">
          <CourseCard
            v-for="course in featuredCourses"
            :key="course.id"
            :course="course"
          />
        </div>
      </div>
    </section>

    <!-- 💬 TESTIMONIALS -->
    <section class="testimonials-section section alt-bg">
      <div class="container">
        <h2>Learners &amp; Customers Love Us</h2>
        <p class="section-subtitle">
          Real stories from people using our tools and training
        </p>
        <div class="grid grid-3">
          <div
            class="testimonial-card"
            v-for="testimonial in testimonials"
            :key="testimonial.id"
          >
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">“{{ testimonial.text }}”</p>
            <p class="testimonial-author">
              — {{ testimonial.name }}, {{ testimonial.role }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 🚀 SLIM CALL TO ACTION ABOVE FOOTER -->
    <section class="cta-strip">
      <div class="container cta-strip-inner">
        <div class="cta-strip-text">
          <h3>Ready to start learning or earning?</h3>
          <p>Get tools that last and courses that pay off in the real world.</p>
        </div>
        <div class="cta-strip-actions">
          <router-link to="/shop" class="btn btn-light-pill">
            Start Shopping
          </router-link>
          <router-link to="/courses" class="btn btn-dark-pill">
            View Courses
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProductStore } from '../stores/productStore'
import { useCourseStore } from '../stores/courseStore'
import ProductCard from '../components/ProductCard.vue'
import CourseCard from '../components/CourseCard.vue'

const productStore = useProductStore()
const courseStore = useCourseStore()

onMounted(async () => {
  if (!productStore.products.length) {
    await productStore.fetchProducts()
  }
  if (!courseStore.courses.length && typeof courseStore.fetchCourses === 'function') {
    await courseStore.fetchCourses()
  }
})

const categories = ['Phones', 'Laptops', 'Accessories', 'Repair Tools']
const featuredProducts = computed(() => productStore.products.slice(0, 3))
const featuredCourses = computed(() => courseStore.courses.slice(0, 3))

const testimonials = [
  {
    id: 1,
    name: 'Samuel Ofori',
    role: 'Former Student',
    text: 'The phone repair course changed my life. I now run my own repair shop and the skills I learned here were invaluable.',
  },
  {
    id: 2,
    name: 'Grace Nkrumah',
    role: 'Shop Owner',
    text: 'Great quality products at competitive prices. The laptop I bought works perfectly and the customer service was excellent.',
  },
  {
    id: 3,
    name: 'Prince Amoah',
    role: 'Student',
    text: 'The repair masterclass exceeded my expectations. The instructors are knowledgeable and the hands-on training was perfect.',
  },
]
</script>

<style scoped>
:root {
  --nav-bg: #0f172a;
  --primary-orange: #f97316;
  --primary-orange-dark: #ea580c;
  --card-border: #e5e7eb;
  --text-main: #111827;
  --text-muted: #6b7280;
  --page-bg: #f3f4f6;
}

.home {
  background-color: var(--page-bg);
}

/* 🌅 HERO SECTION – blurred slideshow background */
.hero {
  position: relative;
  min-height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  overflow: hidden;
}

/* single div that animates between two background images and is blurred */
.hero-bg-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: hero-slideshow 14s ease-in-out infinite;
  filter: blur(3px);
  transform: scale(1.05);
}

/* keyframes swap between image 1 and 2 */
@keyframes hero-slideshow {
  0%,
  45% {
    background-image: url('../assets/hero-1.jpg');
  }
  55%,
  100% {
    background-image: url('../assets/hero-2.jpg');
  }
}

/* dark overlay on top of blurred slideshow */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
      circle at top center,
      rgba(15, 23, 42, 0.4),
      rgba(15, 23, 42, 0.95)
    );
  pointer-events: none;
}

/* hero content stays perfectly sharp */
.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  padding: 2rem 1rem;
}

.hero h1 {
  font-size: clamp(2.6rem, 5vw, 3.6rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: #f9fafb;
  text-shadow: 0 10px 30px rgba(15, 23, 42, 1);
}

.hero p {
  font-size: 1.15rem;
  color: #e5e7eb;
  margin-bottom: 2rem;
  text-shadow: 0 6px 20px rgba(15, 23, 42, 1);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* ✨ BUTTONS */
.btn {
  display: inline-block;
  padding: 0.75rem 1.7rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--primary-orange);
  color: #111827;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.9);
}

.btn-primary:hover {
  background-color: var(--primary-orange-dark);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  border: 1.5px solid #e5e7eb;
  color: #f9fafb;
}

.btn-outline:hover {
  background-color: #ffffff;
  color: #0f172a;
}

/* Sections */
.section {
  padding: 3.5rem 1rem;
}

.alt-bg {
  background-color: #ffffff;
}

.section h2 {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
}

.section-subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
}

/* Category cards */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.75rem;
}

.category-card {
  background-color: #ffffff;
  border-radius: 0.9rem;
  padding: 1.6rem 1.4rem;
  text-align: left;
  border: 1px solid var(--card-border);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
}

.category-icon {
  font-size: 2.2rem;
  margin-bottom: 0.75rem;
}

.category-card h3 {
  color: var(--text-main);
  margin-bottom: 0.3rem;
}

.category-card a {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--primary-orange);
  font-weight: 600;
  font-size: 0.9rem;
}

/* Testimonials */
.testimonial-card {
  background-color: #ffffff;
  border-radius: 0.9rem;
  padding: 1.5rem 1.4rem;
  border: 1px solid var(--card-border);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.stars {
  color: #f59e0b;
  margin-bottom: 0.6rem;
}

.testimonial-text {
  color: var(--text-main);
  margin-bottom: 0.7rem;
}

.testimonial-author {
  color: var(--text-muted);
  font-weight: 500;
}

/* CTA strip above footer */
.cta-strip {
  background-color: var(--primary-orange);
  padding: 1.8rem 1rem;
  color: #111827;
}

.cta-strip-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.cta-strip-text h3 {
  font-size: 1.3rem;
  margin-bottom: 0.2rem;
}

.cta-strip-text p {
  color: #111827;
  opacity: 0.9;
  font-size: 0.95rem;
}

.cta-strip-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn-light-pill {
  background-color: #ffffff;
  color: #111827;
}

.btn-light-pill:hover {
  background-color: #f9fafb;
}

.btn-dark-pill {
  background-color: #0f172a;
  color: #f9fafb;
}

.btn-dark-pill:hover {
  background-color: #020617;
}

/* Simple fade-up animation */
.fade-up {
  opacity: 0;
  transform: translateY(24px);
  animation: fadeUp 0.9s ease-out forwards;
}

.delay-1 {
  animation-delay: 0.2s;
}

.delay-2 {
  animation-delay: 0.4s;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .hero {
    min-height: 60vh;
    padding: 3.5rem 0;
  }

  .section {
    padding: 3rem 1rem;
  }

  .cta-strip-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .cta-strip-actions {
    justify-content: flex-start;
  }
}
</style>
