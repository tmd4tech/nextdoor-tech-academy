<template>
  <div class="cart-overlay" v-if="cartStore.isOpen" @click="cartStore.closeCart">
    <div class="cart-sidebar" @click.stop>
      <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="close-btn" @click="cartStore.closeCart">✕</button>
      </div>

      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <p>Your cart is empty</p>
        <router-link to="/shop" class="btn btn-primary" @click="cartStore.closeCart">Continue Shopping</router-link>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <CartItem 
            v-for="item in cartStore.items" 
            :key="`${item.id}-${item.type}`"
            :item="item"
          />
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>GHS {{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Tax (15%):</span>
            <span>GHS {{ cartStore.tax.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>GHS {{ cartStore.total.toFixed(2) }}</span>
          </div>

          <router-link to="/checkout" class="btn btn-primary btn-block" @click="cartStore.closeCart">
            Proceed to Checkout
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore'
import CartItem from './CartItem.vue'

const cartStore = useCartStore()
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.cart-sidebar {
  width: 100%;
  max-width: 400px;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.cart-header h2 {
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
}

.empty-cart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
}

.cart-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-summary {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  background-color: var(--light-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.btn-block {
  width: 100%;
}

@media (max-width: 768px) {
  .cart-sidebar {
    max-width: 100%;
  }
}
</style>