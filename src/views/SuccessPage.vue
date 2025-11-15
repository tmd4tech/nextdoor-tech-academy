<template>
  <div class="success-page container">
    <h1>🎉 Payment Successful!</h1>
    <p>Thank you for your purchase. Your order has been completed successfully.</p>
    <router-link to="/shop" class="btn btn-primary">Continue Shopping</router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.success-page {
  padding: 2rem;
  text-align: center;
}

.success-page h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.btn {
  margin-top: 1.5rem;
}
</style>
