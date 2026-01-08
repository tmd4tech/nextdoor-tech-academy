<template>
  <div class="product-card card">
    <div class="product-image">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="product.name"
      />
      <div v-else class="image-placeholder"></div>

      <span class="category-badge">{{ product.category }}</span>
    </div>

    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="brand">{{ product.brand }}</p>
      <p class="description">
        {{ product.description.substring(0, 60) }}...
      </p>

      <div class="product-footer">
        <div class="price-stock">
          <span class="price">GHS {{ product.price }}</span>
          <span
            class="stock"
            :class="product.stock > 0 ? 'in-stock' : 'out-stock'"
          >
            {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
          </span>
        </div>

        <div class="actions">
          <!-- fixed path: /products/:id -->
          <router-link
            :to="`/products/${product.id}`"
            class="btn btn-outline-dark"
          >
            View
          </router-link>

          <button
            class="btn btn-add-cart"
            :disabled="product.stock === 0"
            @click="addToCart"
          >
            {{ product.stock === 0 ? 'Sold Out' : 'Add to Cart' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const cartStore = useCartStore()
const baseURL = import.meta.env.VITE_API_BASE_URL

// build full URL for backend image path
// expect product.image to be like "/uploads/products/filename.jpg"
const imageUrl = computed(() => {
  const img = props.product.image
  if (!img) return ''
  if (typeof img !== 'string') return ''

  // if backend already stored a full URL, just use it
  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img
  }

  // otherwise treat it as a relative path from the backend
  // e.g. "/uploads/products/filename.jpg"
  return `${baseURL}${img}`
})

const addToCart = () => {
  if (props.product.stock === 0) return
  cartStore.addItem({
    ...props.product,
    type: 'product',
  })
  alert(`${props.product.name} added to cart!`)
}
</script>

<style scoped>
.product-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* image */
.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #e5e7eb;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #e5e7eb;
}

.product-card:hover .product-image img {
  transform: scale(1.04);
}

/* category badge */
.category-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #0f172a;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

/* content */
.product-info {
  padding: 0.9rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-info h3 {
  font-size: 1.02rem;
  margin-bottom: 0.25rem;
  color: #111827;
}

.brand {
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.45rem;
}

.description {
  font-size: 0.88rem;
  color: #6b7280;
  margin-bottom: 0.9rem;
  flex: 1;
}

/* footer */
.product-footer {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.price-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.12rem;
  font-weight: 700;
  color: #f97316;
}

.stock {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
}

.in-stock {
  background-color: #dcfce7;
  color: #15803d;
}

.out-stock {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* actions */
.actions {
  display: flex;
  gap: 0.45rem;
}

/* slimmer buttons */
.actions .btn {
  flex: 1;
  font-size: 0.82rem;
  padding: 0.42rem 0.45rem;
  font-weight: 600;
}

/* outline View button – flat, not pill */
.btn-outline-dark {
  border-radius: 0.35rem;
  border: 1px solid #0f172a;
  background: #ffffff;
  color: #0f172a;
  text-align: center;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}

.btn-outline-dark:hover {
  background: #0f172a;
  color: #f9fafb;
}

/* primary Add to Cart button – flat, lighter shadow */
.btn-add-cart {
  border-radius: 0.35rem;
  border: none;
  background: #f97316;
  color: #111827;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
  transition: background 0.15s ease, box-shadow 0.15s ease;
}

.btn-add-cart:hover {
  background: #ea580c;
  box-shadow: 0 7px 18px rgba(249, 115, 22, 0.45);
}

.btn-add-cart:disabled {
  background: #9ca3af;
  color: #f9fafb;
  cursor: not-allowed;
  box-shadow: none;
}

/* responsive tweaks */
@media (max-width: 640px) {
  .price-stock {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
