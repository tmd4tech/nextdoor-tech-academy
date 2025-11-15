// src/stores/authStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_URL; // this is just the base
const API_BASE = `${API_ROOT}/api/auth`;   

export const useAuthStore = defineStore("auth", () => {
  // --------------------
  // State
  const storedUser = localStorage.getItem("user");
  const user = ref(storedUser ? JSON.parse(storedUser) : null);
  const storedToken = localStorage.getItem("token");
  const token = ref(storedToken ? storedToken : null);
  const loading = ref(false);
  const error = ref(null);
  const initialized = ref(false);

  const isLoggedIn = computed(() => !!token.value);

  // --------------------
  // Setup Axios default header for token
  if (token.value) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  }

  // --------------------
  // Helper: Save auth to state + localStorage + Axios
  const saveAuth = (userData, tokenData) => {
    user.value = userData;
    token.value = tokenData;
    localStorage.setItem("user", JSON.stringify(user.value));
    localStorage.setItem("token", token.value);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  };

  // --------------------
  // Logout
  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  // --------------------
  // Login
const login = async (email, password) => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await axios.post(`${API_BASE}/login`, { email, password });
    saveAuth(data.user, data.token);
    return true;
  } catch (err) {
    error.value = err.response?.data?.message || "Invalid email or password";
    return false;
  } finally {
    loading.value = false;
  }
};

  // --------------------
  // Register
const register = async (fullName, email, phone, password) => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await axios.post(`${API_BASE}/register`, { fullName, email, phone, password });
    saveAuth(data.user, data.token);
    return true;
  } catch (err) {
    error.value = err.response?.data?.message || "Registration failed";
    return false;
  } finally {
    loading.value = false;
  }
};

  // --------------------
  // Social login (Google / Facebook)
 const socialLogin = async (tokenFromProvider) => {
  if (!tokenFromProvider) return false;
  try {
    localStorage.setItem("token", tokenFromProvider);
    token.value = tokenFromProvider;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;

    const { data } = await axios.get(`${API_BASE}/me`);
    user.value = data;
    localStorage.setItem("user", JSON.stringify(data));

    return true;
  } catch (err) {
    error.value = err.response?.data?.message || "Social login failed";
    return false;
  }
};

  // --------------------
  // Update profile
const updateProfile = async (updates) => {
  if (!token.value) return false;
  loading.value = true;
  error.value = null;
  try {
    const { data } = await axios.put(`${API_BASE}/profile`, updates, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    user.value = data.user;
    localStorage.setItem("user", JSON.stringify(user.value));
    return true;
  } catch (err) {
    error.value = err.response?.data?.message || "Profile update failed";
    return false;
  } finally {
    loading.value = false;
  }
};

  // --------------------
// Forgot password
const forgotPassword = async (email) => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await axios.post(`${API_BASE}/forgot-password`, { email });
    return data.message;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to send reset link";
    return null;
  } finally {
    loading.value = false;
  }
};

// --------------------
// Reset password
const resetPassword = async (tokenParam, password) => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await axios.put(`${API_BASE}/reset-password/${tokenParam}`, { password });
    return data.message;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to reset password";
    return null;
  } finally {
    loading.value = false;
  }
};

  // --------------------
  // Load user from localStorage on app startup
const initializeAuth = async () => {
  if (token.value) {
    try {
      const { data } = await axios.get(`${API_BASE}/me`);
      user.value = data;
      initialized.value = true;
      return true;
    } catch (err) {
      console.error("Token invalid, logging out");
      logout();
      initialized.value = true;
      return false;
    }
  }
  initialized.value = true;
  return false;
};

  return {
    user,
    token,
    loading,
    error,
    isLoggedIn,
    login,
    logout,
    register,
    socialLogin,
    updateProfile,
    forgotPassword,
    resetPassword,
    initializeAuth,
    initialized,
  };
});
