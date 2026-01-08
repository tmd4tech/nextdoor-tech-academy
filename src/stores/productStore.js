// src/stores/productStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${baseURL}/api/products`)
        // backend response: { success, message, data: [...], pagination }
        this.products = res.data.data || []
      } catch (err) {
        console.error('Failed to fetch products', err)
        this.error = 'Failed to load products'
        this.products = []
      } finally {
        this.loading = false
      }
    },

    getProductById(id) {
      return this.products.find(p => p.id === id || p.id === String(id))
    },

    getProductsByCategory(category) {
      if (!category || category === 'All') return this.products
      const cat = category.toLowerCase()
      return this.products.filter(
        p => p.category && p.category.toLowerCase().includes(cat),
      )
    },

    filterProducts(filters) {
      let items = [...this.products] // already only active from backend

      // Category
      if (filters.category && filters.category !== 'All') {
        const cat = filters.category.toLowerCase()
        items = items.filter(
          p => p.category && p.category.toLowerCase().includes(cat),
        )
      }

      // Brand (array of selected brands)
      if (filters.brand && filters.brand.length > 0) {
        items = items.filter(p => filters.brand.includes(p.brand))
      }

      // Price range
      if (
        typeof filters.minPrice === 'number' &&
        typeof filters.maxPrice === 'number'
      ) {
        items = items.filter(p => {
          const price = Number(p.price) || 0
          return price >= filters.minPrice && price <= filters.maxPrice
        })
      }

      return items
    },
  },
})
