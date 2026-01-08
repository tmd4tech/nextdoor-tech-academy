<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <!-- Brand -->
      <router-link to="/" class="logo" @click="handleHomeClick">
        <!-- <span class="logo-icon"></span> -->
        <span class="logo-text">Nextdoor Tech Academy</span>
      </router-link>

      <!-- Nav links -->
      <ul class="nav-links" :class="{ active: menuOpen }">
        <li><router-link to="/" @click="handleNavClick">Home</router-link></li>
        <li><router-link to="/shop" @click="closeMenu">Shop</router-link></li>
        <li><router-link to="/courses" @click="closeMenu">Courses</router-link></li>
        <li><router-link to="/blog" @click="closeMenu">Blog</router-link></li>
        <li><router-link to="/contact" @click="closeMenu">Contact</router-link></li>
      </ul>

      <!-- Actions -->
      <div class="nav-actions">
        <button
          class="cart-button"
          @click="cartStore.openCart"
          aria-label="Open cart"
        >
          🛒
          <span class="cart-count" v-if="cartStore.itemCount > 0">
            {{ cartStore.itemCount }}
          </span>
        </button>

        <div v-if="authStore.isLoggedIn" class="user-menu">
          <button @click="toggleUserMenu" class="user-toggle">
            <span class="user-icon">👤</span>
            <span class="user-name">{{ authStore.user.fullName }}</span>
          </button>
          <div class="dropdown" v-if="showUserMenu">
            <router-link to="/dashboard" @click="closeUserMenu">
              Dashboard
            </router-link>
            <a href="#" @click.prevent="handleLogout">Logout</a>
          </div>
        </div>

        <router-link v-else to="/login" class="btn login-pill">
          Login
        </router-link>

        <button
          class="menu-toggle"
          :class="{ active: menuOpen }"
          @click="toggleMenu"
          aria-label="Toggle menu"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
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

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    showUserMenu.value = false
  }
}

const closeMenu = () => {
  menuOpen.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
  closeMenu()
}

const handleHomeClick = () => {
  cartStore.closeCart?.()
  closeMenu()
}

const handleNavClick = () => {
  cartStore.closeCart?.()
  closeMenu()
}

const handleLogout = () => {
  authStore.logout()
  closeUserMenu()
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #0f172a;
  color: #f9fafb;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.6);
}

/* Layout */
.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: #f9fafb;
  font-weight: 700;
  font-size: 1rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 0.4rem;
  background: linear-gradient(135deg, #1d4ed8, #38bdf8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.logo-text {
  white-space: nowrap;
}

/* Nav links */
.nav-links {
  display: flex;
  list-style: none;
  gap: 1.75rem;
  flex: 1;
  justify-content: center;
  margin: 0;
  padding: 0;
}

.nav-links li {
  margin: 0;
}

.nav-links a {
  position: relative;
  text-decoration: none;
  color: #e5e7eb;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.4rem 0;
  transition: color 0.2s ease;
}

.nav-links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0;
  height: 2px;
  background-color: #f97316;
  transition: width 0.2s ease;
}

.nav-links a:hover {
  color: #ffffff;
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  width: 100%;
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Cart */
.cart-button {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  position: relative;
  padding: 0.3rem;
  color: #e5e7eb;
  transition: transform 0.15s ease, color 0.15s ease;
}

.cart-button:hover {
  transform: scale(1.1);
  color: #ffffff;
}

.cart-count {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  border-radius: 999px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0 4px;
}

/* Login pill */
.btn.login-pill {
  background: #f97316;
  color: #111827;
  padding: 0.45rem 1.3rem;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.9rem;
  border: none;
  transition: background 0.2s ease, transform 0.15s ease,
    box-shadow 0.15s ease;
}

.btn.login-pill:hover {
  background: #ea580c;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(249, 115, 22, 0.4);
}

/* User menu */
.user-menu {
  position: relative;
}

.user-toggle {
  background: #0b1120;
  border: 1px solid rgba(148, 163, 184, 0.7);
  cursor: pointer;
  font-weight: 500;
  color: #e5e7eb;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.user-toggle:hover {
  border-color: #f97316;
  color: #ffffff;
}

.user-icon {
  font-size: 1rem;
}

/* Dropdown */
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border-radius: 0.75rem;
  min-width: 180px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.35);
  overflow: hidden;
}

.dropdown a {
  display: block;
  padding: 0.8rem 1rem;
  color: #111827;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.15s ease, padding-left 0.15s ease;
}

.dropdown a:hover {
  background: #f3f4f6;
  padding-left: 1.2rem;
}

/* Hamburger menu */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px solid rgba(148, 163, 184, 0.6);
  border-radius: 8px;
  padding: 7px 9px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease,
    transform 0.1s ease;
  width: 40px;
  height: 40px;
}

.menu-toggle:hover {
  background: #020617;
  border-color: #f97316;
}

.menu-toggle:active {
  transform: scale(0.96);
}

.hamburger-line {
  width: 22px;
  height: 2px;
  background: #e5e7eb;
  border-radius: 2px;
  transition: all 0.25s ease;
  transform-origin: center;
}

.menu-toggle.active .hamburger-line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}
.menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.menu-toggle.active .hamburger-line:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* Responsive */
@media (max-width: 992px) {
  .navbar-content {
    padding: 0.7rem 1rem;
  }
  .nav-links {
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #0b1120;
    flex-direction: column;
    align-items: center;
    padding: 1.2rem 0 1.4rem;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.7);
  }
  .nav-links.active {
    display: flex;
  }
  .nav-links a {
    width: 100%;
    text-align: center;
    padding: 0.9rem 0;
  }
  .nav-links a::after {
    left: 50%;
    transform: translateX(-50%);
    bottom: 4px;
  }

  .menu-toggle {
    display: flex;
  }

  .nav-actions {
    gap: 0.5rem;
  }
  .logo-text {
    font-size: 0.95rem;
  }
  .user-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
  .btn.login-pill {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }
  .cart-button {
    font-size: 1.25rem;
  }
}
</style>
