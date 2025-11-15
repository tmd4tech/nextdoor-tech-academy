<template>
  <div class="auth-container">
    <h2>Forgot Password</h2>
    <p>Enter your email to receive a password reset link.</p>

    <form @submit.prevent="handleSubmit">
      <input
        type="email"
        v-model="email"
        placeholder="Enter your email"
        required
      />
      <button type="submit" :disabled="loading">
        {{ loading ? "Sending..." : "Send Reset Link" }}
      </button>
    </form>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <router-link to="/login">Back to Login</router-link>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/authStore";

const auth = useAuthStore();
const email = ref("");
const message = ref("");

const loading = computed(() => auth.loading);
const error = computed(() => auth.error);

const handleSubmit = async () => {
  const response = await auth.forgotPassword(email.value);
  if (response && typeof response === "string") {
    message.value = response;
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  background: #1d4ed8;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}
.success {
  color: green;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
