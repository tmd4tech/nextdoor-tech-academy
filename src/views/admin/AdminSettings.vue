<template>
  <div class="page">
    <header class="page-header">
      <h2>Settings</h2>
    </header>

    <form class="form" @submit.prevent="save">
      <h3>Branding</h3>
      <div class="field">
        <label>Site Name</label>
        <input v-model="settings.siteName" type="text" />
      </div>
      <div class="field">
        <label>Support Email</label>
        <input v-model="settings.supportEmail" type="email" />
      </div>

      <h3>Payments</h3>
      <div class="field">
        <label>Paystack Public Key</label>
        <input v-model="settings.paystackPublicKey" type="text" />
      </div>
      <div class="field">
        <label>Stripe Public Key</label>
        <input v-model="settings.stripePublicKey" type="text" />
      </div>

      <div class="actions">
        <button type="submit" class="btn primary">Save Settings</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
const settings = ref({
  siteName: '',
  supportEmail: '',
  paystackPublicKey: '',
  stripePublicKey: ''
})

onMounted(async () => {
  const res = await axios.get(`${baseURL}/api/admin/settings`)
  settings.value = { ...settings.value, ...res.data }
})

const save = async () => {
  await axios.put(`${baseURL}/api/admin/settings`, settings.value)
}
</script>

<style scoped>
.form{max-width:600px;}
h3{margin:1.2rem 0 0.5rem;font-size:0.95rem;}
.field{margin-bottom:0.9rem;display:flex;flex-direction:column;gap:0.3rem;}
.field label{font-size:0.85rem;color:#e5e7eb;}
.field input{
  background:#020617;border-radius:0.5rem;border:1px solid #1f2937;
  padding:0.55rem 0.6rem;color:#e5e7eb;font-size:0.85rem;
}
.field input:focus{outline:none;border-color:#f97316;}
.actions{margin-top:1rem;}
.btn{border-radius:0.5rem;padding:0.5rem 1rem;font-size:0.82rem;cursor:pointer;border:1px solid transparent;}
.primary{background:#f97316;color:#020617;border-color:#f97316;}
</style>
