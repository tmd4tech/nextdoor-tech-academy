<template>
  <div class="payment-page container">
    <h1>Payment</h1>

    <p>Total: GHS {{ cartStore.total.toFixed(2) }}</p>

    <!-- Simulated Payment Form -->
    <div class="payment-form">
      <label>Card Number</label>
      <input type="text" placeholder="1234 5678 9012 3456" />

      <label>Expiry</label>
      <input type="text" placeholder="MM/YY" />

      <label>CVV</label>
      <input type="text" placeholder="123" />

      <button class="btn btn-primary btn-block" @click="handlePayment">Pay Now</button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

const handlePayment = () => {
  // Simulate payment success
  alert(`Payment successful! Total: GHS ${cartStore.total.toFixed(2)}`)
  cartStore.clearCart()
  router.push('/success')
}
</script>

<style scoped>
.payment-page {
  padding: 2rem;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.payment-form input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
}

.btn-block {
  width: 100%;
  margin-top: 1rem;
}
</style>
