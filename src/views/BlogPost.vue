<template>
  <div>
    <section class="hero" :style="{ backgroundImage: post && post.image ? 'url(' + post.image + ')' : 'linear-gradient(90deg,#111827,#1f2937)' }">
      <div class="hero-inner">
        <div class="container">
          <router-link class="back-link" :to="{ name: 'Blog' }">← Back to Blog</router-link>
          <h1 v-if="post">{{ post.title }}</h1>
          <div v-if="post" class="meta">By {{ post.author || post.authorName || 'Admin' }} • {{ post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '' }}</div>
        </div>
      </div>
    </section>

    <div class="container content">
      <main>
        <div v-if="loading">Loading post...</div>
        <div v-else-if="!post">Post not found.</div>

        <article v-else class="article">
          <div class="excerpt" v-if="post.excerpt">{{ post.excerpt }}</div>
          <div class="body" v-html="post.content"></div>
        </article>
      </main>

      <aside class="sidebar">
        <h3>Related</h3>
        <ul class="related">
          <li v-for="r in related" :key="r._id">
            <router-link :to="{ name: 'BlogPost', params: { id: r._id } }">{{ r.title }}</router-link>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useBlogStore } from '../stores/blogStore';

const route = useRoute();
const blogStore = useBlogStore();
const postId = computed(() => route.params.id);

onMounted(() => {
  blogStore.fetchPostById(postId.value);
});

const post = computed(() => blogStore.post);
const loading = computed(() => blogStore.loading);
const related = computed(() =>
  blogStore.posts.filter(p => p._id !== postId.value).slice(0, 3)
);
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