<template>
  <div class="course-card card">
    <div class="course-image">
      <img
        :src="`https://via.placeholder.com/300x180?text=${course.title}`"
        :alt="course.title"
      />
      <span
        class="level-badge"
        :class="`level-${course.level.toLowerCase()}`"
      >
        {{ course.level }}
      </span>
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

      <p class="description">
        {{ course.description.substring(0, 80) }}...
      </p>

      <div class="course-footer">
        <span class="price">GHS {{ course.price }}</span>

        <div class="actions">
          <!-- fixed path: /courses/:id -->
          <router-link
            :to="`/courses/${course.id}`"
            class="btn btn-outline-dark"
          >
            View
          </router-link>
          <button class="btn btn-enroll" @click="enrollCourse">
            Enroll
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

/* image */
.course-image {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background-color: #e5e7eb;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}

.course-card:hover .course-image img {
  transform: scale(1.04);
}

/* level badge */
.level-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
}

.level-beginner {
  background-color: #22c55e;
}
.level-intermediate {
  background-color: #f59e0b;
}
.level-advanced {
  background-color: #ef4444;
}

/* content */
.course-info {
  padding: 0.9rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-info h3 {
  font-size: 1.02rem;
  margin-bottom: 0.4rem;
  line-height: 1.3;
  color: #111827;
}

.instructor {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.45rem;
}

.course-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.35rem;
}

.rating {
  margin-bottom: 0.45rem;
}

.stars {
  font-size: 0.85rem;
  font-weight: 600;
}

/* description */
.description {
  font-size: 0.88rem;
  color: #6b7280;
  margin-bottom: 0.9rem;
  flex: 1;
  line-height: 1.4;
}

/* footer */
.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.9rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--card-border);
}

.price {
  font-size: 1.08rem;
  font-weight: 700;
  color: #f97316;
}

/* actions – slim buttons */
.actions {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 0 0 120px;
}

.actions .btn {
  width: 100%;
  padding: 0.42rem 0.55rem;
  font-size: 0.82rem;
  font-weight: 600;
}

/* outline View button (flat) */
.btn-outline-dark {
  border-radius: 0.35rem;
  border: 1px solid #0f172a;
  background: #ffffff;
  color: #0f172a;
  text-align: center;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}

.btn-outline-dark:hover {
  background: #0f172a;
  color: #f9fafb;
}

/* flat orange Enroll button */
.btn-enroll {
  border-radius: 0.35rem;
  border: none;
  background: #f97316;
  color: #111827;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
  transition: background 0.15s ease, box-shadow 0.15s ease;
}

.btn-enroll:hover {
  background: #ea580c;
  box-shadow: 0 7px 18px rgba(249, 115, 22, 0.45);
}

/* responsive */
@media (max-width: 640px) {
  .course-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions {
    width: 100%;
    flex: 1;
  }
}
</style>
