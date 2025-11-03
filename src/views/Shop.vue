<template>
  <div class="shop">
    <div class="container">
      <h1>Tech Shop</h1>

      <div class="shop-layout">
        <!-- Filters Sidebar -->
        <aside class="filters-sidebar">
          <h3>Filters</h3>

          <!-- Category Filter -->
          <div class="filter-group">
            <label>Category</label>
            <select v-model="filters.category">
              <option value="All">All Products</option>
              <option value="Phones">Phones</option>
              <option value="Laptops">Laptops</option>
              <option value="Accessories">Accessories</option>
              <option value="Repair Tools">Repair Tools</option>
              <option value="Parts">Parts</option>
            </select>
          </div>

          <!-- Brand Filter -->
          <div class="filter-group">
            <label>Brand</label>
            <div class="checkbox-group">
              <label><input type="checkbox" value="Apple" v-model="filters.brand"> Apple</label>
              <label><input type="checkbox" value="Samsung" v-model="filters.brand"> Samsung</label>
              <label><input type="checkbox" value="HP" v-model="filters.brand"> HP</label>
              <label><input type="checkbox" value="Dell" v-model="filters.brand"> Dell</label>
              <label><input type="checkbox" value="Lenovo" v-model="filters.brand"> Lenovo</label>
            </div>
          </div>

          <!-- Price Filter -->
          <div class="filter-group">
            <label>Price Range</label>
            <input type="number" v-model.number="filters.minPrice" placeholder="Min" class="price-input">
            <input type="number" v-model.number="filters.maxPrice" placeholder="Max" class="price-input">
          </div>

          <!-- Sort -->
          <div class="filter-group">
            <label>Sort By</label>
            <select v-model="sortBy">
              <option value="newest">Newest</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="popular">Popular</option>
            </select>
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="products-main">
          <div class="products-header">
            <p>{{ filteredAndSortedProducts.length }} products found</p>
          </div>

          <div v-if="filteredAndSortedProducts.length > 0" class="grid grid-3">
            <ProductCard 
              v-for="product in filteredAndSortedProducts" 
              :key="product.id"
              :product="product"
            />
          </div>

          <div v-else class="no-products">
            <p>No products found matching your filters</p>
            <button @click="resetFilters" class="btn btn-primary">Reset Filters</button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '../stores/productStore'
import ProductCard from '../components/ProductCard.vue'

const productStore = useProductStore()

const filters = ref({
  category: 'All',
  brand: [],
  minPrice: 0,
  maxPrice: 100000
})

const sortBy = ref('newest')

const filteredProducts = computed(() => {
  return productStore.filterProducts(filters.value)
})

const filteredAndSortedProducts = computed(() => {
  let products = [...filteredProducts.value]

  if (sortBy.value === 'price-low') {
    products.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    products.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'newest') {
    products.reverse()
  }

  return products
})

const resetFilters = () => {
  filters.value = {
    category: 'All',
    brand: [],
    minPrice: 0,
    maxPrice: 100000
  }
  sortBy.value = 'newest'
}
</script>

<style scoped>
.shop {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.shop h1 {
  margin-bottom: 2rem;
}

.shop-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.filters-sidebar {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.filters-sidebar h3 {
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.75rem;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--dark-color);
}

.filter-group select,
.price-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-group input {
  margin: 0;
}

.products-main {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
}

.products-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.no-products {
  text-align: center;
  padding: 2rem;
}

.no-products p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .shop-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: relative;
    top: 0;
  }
}
</style>