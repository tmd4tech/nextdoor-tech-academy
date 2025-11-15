import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './authStore'

const API_BASE = (import.meta.env.VITE_API_URL || 'VITE_API_URL=https://next-door-backend.onrender.com') + '/api'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Helper to get admin token
  const getToken = () => {
    // Try auth store first, then localStorage as fallback
    try {
      const authStore = useAuthStore()
      if (authStore.token) return authStore.token
    } catch (e) {
      // Store not initialized yet; try localStorage
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Admin token missing — please log in as admin')
    }
    return token
  }

  // Fetch all products
const fetchProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await axios.get(`${API_BASE}/products`) // no admin token
    products.value = data
  } catch (err) {
    error.value = err.response?.data?.message || err.message
    console.error('Error fetching products:', error.value)
  } finally {
    loading.value = false
  }
}


  // Filter products
  const filterProducts = (filters) => {
    return products.value.filter(p => {
      const categoryMatch = filters.category === 'All' || p.category === filters.category
      const brandMatch = filters.brand.length === 0 || filters.brand.includes(p.brand)
      const priceMatch = p.price >= filters.minPrice && p.price <= filters.maxPrice
      return categoryMatch && brandMatch && priceMatch
    })
  }

  // Add a new product
  const addProduct = async (product) => {
    try {
      const token = getToken()
      const formData = new FormData()
      Object.entries(product).forEach(([key, value]) => {
        if (key === 'image' && value) formData.append('image', value)
        else formData.append(key, value)
      })
      const { data } = await axios.post(`${API_BASE}/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      })
      products.value.push(data)
      return data
    } catch (err) {
      error.value = err.message || (err.response?.data?.message || 'Error adding product')
      console.error('Error adding product:', error.value)
      throw err
    }
  }

  // Update product
  const updateProduct = async (product) => {
    try {
      const token = getToken()
      const formData = new FormData()
      Object.entries(product).forEach(([key, value]) => {
        if (key === 'image' && value) formData.append('image', value)
        else formData.append(key, value)
      })
      const { data } = await axios.put(`${API_BASE}/products/${product._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      })
      const index = products.value.findIndex(p => p._id === product._id)
      if (index !== -1) products.value[index] = data
      return data
    } catch (err) {
      error.value = err.message || (err.response?.data?.message || 'Error updating product')
      console.error('Error updating product:', error.value)
      throw err
    }
  }

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const token = getToken()
      await axios.delete(`${API_BASE}/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      products.value = products.value.filter(p => p._id !== id)
    } catch (err) {
      error.value = err.message || (err.response?.data?.message || 'Error deleting product')
      console.error('Error deleting product:', error.value)
      throw err
    }
  }

  // Get a single product by ID
  const getProductById = (id) => products.value.find(p => p._id === id)

  // ✅ Return everything at the end
  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    filterProducts
  }
})
