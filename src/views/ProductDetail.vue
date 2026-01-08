<template>
  <div class="product-detail" v-if="product">
    <div class="container">
      <router-link to="/shop" class="back-link">← Back to Shop</router-link>

      <div class="detail-layout">
        <div class="product-image">
          <img v-if="imageUrl" :src="imageUrl" :alt="product.name" />
          <div v-else class="image-placeholder"></div>
        </div>

        <div class="product-details">
          <span class="category-badge">{{ product.category }}</span>
          <h1>{{ product.name }}</h1>
          <p class="brand">Brand: {{ product.brand }}</p>

          <div class="rating">
            <span>⭐⭐⭐⭐⭐ (120 reviews)</span>
          </div>

          <div class="price-section">
            <span class="price">GHS {{ product.price }}</span>
            <span
              class="stock"
              :class="product.stock > 0 ? 'in-stock' : 'out-stock'"
            >
              {{ product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock' }}
            </span>
          </div>

          <p class="description">{{ product.description }}</p>

          <div class="specifications">
            <h3>Specifications</h3>
            <ul>
              <li v-for="(spec, index) in product.specs" :key="index">
                <strong>•</strong> {{ spec }}
              </li>
            </ul>
          </div>

          <div class="purchase-section">
            <div class="quantity-selector">
              <label>Quantity:</label>
              <div class="quantity-control">
                <button @click="quantity > 1 && quantity--">−</button>
                <input
                  type="number"
                  v-model.number="quantity"
                  min="1"
                  :max="product.stock"
                />
                <button @click="quantity < product.stock && quantity++">+</button>
              </div>
            </div>

            <button
              class="btn btn-primary btn-large"
              :disabled="product.stock === 0"
              @click="addToCart"
            >
              Add to Cart
            </button>
          </div>

          <div class="additional-info">
            <p>✅ 30-day money-back guarantee</p>
            <p>🚚 Free shipping on orders over GHS 5,000</p>
            <p>💬 1-year warranty included</p>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div class="related-products">
        <h2>Related Products</h2>
        <div class="grid grid-4">
          <ProductCard
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            :product="relatedProduct"
          />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container">
    <p>Product not found</p>
    <router-link to="/shop" class="btn btn-primary">Back to Shop</router-link>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import { useCartStore } from '../stores/cartStore'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()
const baseURL = import.meta.env.VITE_API_BASE_URL

const quantity = ref(1)

const product = computed(() => {
  return productStore.getProductById(route.params.id)
})

// build full URL for product.image
const imageUrl = computed(() => {
  if (!product.value || !product.value.image) return ''
  const img = product.value.image
  if (img.startsWith('http')) return img
  return `${baseURL}${img}`
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return productStore.products
    .filter(
      p => p.category === product.value.category && p.id !== product.value.id,
    )
    .slice(0, 4)
})

const addToCart = () => {
  if (product.value) {
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addItem({
        ...product.value,
        type: 'product',
      })
    }
    alert(`${quantity.value} x ${product.value.name} added to cart!`)
    quantity.value = 1
  }
}
</script>

<style scoped>
/* keep all your existing styles, plus placeholder box */
.product-detail {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.product-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 0.75rem;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #e5e7eb;
}

/* ...rest of your existing CSS unchanged... */
</style>

<style scoped>
.product-detail {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--dark-color);
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  background-color: white;
  padding: 2rem;
  border-radius: 0.75rem;
}

.product-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 0.75rem;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.category-badge {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.brand {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.rating {
  margin-bottom: 1rem;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stock {
  padding: 0.35rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.in-stock {
  background-color: #d1fae5;
  color: #065f46;
}

.out-stock {
  background-color: #fee2e2;
  color: #991b1b;
}

.description {
  margin-bottom: 1.5rem;
  line-height: 1.8;
  font-size: 1.05rem;
}

.specifications {
  margin-bottom: 2rem;
}

.specifications h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.specifications ul {
  list-style: none;
}

.specifications li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.specifications strong {
  color: var(--primary-color);
  margin-right: 0.5rem;
}

.purchase-section {
  background-color: var(--light-color);
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.quantity-selector {
  margin-bottom: 1rem;
}

.quantity-selector label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  width: fit-content;
}

.quantity-control button {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-weight: 700;
  color: var(--primary-color);
}

.quantity-control input {
  width: 50px;
  border: none;
  text-align: center;
  font-weight: 600;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
}

.quantity-control input:focus {
  outline: none;
}

.btn-large {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

.additional-info {
  background-color: #e0f2fe;
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-top: 1.5rem;
}

.additional-info p {
  margin-bottom: 0.5rem;
  color: #0369a1;
  font-weight: 500;
}

.related-products {
  margin-top: 3rem;
}

.related-products h2 {
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .detail-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .product-details h1 {
    font-size: 1.5rem;
  }

  .price {
    font-size: 1.5rem;
  }
}
</style>