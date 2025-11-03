<template>
  <div class="course-card card">
    <div class="course-image">
      <img :src="`https://via.placeholder.com/300x180?text=${course.title}`" :alt="course.title">
      <span class="level-badge" :class="`level-${course.level.toLowerCase()}`">{{ course.level }}</span>
    </div>

    <div class="course-info">
      <h3>{{ course.title }}</h3>
      <p class="instructor">👨‍🏫 {{ course.instructor }}</p>
      
      <div class="course-meta">
        <span>⏱️ {{ course.duration }}</span>
        <span>👥 {{ course.students }} students</span>
      </div>

      <div class="rating">
        <span class="stars">⭐ {{ course.rating }}</span>
      </div>

      <p class="description">{{ course.description.substring(0, 80) }}...</p>

      <div class="course-footer">
        <span class="price">GHS {{ course.price }}</span>
        <div class="actions">
          <router-link :to="`/course/${course.id}`" class="btn btn-outline">View</router-link>
          <button class="btn btn-primary" @click="enrollCourse">Enroll Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()
const cartStore = useCartStore()

const enrollCourse = () => {
  if (!authStore.isLoggedIn) {
    alert('Please login to enroll in courses')
    return
  }

  cartStore.addItem({
    ...props.course,
    type: 'course'
  })
  alert(`${props.course.title} added to cart!`)
}
</script>

<style scoped>
.course-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.course-image {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.level-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.35rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
}

.level-beginner { background-color: #10b981; }
.level-intermediate { background-color: #f59e0b; }
.level-advanced { background-color: #ef4444; }

.course-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.instructor {
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.course-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.rating {
  margin-bottom: 0.5rem;
}

.stars {
  font-size: 0.9rem;
  font-weight: 600;
}

.description {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1rem;
  flex: 1;
  line-height: 1.4;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.actions .btn {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.9rem;
}
</style>