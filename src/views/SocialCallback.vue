<template>
  <div class="social-callback">
    <p>Signing you in…</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  const token = route.query.token

  // If the auth flow opened a popup, post the token to the opener and close
  if (window.opener && token) {
    try {
      window.opener.postMessage({ token }, window.location.origin)
    } catch (e) {
      // ignore
    }
    window.close()
    return
  }

  // Otherwise, perform a direct login and redirect
  if (token) {
    await auth.socialLogin(token)
    const redirect = auth.user?.isAdmin ? '/admin' : '/dashboard'
    router.replace(redirect)
  } else {
    // No token — send user to login
    router.replace('/login')
  }
})
</script>

<style scoped>
.social-callback { display:flex; align-items:center; justify-content:center; min-height:60vh }
</style>
