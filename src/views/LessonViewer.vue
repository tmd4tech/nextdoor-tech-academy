<template>
  <div class="lesson-viewer" v-if="course">
    <div class="container">
      <div class="header">
        <router-link :to="`/course/${course.id}`" class="back-link">← Back to Course</router-link>
        <h1 class="title">{{ course.title }}</h1>
        <p class="subtitle">Lesson: {{ currentLesson?.title || 'Unknown' }}</p>
      </div>

      <div class="layout">
        <!-- Sidebar: modules and lessons -->
        <aside class="sidebar">
          <h3>Curriculum</h3>
          <div v-for="m in course.modules" :key="m.id" class="module">
            <h4>📦 {{ m.title }}</h4>
            <ul class="lessons">
              <li
                v-for="l in m.lessons"
                :key="l.id"
                :class="{ active: l.id === Number(route.params.lessonId) }"
              >
                <router-link :to="`/course/${course.id}/lesson/${l.id}`">
                  ▶ {{ l.title }} • {{ l.duration }}
                </router-link>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Main content: video + actions -->
        <main class="content">
          <div class="player">
            <div class="player-inner">
              <div class="player-placeholder">
                <p>Video player placeholder</p>
                <p>{{ currentLesson?.title }}</p>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="btn btn-primary" @click="markComplete">
              {{ completed ? '✓ Completed' : 'Mark as Complete' }}
            </button>
            <div class="nav-buttons">
              <button class="btn" :disabled="!prevLesson" @click="goToPrev">← Previous</button>
              <button class="btn btn-secondary" :disabled="!nextLesson" @click="goToNext">Next →</button>
            </div>
          </div>

          <section class="resources">
            <h3>Resources</h3>
            <ul>
              <li>PDF notes (placeholder)</li>
              <li>Practice checklist (placeholder)</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  </div>

  <div v-else class="container">
    <p>Course or lesson not found.</p>
    <router-link to="/courses" class="btn btn-primary">Back to Courses</router-link>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '../stores/courseStore'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

const courseId = computed(() => Number(route.params.id))
const lessonId = computed(() => Number(route.params.lessonId))

const course = computed(() => courseStore.getCourseById(courseId.value))

const flatLessons = computed(() => {
  if (!course.value?.modules) return []
  return course.value.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })))
})

const currentIndex = computed(() => flatLessons.value.findIndex(l => l.id === lessonId.value))
const currentLesson = computed(() => (currentIndex.value >= 0 ? flatLessons.value[currentIndex.value] : null))
const prevLesson = computed(() => (currentIndex.value > 0 ? flatLessons.value[currentIndex.value - 1] : null))
const nextLesson = computed(() => (currentIndex.value >= 0 && currentIndex.value < flatLessons.value.length - 1 ? flatLessons.value[currentIndex.value + 1] : null))

const completed = ref(false)
const markComplete = () => { completed.value = true }

const goTo = (id) => {
  router.push({ name: 'LessonViewer', params: { id: courseId.value, lessonId: id } })
}

const goToPrev = () => {
  const l = prevLesson.value
  if (l) goTo(l.id)
}

const goToNext = () => {
  const l = nextLesson.value
  if (l) goTo(l.id)
}
</script>

<style scoped>
.lesson-viewer { padding: 2rem 0; }
.header { margin-bottom: 1.5rem; }
.back-link { color: var(--primary-color); text-decoration: none; font-weight: 600; }
.title { margin: 0.5rem 0; }
.subtitle { color: #6b7280; }

.layout { display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; }
.sidebar { background: #fff; border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1rem; height: fit-content; position: sticky; top: 90px; }
.module { margin-bottom: 1rem; }
.module h4 { margin-bottom: 0.5rem; }
.lessons { list-style: none; padding-left: 0; }
.lessons li { margin: 0.35rem 0; }
.lessons a { text-decoration: none; color: var(--text-color); }
.lessons li.active a { color: var(--primary-color); font-weight: 700; }

.content { background: #fff; border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1rem; }
.player { background: #000; border-radius: 0.5rem; overflow: hidden; }
.player-inner { aspect-ratio: 16 / 9; display: flex; align-items: center; justify-content: center; }
.player-placeholder { color: #fff; text-align: center; opacity: 0.85; }

.actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin: 1rem 0; flex-wrap: wrap; }
.btn { padding: 0.6rem 1rem; border-radius: 0.5rem; border: 1px solid var(--border-color); background: #fff; cursor: pointer; }
.btn-primary { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
.btn-secondary { background: var(--dark-color); color: #fff; border-color: var(--dark-color); }
.nav-buttons { display: flex; gap: 0.5rem; }

.resources { margin-top: 1rem; }
.resources ul { padding-left: 1.1rem; }
@media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .sidebar { position: static; } }
</style>