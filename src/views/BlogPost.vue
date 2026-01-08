<template>
  <div class="blog-post" v-if="post">
    <!-- hero -->
    <div
      class="hero"
      :style="{
        backgroundImage: `url(https://via.placeholder.com/1600x400?text=${encodeURIComponent(
          post.title
        )})`
      }"
    >
      <div class="hero-overlay"></div>
      <div class="container hero-inner">
        <router-link to="/blog" class="back-link">← Back to Blog</router-link>
        <h1>{{ post.title }}</h1>
        <p class="meta">
          <span>✍️ {{ post.author }}</span>
          <span>•</span>
          <span>📅 {{ post.date }}</span>
          <span>•</span>
          <span class="category">🏷️ {{ post.category }}</span>
        </p>
      </div>
    </div>

    <!-- main content -->
    <div class="container content">
      <article class="card article">
        <p class="excerpt">{{ post.excerpt }}</p>
        <div class="body">
          <p v-for="(p, i) in post.body" :key="i">{{ p }}</p>
        </div>
      </article>

      <aside class="sidebar card">
        <h3>Related posts</h3>
        <ul class="related">
          <li v-for="rel in related" :key="rel.id">
            <router-link :to="`/blog/${rel.id}`">{{ rel.title }}</router-link>
          </li>
        </ul>
      </aside>
    </div>
  </div>

  <div v-else class="container not-found">
    <p>Post not found.</p>
    <router-link to="/blog" class="btn btn-primary">Back to Blog</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const blogPosts = [
  {
    id: 1,
    title: 'Top 5 Common Phone Problems and How to Fix Them',
    category: 'Tech Tips',
    author: 'Kwame Mensah',
    date: '2025-10-15',
    excerpt:
      'Discover common smartphone issues users face daily and quick fixes you can try.',
    body: [
      'Screen cracks, battery drain, and charging port faults are among the most common phone issues.',
      'Before visiting a repair shop, try basic steps like restarting, updating software, and cleaning ports.',
      'If DIY fails, consult a professional to avoid worsening hardware damage.'
    ]
  },
  {
    id: 2,
    title: 'MacBook vs Windows Laptop: Which is Better for Students?',
    category: 'Product Reviews',
    author: 'Ama Adjei',
    date: '2025-10-20',
    excerpt:
      'A thorough comparison of Mac and Windows laptops to help students decide.',
    body: [
      'Consider ecosystem, budget, and required apps when choosing a laptop.',
      'Windows offers broader hardware choices, while Mac excels in battery life and build quality.',
      'Always check student discounts and warranty options in Ghana.'
    ]
  },
  {
    id: 3,
    title: 'How to Start a Phone Repair Business in Ghana',
    category: 'Repair Tutorials',
    author: 'Kofi Asante',
    date: '2025-10-25',
    excerpt:
      'Step-by-step guide for licensing, tooling, and marketing your repair venture.',
    body: [
      'Register your business, pick a good location, and invest in essential repair tools.',
      'Build trust with fair pricing, transparent diagnosis, and quality parts.',
      'Use social media, WhatsApp Business, and local SEO to attract customers.'
    ]
  }
]

const postId = computed(() => Number(route.params.id))
const post = computed(() => blogPosts.find(p => p.id === postId.value))
const related = computed(() =>
  blogPosts.filter(p => p.id !== postId.value).slice(0, 3)
)
</script>

<style scoped>
/* hero */
.hero {
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.6),
    rgba(15, 23, 42, 0.9)
  );
}

.hero-inner {
  position: relative;
  padding: 2.8rem 0 2.4rem;
  color: #f9fafb;
}

.back-link {
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}

.hero-inner h1 {
  margin: 0.8rem 0 0.4rem;
  font-size: clamp(1.7rem, 3vw, 2.1rem);
}

.meta {
  opacity: 0.95;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: #cbd5f5;
}

.category {
  color: #f97316;
}

/* layout */
.content {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(260px, 0.9fr);
  gap: 1.75rem;
  padding: 1.8rem 0 2.5rem;
}

/* article */
.article {
  line-height: 1.8;
}

.excerpt {
  font-style: italic;
  color: #6b7280;
  margin-bottom: 1.1rem;
  font-size: 0.95rem;
}

.body p {
  margin: 0.85rem 0;
  color: #111827;
}

/* sidebar */
.sidebar h3 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.related {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related li {
  margin: 0.35rem 0;
}

.related a {
  font-size: 0.9rem;
  color: #0f172a;
  text-decoration: none;
}

.related a:hover {
  color: #f97316;
}

/* not found */
.not-found {
  padding: 2.5rem 0;
}

/* responsive */
@media (max-width: 920px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>