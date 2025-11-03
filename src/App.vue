<template>
  <div id="app" class="app-container">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
    <CartSidebar />
    <Footer />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import CartSidebar from './components/CartSidebar.vue'
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
}
</style>