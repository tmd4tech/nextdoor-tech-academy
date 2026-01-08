<template>
  <div class="blog">
    <div class="container">
      <h1>Tech Blog</h1>

      <div class="grid grid-2 blog-grid">
        <article
          v-for="post in blogPosts"
          :key="post.id"
          class="card blog-card"
        >
          <h2>{{ post.title }}</h2>
          <p class="meta">
            <span>✍️ {{ post.author }}</span>
            <span>•</span>
            <span>📅 {{ post.date }}</span>
          </p>
          <p class="excerpt">{{ post.excerpt }}</p>
          <router-link :to="`/blog/${post.id}`" class="read-more">
            Read more →
          </router-link>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
const blogPosts = [
  {
    id: 1,
    title: 'Top 5 Common Phone Problems and How to Fix Them',
    category: 'Tech Tips',
    author: 'Kwame Mensah',
    date: '2025-10-15',
    excerpt:
      'Discover common smartphone issues users face daily and quick fixes you can try.'
  },
  {
    id: 2,
    title: 'MacBook vs Windows Laptop: Which is Better for Students?',
    category: 'Product Reviews',
    author: 'Ama Adjei',
    date: '2025-10-20',
    excerpt:
      'A thorough comparison of Mac and Windows laptops to help students decide.'
  },
  {
    id: 3,
    title: 'How to Start a Phone Repair Business in Ghana',
    category: 'Repair Tutorials',
    author: 'Kofi Asante',
    date: '2025-10-25',
    excerpt:
      'Step-by-step guide for licensing, tooling, and marketing your repair venture.'
  }
]
</script>

<style scoped>
.blog-grid {
  margin-top: 1.5rem;
  gap: 1.5rem;
}

.blog-card h2 {
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
}

.blog-card .meta {
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 0.6rem;
}

.blog-card .excerpt {
  font-size: 0.9rem;
  color: #4b5563;
  margin-bottom: 0.8rem;
}

.read-more {
  font-size: 0.9rem;
  color: #f97316;
  font-weight: 600;
  text-decoration: none;
}
.read-more:hover {
  text-decoration: underline;
}
</style>
