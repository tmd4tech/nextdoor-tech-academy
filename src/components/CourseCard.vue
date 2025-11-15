<template>
  <div class="course-card card">
    <div class="course-image">
     <img :src="courseImage" :alt="course.title" />
      <span
        class="level-badge"
        :class="`level-${course.level?.toLowerCase() || 'unknown'}`"
      >
        {{ course.level || 'Unknown' }}
      </span>
    </div>

    <div class="course-info">
      <h3>{{ course.title }}</h3>
      <p class="instructor">👨‍🏫 {{ course.instructor || 'TBA' }}</p>
      
      <div class="course-meta">
        <span>⏱️ {{ course.duration || 'Self-paced' }}</span>
<span>👥 {{ props.course.students?.length || 0 }} students</span>

      </div>

      <div class="rating">
        ⭐ {{ course.rating || 0 }}
      </div>

      <p class="description">{{ course.description?.substring(0, 80) || 'No description available' }}...</p>

      <div class="course-footer">
        <span class="price">GHS {{ course.price }}</span>
        <router-link :to="`/course/${course._id}`" class="btn btn-primary">View Course</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { defineProps } from 'vue';

import axios from 'axios';
const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});


// Placeholder image if course has no image
const placeholderImage = 'https://via.placeholder.com/300x180?text=Course';

// Replace with your Render backend URL
const baseUrl = 'https://next-door-backend.onrender.com';

// Computed course image URL
const courseImage = computed(() =>
  props.course.imageUrl ? `${baseUrl}${props.course.imageUrl}` : placeholderImage
);

// Enroll function
const enroll = async () => {
  try {
    const token = localStorage.getItem('token'); // or however you store it
    await axios.post(
      `${baseUrl}/api/courses/${props.course._id}/enroll`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    alert('Enrolled successfully!');
  } catch (err) {
    alert(err?.response?.data?.message || 'Enrollment failed!');
  }
};


</script>


<style scoped>
.course-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.course-card:hover {
  transform: translateY(-4px);
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
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.level-beginner { background-color: #10b981; }
.level-intermediate { background-color: #f59e0b; }
.level-advanced { background-color: #ef4444; }

.course-info {
  padding: 1rem;
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
  color: #4b5563;
  font-weight: 500;
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
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 0.9rem;
  color: #6b7280;
  flex: 1;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: 700;
  color: #1d4ed8;
}

.btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  text-decoration: none;
  background-color: #1d4ed8;
  color: white;
  border-radius: 0.375rem;
  transition: background 0.2s;
}

.btn:hover {
  background-color: #2563eb;
}
</style>
