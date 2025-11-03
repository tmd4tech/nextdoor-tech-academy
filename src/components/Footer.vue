<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Brand Section -->
        <div class="footer-section brand">
          <h3>Nextdoor Tech Academy</h3>
          <p>
            Your one-stop destination for tech products and professional repair
            training.
          </p>
          <div class="social-links">
            <a href="#" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/shop">Shop</router-link></li>
            <li><router-link to="/courses">Courses</router-link></li>
            <li><router-link to="/blog">Blog</router-link></li>
          </ul>
        </div>

        <!-- Support -->
        <div class="footer-section">
          <h4>Support</h4>
          <ul>
            <li><router-link to="/contact">Contact Us</router-link></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section contact">
          <h4>Contact Info</h4>
          <p>📍 123 Tech Street, East Legon, Accra, Ghana</p>
          <p>📧 support@nextdoortechacademy.com</p>
          <p>📱 +233 24 123 4567</p>
          <p>⏰ Mon-Fri: 9AM–6PM, Sat: 10AM–4PM</p>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p>&copy; 2025 Nextdoor Tech Academy. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No JS needed for static footer
</script>

<style scoped>
.footer {
  background: linear-gradient(180deg, #0c0218, #140626);
  color: #f9fafb;
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
  font-family: "Poppins", sans-serif;
  position: relative;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 2.5rem;
  margin-bottom: 2.5rem;
}

.footer-section h3,
.footer-section h4 {
  color: #e11d48; /* Vibrant red accent */
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-section p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #d1d5db;
  margin-bottom: 0.6rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.75rem;
}

.footer-section a {
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-section a:hover {
  color: #e11d48;
  text-shadow: 0 0 5px rgba(225, 29, 72, 0.6);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
}

.social-links a {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(225, 29, 72, 0.1);
  border: 1px solid rgba(225, 29, 72, 0.2);
  color: #e11d48;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background: #e11d48;
  color: #fff;
  transform: translateY(-3px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1.2rem;
  text-align: center;
  font-size: 0.9rem;
  color: #9ca3af;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer {
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }

  .footer-section h3,
  .footer-section h4 {
    margin-top: 1.5rem;
  }
}

/* Add floating soft glow effect */
.footer::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(225, 29, 72, 0.05),
    transparent 70%
  );
  pointer-events: none;
}
</style>
