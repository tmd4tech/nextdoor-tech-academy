// stores/blogStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'VITE_API_URL=https://next-door-backend.onrender.com';
const API_BASE = `${API_ROOT}/api/blog`;

export const useBlogStore = defineStore('blog', () => {
  const posts = ref([]);
  const post = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Fetch all posts
  const fetchPosts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get(API_BASE);
      posts.value = data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  // Fetch single post by ID
  const fetchPostById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get(`${API_BASE}/${id}`);
      post.value = data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  // Create a new post
  const createPost = async (postData, token) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.post(API_BASE, postData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      posts.value.push(data);
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  // Update post by ID
  const updatePost = async (id, postData, token) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.put(`${API_BASE}/${id}`, postData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const index = posts.value.findIndex((p) => p._id === id);
      if (index !== -1) posts.value[index] = data;
      if (post.value && post.value._id === id) post.value = data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  // Delete post by ID
  const deletePost = async (id, token) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      posts.value = posts.value.filter((p) => p._id !== id);
      if (post.value && post.value._id === id) post.value = null;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    posts,
    post,
    loading,
    error,
    fetchPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost
  };
});
