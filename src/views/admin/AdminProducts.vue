<template>
  <div class="page">
    <header class="page-header">
      <h2>Products</h2>
      <RouterLink class="btn" :to="{ name: 'AdminProductCreate' }">
        + New Product
      </RouterLink>
    </header>

    <table v-if="products.length" class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>SKU</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.sku }}</td>
          <td>₵{{ p.price }}</td>
          <td>{{ p.stock }}</td>
          <!-- FIXED: use isActive from API -->
          <td>{{ p.isActive ? 'Active' : 'Hidden' }}</td>
          <td>
            <RouterLink
              class="link"
              :to="{ name: 'AdminProductEdit', params: { id: p.id } }"
            >
              Edit
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">No products yet.</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
const products = ref([])

const loadProducts = async () => {
  const res = await axios.get(`${baseURL}/api/admin/products`)
  // API returns the raw array of products (with isActive)
  products.value = res.data
}

onMounted(loadProducts)
</script>

<style scoped>
@import './table.css';

.btn {
  background: #f97316;
  color: #020617;
  padding: 0.45rem 0.9rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  text-decoration: none;
  font-weight: 600;
}
.link {
  color: #f97316;
  text-decoration: none;
  font-size: 0.8rem;
}
.link:hover {
  text-decoration: underline;
}
</style>
