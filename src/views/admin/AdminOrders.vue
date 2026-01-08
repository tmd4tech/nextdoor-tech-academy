<template>
  <div class="page">
    <header class="page-header">
      <h2>Orders</h2>
    </header>

    <table v-if="orders.length" class="table">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Payment</th>
          <th>Status</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in orders" :key="o.id">
          <!-- show orderNumber if present, otherwise fallback to last 6 of id -->
          <td>#{{ o.orderNumber || String(o.id).slice(-6) }}</td>

          <!-- for now show userId; later you can join with users table -->
          <td>{{ o.userId }}</td>

          <!-- DB column: totalAmount -->
          <td>₵{{ o.totalAmount }}</td>

          <!-- DB column: paymentMethod -->
          <td>{{ o.paymentMethod }}</td>

          <td>
            <select v-model="o.status" @change="changeStatus(o)">
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </td>

          <td>{{ formatDate(o.createdAt) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">No orders yet.</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
const orders = ref([])

const loadOrders = async () => {
  const res = await axios.get(`${baseURL}/api/orders`, {
    withCredentials: true,
  })
  console.log('ADMIN ORDERS', res.data)
  orders.value = res.data
}

onMounted(loadOrders)

const formatDate = v => (v ? new Date(v).toLocaleString() : '')

const changeStatus = async order => {
  try {
    await axios.patch(
      `${baseURL}/api/orders/${order.id}/status`,
      { status: order.status },
      { withCredentials: true },
    )
    // optionally refresh:
    // await loadOrders()
  } catch (err) {
    console.error('Failed to update order status', err)
    alert('Failed to update order status')
  }
}
</script>

<style scoped>
@import './table.css';

select {
  padding: 0.25rem 0.4rem;
  font-size: 0.8rem;
}
</style>
