<template>
  <div class="contact">
    <div class="container">
      <div class="contact-layout">
        <section class="contact-main card">
          <h1>Contact Us</h1>
          <p class="subtitle">
            Have a question about our courses or products? Send a message and the team will respond shortly.
          </p>

          <form @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  v-model="form.name"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div class="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  v-model="form.email"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>Subject</label>
              <input
                type="text"
                v-model="form.subject"
                placeholder="How can we help?"
                required
              />
            </div>

            <div class="form-group">
              <label>Message</label>
              <textarea
                v-model="form.message"
                rows="5"
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary submit-btn">
              Send Message
            </button>

            <p v-if="submitted" class="hint">
              Thanks for reaching out. We’ll get back to you within 1 working day.
            </p>
          </form>
        </section>

        <aside class="contact-side card">
          <h2>Get in touch</h2>
          <p>Reach us through any of the channels below.</p>

          <div class="info-block">
            <h3>Address</h3>
            <p>123 Tech Street<br />East Legon, Accra, Ghana</p>
          </div>

          <div class="info-block">
            <h3>Email</h3>
            <p>support@nextdoortechacademy.com</p>
          </div>

          <div class="info-block">
            <h3>Phone</h3>
            <p>+233 24 123 4567</p>
          </div>

          <div class="info-block">
            <h3>Hours</h3>
            <p>Mon–Fri: 9AM–6PM<br />Sat: 10AM–4PM</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitted = ref(false)

const handleSubmit = () => {
  // Hook this into your backend/email service later
  submitted.value = true
}
</script>

<style scoped>
.contact {
  padding: 2.5rem 0 3rem;
}

.contact-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.9fr);
  gap: 2rem;
}

/* main form */
.contact-main {
  padding: 1.8rem 1.6rem 1.6rem;
}

.contact-main h1 {
  margin-bottom: 0.4rem;
}

.subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1.6rem;
}

/* form */
.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.35rem;
  color: #111827;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.7rem 0.8rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* prevent textarea from being expanded by user [web:110] */
.form-group textarea {
  resize: none;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.25);
}

.submit-btn {
  margin-top: 0.5rem;
  padding-inline: 1.8rem;
}

.hint {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #6b7280;
}

/* side info */
.contact-side {
  padding: 1.8rem 1.6rem 1.6rem;
}

.contact-side h2 {
  margin-bottom: 0.5rem;
}

.contact-side > p {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1.2rem;
}

.info-block {
  margin-bottom: 1rem;
}

.info-block h3 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: #111827;
}

.info-block p {
  font-size: 0.9rem;
  color: #4b5563;
}

/* responsive */
@media (max-width: 900px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }
}
</style>
