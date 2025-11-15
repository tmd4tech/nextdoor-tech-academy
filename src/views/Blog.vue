<template>
  <div>
    <section class="hero">
      <div class="hero-inner">
        <div class="container">
          <a class="back-link" href="/">Home</a>
          <h1>Blog</h1>
          <div class="meta">Latest articles and tutorials</div>
        </div>
      </div>
    </section>

    <div class="container content">
      <main>
        <div v-if="loading">Loading posts...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <article v-for="p in posts" :key="p._id" class="article">
          <h2><router-link :to="{ name: 'BlogPost', params: { id: p._id } }">{{ p.title }}</router-link></h2>
          <div class="excerpt">{{ p.excerpt || (p.content && stripHtml(p.content).slice(0, 160) + '...') }}</div>
          <div class="meta">By {{ p.author || p.authorName || 'Admin' }} • {{ p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '' }}</div>
          <hr />
        </article>
      </main>

      <aside class="sidebar">
        <h3>Recent Posts</h3>
        <ul class="related">
          <li v-for="r in posts.slice(0,5)" :key="r._id">
            <router-link :to="{ name: 'BlogPost', params: { id: r._id } }">{{ r.title }}</router-link>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useBlogStore } from '../stores/blogStore';

const blogStore = useBlogStore();

onMounted(() => {
  blogStore.fetchPosts();
});

const posts = computed(() => blogStore.posts);
const loading = computed(() => blogStore.loading);
const error = computed(() => blogStore.error);

function stripHtml(input) {
  if (!input) return '';
  return input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, '');
}
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