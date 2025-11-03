<template>
  <div class="order-confirmation">
    <div class="container">
      <div class="card header">
        <h1>Thank you for your order!</h1>
        <p>Your order <strong>#{{ orderNumber }}</strong> has been received and is being processed.</p>
      </div>

      <div class="grid">
        <section class="card">
          <h2>Order summary</h2>
          <ul class="items">
            <li v-for="it in items" :key="`${it.type}-${it.id}`" class="item">
              <div class="left">
                <div class="name">{{ it.name }}</div>
                <div class="meta">{{ it.type === 'course' ? 'Course' : `${it.brand} • ${it.category}` }}</div>
              </div>
              <div class="right">
                <span class="qty">× {{ it.quantity }}</span>
                <span class="price">GHS {{ (it.price * it.quantity).toFixed(2) }}</span>
              </div>
            </li>
          </ul>

          <div class="totals">
            <div class="row"><span>Subtotal</span><span>GHS {{ subtotal.toFixed(2) }}</span></div>
            <div class="row"><span>Tax (15%)</span><span>GHS {{ tax.toFixed(2) }}</span></div>
            <div class="row total"><span>Total</span><span>GHS {{ total.toFixed(2) }}</span></div>
          </div>
        </section>

        <aside class="card info">
          <h3>What’s next?</h3>
          <ul class="next-steps">
            <li>Confirmation email will arrive shortly.</li>
            <li>Courses unlock immediately in your dashboard.</li>
            <li>Products ship per your selected option.</li>
          </ul>

          <div class="actions">
            <router-link class="btn btn-primary" to="/dashboard">Go to Dashboard</router-link>
            <router-link class="btn" to="/shop">Continue Shopping</router-link>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from '../stores/cartStore'

const cart = useCartStore()

// Snapshot items & totals at confirmation time
const items = ref([])
const subtotal = ref(0)
const tax = ref(0)
const total = ref(0)
const orderNumber = ref('')

onMounted(() => {
  // Create a simple order number (timestamp-based)
  orderNumber.value = String(Date.now()).slice(-8)

  // Snapshot current cart content & totals
  items.value = cart.items.map(i => ({ ...i }))
  subtotal.value = cart.subtotal
  tax.value = cart.tax
  total.value = cart.total

  // Clear the cart so reloading this page doesn't duplicate orders
  cart.clearCart()
})
</script>

<style scoped>
.order-confirmation { padding: 2rem 0; }
.header h1 { margin-bottom: .25rem; }
.grid { display: grid; grid-template-columns: 1fr 360px; gap: 1.5rem; margin-top: 1rem; }

.items { list-style: none; padding: 0; margin: 0; }
.item { display: grid; grid-template-columns: 1fr auto; gap: 1rem; padding: .85rem 0; border-bottom: 1px solid var(--border-color); }
.left .name { font-weight: 600; }
.left .meta { color: #6b7280; font-size: .9rem; margin-top: .2rem; }
.right { display: flex; gap: .75rem; align-items: center; }
.qty { color: #6b7280; }
.price { font-weight: 700; color: var(--primary-color); }

.totals { margin-top: 1rem; }
.row { display: flex; justify-content: space-between; padding: .35rem 0; }
.total { font-weight: 700; border-top: 1px solid var(--border-color); margin-top: .35rem; padding-top: .5rem; }

.info h3 { margin-bottom: .75rem; }
.next-steps { padding-left: 1.1rem; }
.actions { display: flex; gap: .75rem; margin-top: 1rem; flex-wrap: wrap; }

@media (max-width: 920px) { .grid { grid-template-columns: 1fr; } }
</style>
