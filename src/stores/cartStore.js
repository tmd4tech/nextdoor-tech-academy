import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isOpen = ref(false)

  const itemCount = computed(() => items.value.length)

  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const tax = computed(() => {
    return Math.round(subtotal.value * 0.15 * 100) / 100 // 15% tax
  })

  const total = computed(() => {
    return Math.round((subtotal.value + tax.value) * 100) / 100
  })

  const addItem = (item) => {
    const existingItem = items.value.find(i => i.id === item.id && i.type === item.type)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        ...item,
        quantity: 1
      })
    }
  }

  const removeItem = (itemId, itemType) => {
    items.value = items.value.filter(i => !(i.id === itemId && i.type === itemType))
  }

  const updateQuantity = (itemId, itemType, quantity) => {
    const item = items.value.find(i => i.id === itemId && i.type === itemType)
    if (item && quantity > 0) {
      item.quantity = quantity
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  const openCart = () => {
    isOpen.value = true
  }

  const closeCart = () => {
    isOpen.value = false
  }

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