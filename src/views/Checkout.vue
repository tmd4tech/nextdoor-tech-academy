<template>
  <div class="checkout-page">
    <div class="container">
      <h1>Checkout</h1>

      <div class="grid">
        <!-- LEFT: Items -->
        <section class="card items">
          <h2>Your Items</h2>
          <ul>
            <li v-for="item in cart.items" :key="item.id" class="item">
              <div class="left">
                <div class="name">{{ item.name }}</div>
                <div class="meta">Qty: {{ item.quantity }}</div>
              </div>
              <div class="right">
                ₦{{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </li>
          </ul>
        </section>

        <!-- RIGHT: Summary -->
        <aside class="card summary">
          <h2>Summary</h2>
          <div class="row"><span>Subtotal</span><span>₦{{ cart.subtotal.toFixed(2) }}</span></div>
          <div class="row"><span>Tax (15%)</span><span>₦{{ cart.tax.toFixed(2) }}</span></div>
          <div class="row total"><span>Total</span><span>₦{{ cart.total.toFixed(2) }}</span></div>

          <button class="btn btn-primary pay-btn" @click="payNow" :disabled="loading">
            {{ loading ? "Processing..." : "Pay with Paystack" }}
          </button>

          <p class="note">Using Paystack Test Mode</p>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useCartStore } from "../stores/cartStore"
import { useStudentStore } from "../stores/studentStore"
import axios from "axios"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/authStore"

const cart = useCartStore()
const auth = useAuthStore()
const studentStore = useStudentStore()
const loading = ref(false)
const router = useRouter()

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_b417dfecf191ef3e208ea705abd6e487eb845789"
const API_BASE = import.meta.env.VITE_API_URL || "VITE_API_URL=https://next-door-backend.onrender.com";

// Convert cart items to payment format
const getCartItems = () => {
  return cart.items.map(item => ({
    itemId: item._id || item.id,
    type: item.type || 'product', // 'product' or 'course'
    name: item.name,
    price: item.price,
    quantity: item.quantity || 1
  }));
};

const payNow = () => {
  if (!cart.items.length) {
    alert("Your cart is empty.")
    return
  }

  loading.value = true

  if (!window.PaystackPop) {
    alert("Paystack script not loaded yet")
    loading.value = false
    return
  }

  const amountKobo = Math.round(Number(cart.total || 0) * 100)

  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: auth.user?.email || "testuser@example.com",
    amount: amountKobo,
    currency: "NGN",
    ref: "PAY-" + Date.now(),

    // Use a plain function for `callback` (some inline validators reject async fn types).
callback: function(response) {
  (async () => {
    try {
      const verify = await axios.post(`${API_BASE}/api/verify-payment`, { 
        reference: response.reference,
        items: getCartItems(),
        email: auth.user?.email,
        amount: cart.total
      }, { headers: { Authorization: `Bearer ${auth.token}` } });

      if (verify.data.status === "success" && verify.data.enrolledCourses?.length) {
        for (const course of verify.data.enrolledCourses) {
          await axios.post(`${API_BASE}/student/enroll-after-payment`, 
            { courseId: course._id }, 
            { headers: { Authorization: `Bearer ${auth.token}` } }
          );
        }

        await studentStore.fetchDashboard();
        cart.clearCart();
        alert(`✓ Payment successful! You have been enrolled in ${verify.data.enrolledCourses.length} course(s). Redirecting to dashboard...`);
        router.push("/dashboard");
      } else {
        alert("Payment verification failed: " + (verify.data.message || "Unknown error"));
        loading.value = false;
      }
    } catch (err) {
      console.error('Payment verify error:', err);
      const msg = err?.response?.data?.message || 'Error verifying payment';
      alert(msg);
      loading.value = false;
    }
  })();
}

,

    onClose: function() {
      loading.value = false
      alert("Payment cancelled")
    }
  })
  

  handler.openIframe()
}

</script>

<style scoped>
.checkout-page { padding: 2rem 0; }
.grid { display: grid; grid-template-columns: 1fr 350px; gap: 1.5rem; margin-top: 1.5rem; }

.card {
  background: white;
  padding: 1.2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.items ul { padding: 0; list-style: none; }

.item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: .75rem 0;
}

.name { font-weight: 600; }
.meta { font-size: .9rem; color: gray; }

.summary .row {
  display: flex;
  justify-content: space-between;
  padding: .4rem 0;
}

.total { font-weight: 700; border-top: 1px solid #eee; margin-top: .5rem; padding-top: .5rem; }

.pay-btn {
  margin-top: 1rem;
  width: 100%;
}

.note {
  font-size: .85rem;
  color: #6b7280;
  text-align: center;
  margin-top: .5rem;
}
</style>
