<template>
  <div class="home">
    <!-- 🌟 HERO SECTION -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1 class="fade-up">Nextdoor Tech Academy</h1>
        <p class="fade-up delay-1">
          Your one-stop destination for tech products and professional repair training.
        </p>
        <div class="hero-buttons fade-up delay-2">
          <router-link to="/shop" class="btn btn-primary">Shop Now</router-link>
          <router-link to="/courses" class="btn btn-outline">Explore Courses</router-link>
        </div>
      </div>
    </section>

    <!-- 🛍️ FEATURED CATEGORIES -->
    <section class="featured-categories section">
      <div class="container">
        <h2>Featured Categories</h2>
        <p class="section-subtitle">Shop by what you love most</p>
        <div class="category-grid">
          <div class="category-card" v-for="cat in categories" :key="cat">
            <div class="category-icon">📱</div>
            <h3>{{ cat }}</h3>
            <router-link :to="`/shop?category=${cat}`">Shop {{ cat }}</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 💎 FEATURED PRODUCTS -->
    <section class="featured-products section alt-bg">
      <div class="container">
        <h2>Featured Products</h2>
        <p class="section-subtitle">Our best picks for you</p>
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
        <h2>Featured Courses</h2>
        <p class="section-subtitle">Learn practical repair skills from professionals</p>
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
        <h2>What Our Customers Say</h2>
        <p class="section-subtitle">Hear from our satisfied learners and customers</p>
        <div class="grid grid-3">
          <div
            class="testimonial-card"
            v-for="testimonial in testimonials"
            :key="testimonial.id"
          >
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">“{{ testimonial.text }}”</p>
            <p class="testimonial-author">— {{ testimonial.name }}, {{ testimonial.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 🚀 CALL TO ACTION -->
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Get Started?</h2>
        <p>
          Shop quality tech products or enroll in our expert training programs today.
        </p>
        <div class="cta-buttons">
          <router-link to="/shop" class="btn btn-primary">Start Shopping</router-link>
          <router-link to="/courses" class="btn btn-outline-light">View All Courses</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductStore } from '../stores/productStore'
import { useCourseStore } from '../stores/courseStore'
import ProductCard from '../components/ProductCard.vue'
import CourseCard from '../components/CourseCard.vue'

const productStore = useProductStore()
const courseStore = useCourseStore()

const categories = ['Phones', 'Laptops', 'Accessories', 'Repair Tools']
const featuredProducts = computed(() => productStore.products.slice(0, 3))
const featuredCourses = computed(() => courseStore.courses.slice(0, 3))

const testimonials = [
  {
    id: 1,
    name: 'Samuel Ofori',
    role: 'Former Student',
    text: 'The phone repair course changed my life! I now run my own repair shop and the skills I learned here were invaluable.'
  },
  {
    id: 2,
    name: 'Grace Nkrumah',
    role: 'Shop Owner',
    text: 'Great quality products at competitive prices. The laptop I bought works perfectly and the customer service was excellent.'
  },
  {
    id: 3,
    name: 'Prince Amoah',
    role: 'Student',
    text: 'The repair masterclass exceeded my expectations. The instructors are knowledgeable and the hands-on training was perfect.'
  }
]
</script>

<style scoped>
/* 🌈 THEME COLORS */
:root {
  --primary-color: #a90d28; /* rich crimson */
  --secondary-color: #2c0b0b; /* deep maroon-black */
  --accent-color: #facc15; /* soft gold */
  --neutral-light: #fafafa;
  --neutral-dark: #111;
  --text-light: #f5f5f5;
  --text-muted: #9ca3af;
}

/* 🌅 HERO SECTION */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-light);
  background: linear-gradient(145deg, #2c0b0b 0%, #450a0a 40%, #a90d28 100%);
  overflow: hidden;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  padding: 0 1rem;
}
.hero h1 {
  font-size: clamp(2.3rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #ffffff, #facc15, #ffffff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 2rem;
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
  padding: 0.85rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.35s ease;
  cursor: pointer;
  font-size: 1rem;
}
.btn-primary {
  background: linear-gradient(90deg, #a90d28, #600d0d);
  color: #fff;
  box-shadow: 0 0 10px rgba(169, 13, 40, 0.3);
}
.btn-primary:hover {
  background: linear-gradient(90deg, #d2143c, #a90d28);
  transform: translateY(-3px);
  box-shadow: 0 0 25px rgba(250, 204, 21, 0.25);
}
.btn-outline {
  background: transparent;
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
}
.btn-outline:hover {
  background: var(--accent-color);
  color: var(--secondary-color);
  transform: translateY(-3px);
}
.btn-outline-light {
  background: transparent;
  border: 2px solid #fff;
  color: #fff;
}
.btn-outline-light:hover {
  background: #fff;
  color: var(--primary-color);
}

/* 🧭 SECTIONS */
.section {
  padding: 5rem 1rem;
}
.alt-bg {
  background-color: #faf9f9;
}
.section h2 {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary-color);
}
.section-subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 2.5rem;
}

/* 🛒 CATEGORY CARDS */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}
.category-card {
  background: linear-gradient(180deg, #ffffff, #f6f6f6);
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.4s ease;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}
.category-card:hover {
  transform: translateY(-8px);
  background: linear-gradient(180deg, #fff, #ffe4e4);
  box-shadow: 0 10px 25px rgba(169, 13, 40, 0.2);
}
.category-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
.category-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.6rem;
}
.category-card a {
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}
.category-card a:hover {
  color: #450a0a;
}

/* 💬 TESTIMONIALS */
.testimonial-card {
  background: #fff;
  border-left: 5px solid var(--primary-color);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}
.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(169, 13, 40, 0.15);
}
.testimonial-author {
  color: var(--primary-color);
  font-weight: 600;
}

/* 🚀 CTA SECTION */
.cta-section {
  background: linear-gradient(135deg, #a90d28, #2c0b0b);
  color: white;
  text-align: center;
  padding: 5rem 1rem;
  position: relative;
  overflow: hidden;
}
.cta-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(250, 204, 21, 0.1), transparent 70%);
  pointer-events: none;
}
.cta-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
}

/* 🌠 ANIMATIONS */
.fade-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 1s ease forwards;
}
.delay-1 {
  animation-delay: 0.3s;
}
.delay-2 {
  animation-delay: 0.6s;
}
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 📱 RESPONSIVE */
@media (max-width: 768px) {
  .hero {
    min-height: 70vh;
    padding: 4rem 1rem;
  }
  .grid-3 {
    grid-template-columns: 1fr;
  }
  .section {
    padding: 3rem 1rem;
  }
}
</style>