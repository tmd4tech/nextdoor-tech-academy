<template>
  <div class="blog-manager">
    <h1>Blog Manager</h1>

    <div class="manager-grid">
      <!-- New Post Form -->
      <section class="card form-section">
        <h2>{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h2>

        <div class="form-group">
          <label>Title</label>
          <input v-model="form.title" type="text" placeholder="Post title" />
        </div>

        <div class="form-group">
          <label>Author</label>
          <input v-model="form.author" type="text" placeholder="Author name" />
        </div>

        <div class="form-group">
          <label>Excerpt</label>
          <textarea v-model="form.excerpt" placeholder="Short summary (optional)" rows="2"></textarea>
        </div>

        <div class="form-group">
          <label>Keywords</label>
          <input v-model="form.keywordsStr" type="text" placeholder="Comma-separated keywords" />
        </div>

        <div class="form-group">
          <label>Hero Image</label>
          <div class="image-upload">
            <input
              type="file"
              accept="image/*"
              @change="onImageSelect"
              ref="imageInput"
            />
            <button type="button" @click="uploadImage" v-if="selectedFile" :disabled="uploadingImage">
              {{ uploadingImage ? 'Uploading...' : 'Upload Image' }}
            </button>
          </div>
          <div v-if="form.image" class="image-preview">
            <img :src="form.image" alt="Preview" />
          </div>
        </div>

        <div class="form-group">
          <label>Content</label>
          <textarea v-model="form.content" placeholder="Post content (HTML allowed)" rows="8"></textarea>
        </div>

        <div class="form-group checkbox">
          <input v-model="form.published" type="checkbox" id="published" />
          <label for="published">Publish immediately</label>
        </div>

        <div class="form-actions">
          <button @click="generateAIDraft" class="btn btn-secondary" :disabled="!form.title">
            {{ generatingDraft ? 'Generating...' : 'Generate AI Draft' }}
          </button>
          <button @click="savePost" class="btn btn-primary" :disabled="!form.title || saving">
            {{ saving ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post') }}
          </button>
          <button v-if="isEditing" @click="cancelEdit" class="btn btn-outline">Cancel</button>
        </div>
      </section>

      <!-- Posts List -->
      <section class="card posts-section">
        <h2>Published Posts</h2>

        <div v-if="loadingPosts" class="loading">Loading posts...</div>
        <div v-else-if="posts.length === 0" class="empty">No posts yet.</div>

        <ul v-else class="posts-list">
          <li v-for="post in posts" :key="post._id" class="post-item">
            <div class="post-header">
              <h3>{{ post.title }}</h3>
              <span class="date">{{ new Date(post.createdAt).toLocaleDateString() }}</span>
            </div>
            <p class="excerpt">{{ post.excerpt || post.content.slice(0, 100) + '...' }}</p>
            <div class="post-actions">
              <button @click="editPost(post)" class="btn-small">Edit</button>
              <button @click="deletePost(post._id)" class="btn-small btn-danger">Delete</button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
const API_ROOT = import.meta.env.VITE_API_URL || 'VITE_API_URL=https://next-door-backend.onrender.com';
const API_BASE = `${API_ROOT}/api/blog`;

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_ROOT,
});

api.interceptors.request.use((config) => {
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

// Form state
const form = ref({
  title: '',
  author: '',
  excerpt: '',
  keywordsStr: '',
  image: '',
  content: '',
  published: false,
});

const isEditing = ref(false);
const editingId = ref(null);
const selectedFile = ref(null);
const imageInput = ref(null);

// Loading states
const saving = ref(false);
const loadingPosts = ref(false);
const generatingDraft = ref(false);
const uploadingImage = ref(false);

// Posts list
const posts = ref([]);

// Fetch posts
const fetchPosts = async () => {
  loadingPosts.value = true;
  try {
    const { data } = await api.get('/api/blog');
    posts.value = data;
  } catch (err) {
    console.error(err);
    alert('Error loading posts');
  } finally {
    loadingPosts.value = false;
  }
};

// Generate AI draft
const generateAIDraft = async () => {
  if (!form.value.title) return;
  generatingDraft.value = true;
  try {
    const keywords = form.value.keywordsStr.split(',').map(k => k.trim()).filter(Boolean);
    const { data } = await api.post('/api/blog/generate', {
      title: form.value.title,
      keywords: keywords.length > 0 ? keywords : [],
    });
    form.value.content = data.draft;
  } catch (err) {
    console.error(err);
    alert('Error generating draft: ' + (err.response?.data?.message || err.message));
  } finally {
    generatingDraft.value = false;
  }
};

// Select image file
const onImageSelect = (e) => {
  selectedFile.value = e.target.files[0];
};

// Upload image
const uploadImage = async () => {
  if (!selectedFile.value) return;
  uploadingImage.value = true;
  try {
    const formData = new FormData();
    formData.append('image', selectedFile.value);
    const { data } = await api.post('/api/blog/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    form.value.image = data.url;
    selectedFile.value = null;
    imageInput.value.value = '';
  } catch (err) {
    console.error(err);
    alert('Error uploading image: ' + (err.response?.data?.message || err.message));
  } finally {
    uploadingImage.value = false;
  }
};

// Save post
const savePost = async () => {
  if (!form.value.title) {
    alert('Title is required');
    return;
  }
  saving.value = true;
  try {
    const keywords = form.value.keywordsStr.split(',').map(k => k.trim()).filter(Boolean);
    const payload = {
      title: form.value.title,
      author: form.value.author || 'Admin',
      excerpt: form.value.excerpt,
      keywords,
      image: form.value.image,
      content: form.value.content,
      published: form.value.published,
    };

    if (isEditing.value) {
      await api.put(`/api/blog/${editingId.value}`, payload);
      alert('Post updated successfully');
    } else {
      await api.post('/api/blog', payload);
      alert('Post created successfully');
    }

    resetForm();
    fetchPosts();
  } catch (err) {
    console.error(err);
    alert('Error saving post: ' + (err.response?.data?.message || err.message));
  } finally {
    saving.value = false;
  }
};

// Delete post
const deletePost = async (id) => {
  if (!confirm('Are you sure you want to delete this post?')) return;
  try {
    await api.delete(`/api/blog/${id}`);
    alert('Post deleted');
    fetchPosts();
  } catch (err) {
    console.error(err);
    alert('Error deleting post: ' + (err.response?.data?.message || err.message));
  }
};

// Edit post
const editPost = (post) => {
  form.value = {
    title: post.title,
    author: post.author,
    excerpt: post.excerpt || '',
    keywordsStr: (post.keywords || []).join(', '),
    image: post.image || '',
    content: post.content,
    published: post.published,
  };
  isEditing.value = true;
  editingId.value = post._id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Cancel edit
const cancelEdit = () => {
  resetForm();
};

// Reset form
const resetForm = () => {
  form.value = {
    title: '',
    author: '',
    excerpt: '',
    keywordsStr: '',
    image: '',
    content: '',
    published: false,
  };
  isEditing.value = false;
  editingId.value = null;
  selectedFile.value = null;
};

// Initial fetch
fetchPosts();
</script>

<style scoped>
.blog-manager {
  padding: 2rem 0;
}

.manager-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.form-section h2,
.posts-section h2 {
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #540505;
  box-shadow: 0 0 0 3px rgba(84, 5, 5, 0.1);
}

.form-group.checkbox {
  display: flex;
  align-items: center;
}

.form-group.checkbox input {
  width: auto;
  margin-right: 0.5rem;
}

.image-upload {
  display: flex;
  gap: 1rem;
}

.image-upload input {
  flex: 1;
}

.image-preview {
  margin-top: 1rem;
  max-width: 200px;
}

.image-preview img {
  width: 100%;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #540505;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3a0303;
}

.btn-secondary {
  background-color: #1f2937;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #111827;
}

.btn-outline {
  border: 2px solid #540505;
  background-color: transparent;
  color: #540505;
}

.btn-outline:hover:not(:disabled) {
  background-color: #540505;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.posts-list {
  list-style: none;
  padding: 0;
}

.post-item {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.post-item:last-child {
  border-bottom: none;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
}

.post-header h3 {
  margin: 0;
  color: #1f2937;
}

.date {
  font-size: 0.85rem;
  color: #6b7280;
  white-space: nowrap;
}

.excerpt {
  margin: 0.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #dbeafe;
  color: #1e40af;
  transition: all 0.2s ease;
}

.btn-small:hover {
  background-color: #bfdbfe;
}

.btn-small.btn-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.btn-small.btn-danger:hover {
  background-color: #fecaca;
}

.loading,
.empty {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

@media (max-width: 1200px) {
  .manager-grid {
    grid-template-columns: 1fr;
  }
}
</style>
