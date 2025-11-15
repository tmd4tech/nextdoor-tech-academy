<template>
  <div class="lesson-viewer">
    <div class="container">
      <!-- Header -->
      <div class="viewer-header">
        <router-link to="/dashboard" class="back-link">← Back to Dashboard</router-link>
        <h1>{{ course?.title || 'Loading...' }}</h1>
        <div class="course-meta">
          <span>📚 {{ course?.category }}</span>
          <span>👨‍🏫 {{ course?.instructor || 'TBA' }}</span>
          <span>⏱️ {{ course?.duration || 'Self-paced' }}</span>
        </div>
      </div>

      <!-- Main Content -->
      <div class="viewer-container">
        <!-- Sidebar: Lessons/Topics -->
        <aside class="lessons-sidebar">
          <h2>Course Content</h2>
          <div v-if="lessons.length" class="lessons-list">
            <div
              v-for="(lesson, idx) in lessons"
              :key="idx"
              class="lesson-item"
              :class="{ active: currentLessonIdx === idx }"
              @click="selectLesson(idx)"
            >
              <span class="lesson-number">{{ idx + 1 }}</span>
              <span class="lesson-title">{{ lesson.title }}</span>
              <span v-if="lesson.completed" class="lesson-check">✓</span>
            </div>
          </div>
          <p v-else class="no-lessons">No lessons yet</p>

          <!-- Progress -->
          <div class="progress-section">
            <h3>Your Progress</h3>
            <div class="progress-bar">
              <div class="progress" :style="{ width: currentProgress + '%' }"></div>
            </div>
            <p class="progress-text">{{ currentProgress }}% Complete</p>
          </div>

          <!-- Mark Complete -->
          <button
            v-if="!courseCompleted && currentProgress === 100"
            class="btn btn-success mark-complete"
            @click="completeCourse"
          >
            🎓 Mark Course Complete
          </button>

          <div v-if="courseCompleted" class="completion-badge">
            <p>✓ Course Completed!</p>
            <p>Congratulations on finishing this course.</p>
          </div>
        </aside>

        <!-- Main Content: Video/Lesson -->
        <main class="lesson-content">
          <div v-if="currentLesson" class="content-card">
            <!-- Video -->
            <div v-if="currentLesson.videoUrl" class="video-container">
              <video :src="currentLesson.videoUrl" controls></video>
            </div>

            <!-- Lesson Title -->
            <h2>{{ currentLesson.title }}</h2>

            <!-- Description -->
            <div v-if="currentLesson.description" class="lesson-description">
              <p>{{ currentLesson.description }}</p>
            </div>

            <!-- Resources -->
            <div v-if="currentLesson.resources?.length" class="resources">
              <h3>📎 Resources</h3>
              <ul>
                <li v-for="(res, idx) in currentLesson.resources" :key="idx">
                  <a :href="res.url" target="_blank" rel="noopener noreferrer">
                    {{ res.title }}
                  </a>
                </li>
              </ul>
            </div>

            <!-- Lesson Navigation -->
            <div class="lesson-nav">
              <button
                v-if="currentLessonIdx > 0"
                class="btn btn-outline"
                @click="selectLesson(currentLessonIdx - 1)"
              >
                ← Previous Lesson
              </button>

              <button
                v-if="!currentLesson.completed"
                class="btn btn-primary"
                @click="markLessonComplete"
              >
                ✓ Mark Lesson Complete
              </button>

              <button
                v-if="currentLessonIdx < lessons.length - 1"
                class="btn btn-primary"
                @click="selectLesson(currentLessonIdx + 1)"
              >
                Next Lesson →
              </button>
            </div>
          </div>

          <div v-else class="no-content">
            <p>Select a lesson to get started</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStudentStore } from '../stores/studentStore';
import { useCourseStore } from '../stores/courseStore';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const courseId = route.params.courseId;

const studentStore = useStudentStore();
const courseStore = useCourseStore();

const course = ref(null);
const currentLessonIdx = ref(0);
const lessons = ref([]);
const loading = ref(true);

// Check if student is enrolled in this course
const isEnrolled = computed(() => {
  return studentStore.enrolledCourses.some(c => c._id === courseId);
});

// Get enrollment info
const enrollment = computed(() => {
  return studentStore.enrolledCourses.find(c => c._id === courseId);
});

const currentProgress = computed(() => {
  return enrollment.value?.progress || 0;
});

const courseCompleted = computed(() => {
  return enrollment.value?.completed || false;
});

// Current lesson
const currentLesson = computed(() => {
  return lessons.value[currentLessonIdx.value] || null;
});

// Select lesson
const selectLesson = (idx) => {
  if (idx >= 0 && idx < lessons.value.length) {
    currentLessonIdx.value = idx;
  }
};

// Mark lesson complete
const markLessonComplete = async () => {
  if (!currentLesson.value) return;

  currentLesson.value.completed = true;

  // Update progress
  const completedCount = lessons.value.filter(l => l.completed).length;
  const progress = Math.round((completedCount / lessons.value.length) * 100);

  await studentStore.updateCourseProgress(courseId, progress, progress === 100);
};

// Complete course
const completeCourse = async () => {
  const success = await studentStore.updateCourseProgress(courseId, 100, true);
  if (success) {
    alert('🎉 Congratulations! You have completed this course!');
  }
};

// Load course data
onMounted(async () => {
  try {
    // Check if enrolled
    if (!isEnrolled.value) {
      alert('You are not enrolled in this course');
      router.push('/courses');
      return;
    }

    // Fetch course from store or backend
    const courseData = courseStore.getCourseById(courseId);
    if (courseData) {
      course.value = courseData;
    } else {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL || 'VITE_API_URL=https://next-door-backend.onrender.co'}/api/courses/${courseId}`
      );
      course.value = data;
    }

    // Generate sample lessons from course
    // In a real app, these would come from the database
    lessons.value = [
      {
        id: 1,
        title: 'Course Introduction',
        description: 'Get an overview of what you will learn in this course.',
        videoUrl: course.value?.videoUrl || '',
        completed: false,
        resources: [
          { title: 'Course Syllabus', url: '#' },
          { title: 'Getting Started Guide', url: '#' }
        ]
      },
      {
        id: 2,
        title: 'Lesson 2: Fundamentals',
        description: 'Learn the basics and foundational concepts.',
        videoUrl: '',
        completed: false,
        resources: []
      },
      {
        id: 3,
        title: 'Lesson 3: Advanced Topics',
        description: 'Deep dive into advanced materials.',
        videoUrl: '',
        completed: false,
        resources: []
      },
      {
        id: 4,
        title: 'Final Project',
        description: 'Apply everything you learned to a capstone project.',
        videoUrl: '',
        completed: false,
        resources: [
          { title: 'Project Guidelines', url: '#' },
          { title: 'Submission Form', url: '#' }
        ]
      }
    ];

    loading.value = false;
  } catch (err) {
    console.error('Error loading course:', err);
    loading.value = false;
  }
});
</script>

<style scoped>
.lesson-viewer {
  min-height: 100vh;
  padding: 2rem 0;
  background: #f9fafb;
}

.viewer-header {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.back-link {
  display: inline-block;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: opacity 0.3s;
}

.back-link:hover {
  opacity: 0.8;
}

.viewer-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.course-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  opacity: 0.95;
  font-size: 0.95rem;
}

.viewer-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

/* Sidebar */
.lessons-sidebar {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.lessons-sidebar h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.lessons-list {
  margin-bottom: 1.5rem;
}

.lesson-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 0.5rem;
  border-left: 3px solid transparent;
}

.lesson-item:hover {
  background: #f3f4f6;
  border-left-color: #007bff;
}

.lesson-item.active {
  background: #dbeafe;
  border-left-color: #007bff;
  font-weight: 600;
}

.lesson-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
}

.lesson-item.active .lesson-number {
  background: #007bff;
  color: white;
}

.lesson-title {
  flex: 1;
  font-size: 0.9rem;
}

.lesson-check {
  color: #10b981;
  font-weight: bold;
}

.no-lessons {
  text-align: center;
  color: #6b7280;
  padding: 1rem 0;
}

.progress-section {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
}

.progress-section h3 {
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.85rem;
  color: #6b7280;
  text-align: center;
}

.mark-complete {
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
}

.completion-badge {
  margin-top: 1rem;
  padding: 1rem;
  background: #d1fae5;
  border-radius: 8px;
  text-align: center;
  color: #065f46;
}

.completion-badge p {
  margin: 0.25rem 0;
  font-weight: 600;
}

/* Main Content */
.lesson-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.content-card {
  padding: 2rem;
}

.video-container {
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}

.video-container video {
  width: 100%;
  height: auto;
  max-height: 500px;
}

.lesson-content h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.lesson-description {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  line-height: 1.6;
  color: #4b5563;
}

.resources {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.resources h3 {
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.resources ul {
  list-style: none;
  padding: 0;
}

.resources li {
  margin-bottom: 0.5rem;
}

.resources a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.resources a:hover {
  text-decoration: underline;
}

.lesson-nav {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.lesson-nav .btn {
  flex: 1;
  padding: 0.75rem;
}

.btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-outline {
  border: 1px solid #e5e7eb;
  background: white;
  color: #1f2937;
}

.btn-outline:hover {
  background: #f3f4f6;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.no-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #6b7280;
  font-size: 1.1rem;
}

/* Mobile */
@media (max-width: 768px) {
  .viewer-container {
    grid-template-columns: 1fr;
  }

  .lessons-sidebar {
    position: static;
  }

  .lesson-nav {
    flex-direction: column;
  }

  .course-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .viewer-header h1 {
    font-size: 1.5rem;
  }
}
</style>