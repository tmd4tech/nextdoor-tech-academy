<template>
  <div class="cart-item">
    <img :src="`https://via.placeholder.com/60x60?text=${item.name}`" :alt="item.name" class="item-image">

    <div class="item-details">
      <h4>{{ item.name }}</h4>
      <p class="item-type">{{ item.type === 'course' ? '📚 Course' : '📱 Product' }}</p>
      <p class="item-price">GHS {{ item.price }}</p>
    </div>

    <div class="item-controls">
      <button @click="decreaseQuantity">−</button>
      <input type="number" v-model.number="item.quantity" min="1" @change="updateQuantity">
      <button @click="increaseQuantity">+</button>
    </div>

    <button class="remove-btn" @click="removeItem">🗑️</button>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    cartStore.updateQuantity(props.item.id, props.item.type, props.item.quantity - 1)
  }
}

const increaseQuantity = () => {
  cartStore.updateQuantity(props.item.id, props.item.type, props.item.quantity + 1)
}

const updateQuantity = () => {
  if (props.item.quantity < 1) {
    props.item.quantity = 1
  }
}

const removeItem = () => {
  cartStore.removeItem(props.item.id, props.item.type)
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  border: 1px solid var(--border-color);
  align-items: center;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  object-fit: cover;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.item-type {
  font-size: 0.8rem;
  color: var(--primary-color);
  font-weight: 600;
}

.item-price {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary-color);
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  padding: 0.25rem;
}

.item-controls button {
  background: none;
  border: none;
  cursor: pointer;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--primary-color);
}

.item-controls input {
  width: 40px;
  border: none;
  text-align: center;
  font-weight: 600;
}

.item-controls input:focus {
  outline: none;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  flex-shrink: 0;
  transition: opacity 0.3s ease;
}

.remove-btn:hover {
  opacity: 0.6;
}
</style>