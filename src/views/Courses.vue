<template>
  <div class="courses">
    <div class="container">
      <h1>Training Programs</h1>

      <div class="courses-layout">
        <!-- Filters -->
        <aside class="filters-sidebar">
          <h3>Filters</h3>

          <div class="filter-group">
            <label>Category</label>
            <select v-model="selectedCategory">
              <option value="All">All Courses</option>
              <option value="Phone Repair">Phone Repair</option>
              <option value="Laptop Repair">Laptop Repair</option>
              <option value="Software Training">Software Training</option>
              <option value="Business Skills">Business Skills</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Level</label>
            <div class="checkbox-group">
              <label>
                <input type="checkbox" value="beginner" v-model="selectedLevels" />
                Beginner
              </label>
              <label>
                <input type="checkbox" value="intermediate" v-model="selectedLevels" />
                Intermediate
              </label>
              <label>
                <input type="checkbox" value="advanced" v-model="selectedLevels" />
                Advanced
              </label>
            </div>
          </div>

          <div class="filter-group">
            <label>Price Range</label>
            <input
              type="number"
              v-model.number="minPrice"
              placeholder="Min (GHS)"
              class="price-input"
            />
            <input
              type="number"
              v-model.number="maxPrice"
              placeholder="Max (GHS)"
              class="price-input"
            />
          </div>
        </aside>

        <!-- Courses Grid -->
        <main class="courses-main">
          <div class="courses-header">
            <p v-if="!loading">{{ filteredCourses.length }} courses found</p>
            <p v-else>Loading courses...</p>
          </div>

          <div v-if="errorMessage" class="no-courses">
            <p>{{ errorMessage }}</p>
          </div>

          <div v-else-if="filteredCourses.length > 0" class="grid grid-3">
            <CourseCard
              v-for="course in filteredCourses"
              :key="course.id"
              :course="course"
            />
          </div>

          <div v-else-if="!loading" class="no-courses">
            <p>No courses found matching your filters</p>
            <button @click="resetFilters" class="btn btn-primary">
              Reset Filters
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import CourseCard from '../components/CourseCard.vue'

const baseURL = import.meta.env.VITE_API_BASE_URL

const courses = ref([])
const pagination = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const selectedCategory = ref('All')
const selectedLevels = ref([])
const minPrice = ref(0)
const maxPrice = ref(10000)

const loadCourses = async (page = 1) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res = await axios.get(`${baseURL}/api/courses`, {
      params: { page, limit: 50 }
    })

    // normalize fields, including image
    courses.value = (res.data.courses || []).map(c => ({
      id: c.id,
      title: c.title,
      description: c.description || '',
      price: Number(c.price) || 0,
      duration: c.duration || '',
      level: c.level || 'beginner',
      category: c.category || '',
      image: c.image || '',
      rating: Number(c.rating) || 0,
      enrollmentCount: c.enrollmentCount ?? 0
    }))
    pagination.value = res.data.pagination || null
  } catch (err) {
    console.error('Failed to load courses', err)
    errorMessage.value = 'Failed to load courses.'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadCourses())

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const categoryMatch =
      selectedCategory.value === 'All' ||
      course.category === selectedCategory.value

    const levelMatch =
      selectedLevels.value.length === 0 ||
      selectedLevels.value.includes(course.level)

    const price = Number(course.price) || 0
    const priceMatch = price >= minPrice.value && price <= maxPrice.value

    return categoryMatch && levelMatch && priceMatch
  })
})

const resetFilters = () => {
  selectedCategory.value = 'All'
  selectedLevels.value = []
  minPrice.value = 0
  maxPrice.value = 10000
}
</script>

<style scoped>
.courses {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.courses h1 {
  margin-bottom: 2rem;
}

.courses-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.filters-sidebar {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.filters-sidebar h3 {
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.75rem;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--dark-color);
}

.filter-group select,
.price-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.courses-main {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
}

.courses-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.no-courses {
  text-align: center;
  padding: 2rem;
}

@media (max-width: 768px) {
  .courses-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: relative;
    top: 0;
  }
}
</style>
