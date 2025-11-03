<template>
  <div class="product-card card">
    <div class="product-image">
      <img :src="`https://via.placeholder.com/300x200?text=${product.name}`" :alt="product.name">
      <span class="category-badge">{{ product.category }}</span>
    </div>

    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="brand">{{ product.brand }}</p>
      <p class="description">{{ product.description.substring(0, 60) }}...</p>

      <div class="product-footer">
        <div class="price-stock">
          <span class="price">GHS {{ product.price }}</span>
          <span class="stock" :class="product.stock > 0 ? 'in-stock' : 'out-stock'">
            {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
          </span>
        </div>

        <div class="actions">
          <router-link :to="`/product/${product.id}`" class="btn btn-outline">View</router-link>
          <button 
            class="btn btn-primary" 
            :disabled="product.stock === 0"
            @click="addToCart"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useCartStore } from '../stores/cartStore'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const addToCart = () => {
  cartStore.addItem({
    ...props.product,
    type: 'product'
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

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.product-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.brand {
  color: var(--primary-color);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1rem;
  flex: 1;
}

.product-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stock {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.in-stock {
  background-color: #d1fae5;
  color: #065f46;
}

.out-stock {
  background-color: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.actions .btn {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.9rem;
}
</style>