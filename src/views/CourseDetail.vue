<template>
  <div class="course-detail" v-if="course">
    <div class="course-header" :style="{ backgroundImage: `url(https://via.placeholder.com/1200x300?text=${course.title})` }">
      <div class="container">
        <router-link to="/courses" class="back-link">← Back to Courses</router-link>
        <h1>{{ course.title }}</h1>
        <p class="instructor">By {{ course.instructor }}</p>
      </div>
    </div>

    <div class="container course-container">
      <div class="course-layout">
        <main class="course-content">
          <section class="about-section">
            <h2>About This Course</h2>
            <p>{{ course.description }}</p>
          </section>

          <section class="syllabus-section">
            <h2>What You'll Learn</h2>
            <ul class="syllabus-list">
              <li v-for="(item, index) in course.syllabus" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <section class="reviews-section">
            <h2>Student Reviews</h2>
            <div class="review-card">
              <div class="review-header">
                <span class="reviewer-name">John Doe</span>
                <span class="review-rating">⭐⭐⭐⭐⭐</span>
              </div>
              <p class="review-text">This course is amazing! I learned so much and now I can repair phones confidently.</p>
            </div>

            <div class="review-card">
              <div class="review-header">
                <span class="reviewer-name">Jane Smith</span>
                <span class="review-rating">⭐⭐⭐⭐</span>
              </div>
              <p class="review-text">Great instructor and comprehensive content. Highly recommended!</p>
            </div>
          </section>
        </main>

        <aside class="course-sidebar">
          <div class="enrollment-card card">
            <img :src="`https://via.placeholder.com/300x200?text=${course.title}`" :alt="course.title" class="course-thumbnail">

            <div class="course-meta">
              <div class="meta-item">
                <span class="label">Price:</span>
                <span class="value">GHS {{ course.price }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Duration:</span>
                <span class="value">{{ course.duration }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Level:</span>
                <span class="value" :class="`level-${course.level.toLowerCase()}`">{{ course.level }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Students:</span>
                <span class="value">{{ course.students }} enrolled</span>
              </div>
              <div class="meta-item">
                <span class="label">Rating:</span>
                <span class="value">⭐ {{ course.rating }}/5</span>
              </div>
            </div>

            <div class="prerequisites" v-if="course.prerequisites">
              <h4>Prerequisites</h4>
              <p>{{ course.prerequisites }}</p>
            </div>

            <button class="btn btn-primary btn-block" @click="enrollNow" v-if="!isEnrolled">
              Enroll Now
            </button>
            <button class="btn btn-secondary btn-block" disabled v-else>
              ✓ Already Enrolled
            </button>

            <div class="includes">
              <h4>This course includes:</h4>
              <ul>
                <li>📚 Complete syllabus</li>
                <li>🎥 Video lessons</li>
                <li>📝 Study materials</li>
                <li>✅ Certificate of completion</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>

  <div v-else class="container">
    <p>Course not found</p>
    <router-link to="/courses" class="btn btn-primary">Back to Courses</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '../stores/courseStore'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'

const route = useRoute()
const courseStore = useCourseStore()
const authStore = useAuthStore()
const cartStore = useCartStore()

const course = computed(() => {
  return courseStore.getCourseById(route.params.id)
})

const isEnrolled = computed(() => {
  if (!authStore.user || !course.value) return false
  return authStore.user.enrolledCourses.includes(course.value.id)
})

const enrollNow = () => {
  if (!authStore.isLoggedIn) {
    alert('Please login to enroll in courses')
    return
  }

  if (course.value) {
    cartStore.addItem({
      ...course.value,
      type: 'course'
    })
    alert(`${course.value.title} added to cart!`)
  }
}
</script>

<style scoped>
.course-header {
  background-size: cover;
  background-position: center;
  padding: 4rem 1rem;
  color: white;
  position: relative;
  margin-bottom: 2rem;
}

.course-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.course-header > * {
  position: relative;
  z-index: 1;
}

.course-header h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.back-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  display: inline-block;
  margin-bottom: 1rem;
}

.back-link:hover {
  color: white;
}

.course-container {
  padding-bottom: 2rem;
}

.course-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.course-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.75rem;
}

.course-content section {
  margin-bottom: 2.5rem;
}

.course-content h2 {
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.75rem;
}

.course-content p {
  line-height: 1.8;
  margin-bottom: 1rem;
}

.syllabus-list {
  list-style: none;
}

.syllabus-list li {
  padding: 0.75rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #6b7280;
}

.syllabus-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: 700;
}

.review-card {
  background-color: var(--light-color);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid var(--primary-color);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.reviewer-name {
  font-weight: 600;
  color: var(--dark-color);
}

.review-rating {
  font-size: 0.9rem;
}

.review-text {
  color: #6b7280;
  line-height: 1.6;
}

.enrollment-card {
  position: sticky;
  top: 100px;
}

.course-thumbnail {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.course-meta {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.label {
  font-weight: 600;
  color: var(--dark-color);
}

.value {
  color: var(--primary-color);
  font-weight: 600;
}

.level-beginner { color: #10b981; }
.level-intermediate { color: #f59e0b; }
.level-advanced { color: #ef4444; }

.prerequisites {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #fef3c7;
  border-radius: 0.5rem;
  border-left: 4px solid #f59e0b;
}

.prerequisites h4 {
  margin-bottom: 0.5rem;
  color: #b45309;
}

.prerequisites p {
  font-size: 0.9rem;
  color: #92400e;
  margin: 0;
}

.btn-block {
  width: 100%;
  margin-bottom: 1.5rem;
}

.includes {
  background-color: var(--light-color);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
}

.includes h4 {
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.includes ul {
  list-style: none;
}

.includes li {
  padding: 0.35rem 0;
  font-size: 0.9rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .course-layout {
    grid-template-columns: 1fr;
  }

  .enrollment-card {
    position: relative;
    top: 0;
  }

  .course-header h1 {
    font-size: 1.75rem;
  }
}
</style>