<template>
  <div class="checkout">
    <div class="container">
      <h1>Checkout</h1>

      <div class="checkout-layout">
        <!-- Order summary -->
        <section class="card summary" v-if="items.length">
          <h2>Order Summary</h2>
          <div class="summary-items">
            <div
              v-for="item in items"
              :key="item.id + '-' + item.type"
              class="summary-item"
            >
              <div>
                <p class="title">{{ item.name }}</p>
                <p class="meta">
                  <span v-if="item.type === 'product'">
                    {{ item.brand }} • {{ item.category }}
                  </span>
                  <span v-else>
                    {{ item.instructor }}
                  </span>
                </p>
              </div>
              <p class="price">GHS {{ item.price }}</p>
            </div>
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span class="total-amount">GHS {{ total }}</span>
          </div>
        </section>

        <!-- Checkout form -->
        <section class="card form-card">
          <h2>Billing Details</h2>
          <form @submit.prevent="placeOrder">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="form.fullName" type="text" required />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input v-model="form.email" type="email" required />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input v-model="form.phone" type="tel" required />
            </div>

            <div class="form-group">
              <label>Payment Method</label>
              <select v-model="form.paymentMethod" required>
                <option value="momo">Mobile Money</option>
                <option value="card">Debit / Credit Card</option>
                <option value="cash">Pay on Delivery</option>
              </select>
            </div>

            <button
              type="submit"
              class="btn btn-primary submit-btn"
              :disabled="!items.length"
            >
              Confirm & Pay
            </button>

            <p v-if="!items.length" class="hint">
              Your cart is empty. Add items from the shop or courses page.
            </p>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const items = computed(() => cartStore.items || [])
const total = computed(() =>
  items.value.reduce((sum, item) => sum + Number(item.price || 0), 0)
)

const form = reactive({
  fullName: authStore.user?.fullName || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  paymentMethod: 'momo'
})

const placeOrder = () => {
  if (!items.value.length) return

  // TODO: call backend here if you have an orders API

  // Simple client-side order id (OrderConfirmation also creates one,
  // this is just to match your /order-confirmation/:orderId route)
  const orderId = Date.now()

  // Navigate to OrderConfirmation.vue
  router.push(`/order-confirmation/${orderId}`)
}
</script>

<style scoped>
.checkout {
  padding: 2.5rem 0 3rem;
  min-height: calc(100vh - 200px);
}

.checkout h1 {
  margin-bottom: 1.5rem;
}

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.9fr);
  gap: 1.75rem;
}

/* summary */
.summary {
  padding: 1.6rem 1.5rem;
}

.summary h2 {
  margin-bottom: 1rem;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
}

.summary-item .title {
  font-weight: 600;
  margin-bottom: 0.15rem;
}

.summary-item .meta {
  color: #6b7280;
  font-size: 0.85rem;
}

.summary-item .price {
  font-weight: 600;
  color: #111827;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--card-border);
  font-weight: 700;
}

.total-amount {
  color: #f97316;
}

/* form */
.form-card {
  padding: 1.6rem 1.5rem;
}

.form-card h2 {
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.7rem 0.85rem;
  border-radius: 0.55rem;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.25);
}

.submit-btn {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.8rem;
}

.hint {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #6b7280;
}

/* responsive */
@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
</style>
