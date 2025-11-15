import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isOpen = ref(false)

  // Count total items including quantities
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const tax = computed(() =>
    Math.round(subtotal.value * 0.15 * 100) / 100
  )

  const total = computed(() =>
    Math.round((subtotal.value + tax.value) * 100) / 100
  )

  const normalizeItem = (item) => ({
    id: item.id || item._id,     // FIX: supports _id or id
    name: item.name,
    image: item.image,
    price: Number(item.price),
  })

  const addItem = (item) => {
    const normalized = normalizeItem(item)

    const existingItem = items.value.find(i => i.id === normalized.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({ ...normalized, quantity: 1 })
    }
  }

  const removeItem = (itemId) => {
    items.value = items.value.filter(i => i.id !== itemId)
  }

  const updateQuantity = (itemId, quantity) => {
    const item = items.value.find(i => i.id === itemId)
    if (!item) return

    if (quantity > 0) {
      item.quantity = quantity
    } else {
      removeItem(itemId)
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const toggleCart = () => { isOpen.value = !isOpen.value }
  const openCart = () => { isOpen.value = true }
  const closeCart = () => { isOpen.value = false }

  // Restore cart
  if (localStorage.getItem('cart')) {
    try {
      items.value = JSON.parse(localStorage.getItem('cart'))
    } catch (err) {
      items.value = []
    }
  }

  // Save cart
  watch(items, (newItems) => {
    localStorage.setItem('cart', JSON.stringify(newItems))
  }, { deep: true })

  return {
    items,
    isOpen,
    itemCount,
    subtotal,
    tax,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart
  }
})
