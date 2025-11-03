<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <!-- Brand -->
      <router-link to="/" class="logo">
        <span class="logo-icon">💻</span>
        <span class="logo-text">Nextdoor Tech</span>
      </router-link>

      <!-- Nav links -->
      <ul class="nav-links" :class="{ active: menuOpen }">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/shop">Shop</router-link></li>
        <li><router-link to="/courses">Courses</router-link></li>
        <li><router-link to="/blog">Blog</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>

      <!-- Actions -->
      <div class="nav-actions">
        <button class="cart-button" @click="cartStore.openCart" aria-label="Open cart">
          🛒
          <span class="cart-count" v-if="cartStore.itemCount > 0">{{ cartStore.itemCount }}</span>
        </button>

        <div v-if="authStore.isLoggedIn" class="user-menu">
          <button @click="toggleUserMenu" class="user-toggle">
            👤 {{ authStore.user.fullName }}
          </button>
          <div class="dropdown" v-if="showUserMenu">
            <router-link to="/dashboard">Dashboard</router-link>
            <a href="#" @click.prevent="authStore.logout">Logout</a>
          </div>
        </div>

        <router-link v-else to="/login" class="btn login-pill">Login</router-link>

        <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'

const cartStore = useCartStore()
const authStore = useAuthStore()

const menuOpen = ref(false)
const showUserMenu = ref(false)

const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const toggleUserMenu = () => { showUserMenu.value = !showUserMenu.value }
</script>

<style scoped>
/* Base theme variables */
:root {
  --primary-color: #007bff;
  --text-color: #333;
  --dark-color: #111;
  --light-color: #f7f9fc;
  --border-color: #e0e0e0;
  --danger-color: #ff4b5c;
}

/* Navbar base */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
}

/* Layout */
.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--primary-color);
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: -0.3px;
  transition: color 0.3s;
}
.logo:hover {
  color: var(--dark-color);
}
.logo-icon {
  font-size: 1.5rem;
}

/* Nav links */
.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}
.nav-links a {
  position: relative;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s ease;
}
.nav-links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0%;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}
.nav-links a:hover {
  color: var(--primary-color);
}
.nav-links a:hover::after {
  width: 100%;
}

/* Actions (Cart, Login, Menu) */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.cart-button {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
}
.cart-button:hover {
  transform: scale(1.1);
}
.cart-count {
  position: absolute;
  top: -6px;
  right: -8px;
  background-color: var(--danger-color);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}

.btn.login-pill {
  background: var(--primary-color);
  color: white;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s;
}
.btn.login-pill:hover {
  background: #020114;
}

/* User menu */
.user-menu {
  position: relative;
}
.user-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: var(--dark-color);
  transition: color 0.3s;
}
.user-toggle:hover {
  color: var(--primary-color);
}
.dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  min-width: 180px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.dropdown a {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
}
.dropdown a:hover {
  background: var(--light-color);
  color: var(--primary-color);
}

/* Burger menu */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: background 0.3s;
}
.menu-toggle:hover {
  background: var(--light-color);
}
.menu-toggle span {
  width: 22px;
  height: 2px;
  background: var(--dark-color);
  border-radius: 2px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    animation: slideDown 0.3s ease forwards;
  }
  .nav-links.active {
    display: flex;
  }

  .menu-toggle {
    display: flex;
  }

  .navbar-content {
    padding: 0.8rem 1rem;
  }

  .nav-actions {
    gap: 0.5rem;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>