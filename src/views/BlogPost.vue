<template>
  <div class="blog-post" v-if="post">
    <div class="hero" :style="{ backgroundImage: `url(https://via.placeholder.com/1200x280?text=${encodeURIComponent(post.title)})` }">
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

  <div v-else class="container">
    <p>Post not found.</p>
    <router-link to="/blog" class="btn btn-primary">Back to Blog</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Seeded posts (aligns with your sample data)
const blogPosts = [
  {
    id: 1,
    title: 'Top 5 Common Phone Problems and How to Fix Them',
    category: 'Tech Tips',
    author: 'Kwame Mensah',
    date: '2025-10-15',
    excerpt: 'Discover common smartphone issues users face daily and quick fixes you can try.',
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
    excerpt: 'A thorough comparison of Mac and Windows laptops to help students decide.',
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
    excerpt: 'Step-by-step guide for licensing, tooling, and marketing your repair venture.',
    body: [
      'Register your business, pick a good location, and invest in essential repair tools.',
      'Build trust with fair pricing, transparent diagnosis, and quality parts.',
      'Use social media, WhatsApp Business, and local SEO to attract customers.'
    ]
  }
]

const postId = computed(() => Number(route.params.id))
const post = computed(() => blogPosts.find(p => p.id === postId.value))
const related = computed(() => blogPosts.filter(p => p.id !== postId.value).slice(0, 3))
</script>

<style scoped>
.hero { background-size: cover; background-position: center; position: relative; }
.hero::before { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,.45); }
.hero-inner { position: relative; padding: 2.5rem 0; color: #fff; }
.back-link { color: #e2e8f0; text-decoration: none; font-weight: 600; }
h1 { margin: .5rem 0; color: #fff; }
.meta { opacity: .9; display: flex; gap: .5rem; flex-wrap: wrap; }
.category { color: #a7f3d0; }

.content { display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem; padding: 1.5rem 0; }
.article { line-height: 1.8; }
.excerpt { font-style: italic; color: #6b7280; margin-bottom: 1rem; }
.body p { margin: .85rem 0; }
.sidebar h3 { margin-bottom: .75rem; }
.related { list-style: none; padding: 0; }
.related li { margin: .35rem 0; }

@media (max-width: 920px) { .content { grid-template-columns: 1fr; } }
</style>