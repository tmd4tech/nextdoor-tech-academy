<template>
  <div class="contact-page">
    <div class="contact-container">
      <h1>Get In Touch</h1>
      <p class="intro">Have questions or want to work with us? We'd love to hear from you!</p>

      <div class="contact-content">
        <!-- Contact Form -->
        <div class="contact-form-section">
          <h2>Send us a Message</h2>
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Your name"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email Address *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="phone">Phone Number (Optional)</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="Your phone number"
              />
            </div>

            <div class="form-group">
              <label for="subject">Subject *</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                placeholder="What is this about?"
                required
              />
            </div>

            <div class="form-group">
              <label for="message">Message *</label>
              <textarea
                id="message"
                v-model="form.message"
                placeholder="Your message here..."
                rows="6"
                required
              ></textarea>
            </div>

            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>

        <!-- Contact Information -->
        <div class="contact-info-section">
          <h2>Contact Information</h2>

          <div class="info-card">
            <div class="info-icon">📧</div>
            <h3>Email</h3>
            <p>
              <a href="mailto:ayojola75@gmail.com">ayojola75@gmail.com</a>
            </p>
            <p class="info-text">We typically respond within 24 hours</p>
          </div>

          <div class="info-card">
            <div class="info-icon">💬</div>
            <h3>WhatsApp</h3>
            <p>
              <a href="https://wa.me/2348131495622" target="_blank" rel="noopener noreferrer">
                +234 813 149 5622
              </a>
            </p>
            <p class="info-text">Chat with us directly for quick support</p>
          </div>

          <div class="info-card">
            <div class="info-icon">🌐</div>
            <h3>Follow Us</h3>
            <div class="social-links">
              <a href="#" class="social-link">Facebook</a>
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">Instagram</a>
            </div>
          </div>

          <div class="info-card faq-card">
            <h3>Frequently Asked Questions</h3>
            <ul>
              <li>How long does shipping take?</li>
              <li>Do you offer refunds?</li>
              <li>Can I track my order?</li>
              <li>How do I enroll in a course?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || 'VITE_API_URL=https://next-door-backend.onrender.com';

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) {
    errorMessage.value = 'Please complete all required fields.'
    return
  }

  loading.value = true
  try {
    const response = await axios.post(`${apiUrl}/api/contact`, form.value)
    successMessage.value = 'Message sent successfully! We will get back to you soon.'
    form.value = { name: '', email: '', phone: '', subject: '', message: '' }
    // Clear success message after 5 seconds
    setTimeout(() => { successMessage.value = '' }, 5000)
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || err.message || 'Failed to send message. Please try again.'
    console.error('Contact form error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.contact-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 60px 20px;
}

.contact-container {
  max-width: 1100px;
  margin: 0 auto;
}

.contact-page h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 700;
}

.intro {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 50px;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

/* Form Section */
.contact-form-section h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 25px;
}

.contact-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 12px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #28a745;
  font-weight: 500;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #f5c6cb;
  font-weight: 500;
}

.btn {
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not([disabled]) {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.3);
}

.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Contact Info Section */
.contact-info-section h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 25px;
}

.info-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.info-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.info-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.info-card p {
  color: #666;
  line-height: 1.6;
  margin: 8px 0;
}

.info-card a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.info-card a:hover {
  color: #0056b3;
}

.info-text {
  font-size: 0.9rem;
  color: #999;
  margin-top: 8px;
}

.social-links {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.social-link {
  display: inline-block;
  padding: 8px 14px;
  background: #f0f0f0;
  color: #007bff;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s;
}

.social-link:hover {
  background: #007bff;
  color: white;
}

.faq-card ul {
  list-style: none;
  padding: 0;
}

.faq-card li {
  padding: 10px 0;
  color: #666;
  border-bottom: 1px solid #eee;
  position: relative;
  padding-left: 20px;
}

.faq-card li:last-child {
  border-bottom: none;
}

.faq-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .contact-page {
    padding: 40px 16px;
  }

  .contact-page h1 {
    font-size: 2rem;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .contact-form {
    padding: 20px;
  }

  .btn {
    padding: 12px 20px;
  }
}
</style>