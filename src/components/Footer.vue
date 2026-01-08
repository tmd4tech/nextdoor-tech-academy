<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Brand Section -->
        <div class="footer-section brand">
          <h3>Nextdoor Tech Academy</h3>
          <p>
            Your one‑stop destination for tech products and professional repair
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
          <p>⏰ Mon‑Fri: 9AM–6PM, Sat: 10AM–4PM</p>
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
// static footer
</script>

<style scoped>
.footer {
  background: #020617;
  color: #e5e7eb;
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
  position: relative;
}

/* subtle top border matching cards */
.footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 1200px;
  max-width: 100%;
  transform: translateX(-50%);
  border-top: 1px solid rgba(148, 163, 184, 0.4);
  pointer-events: none;
}

/* layout */
.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
  margin-bottom: 2.5rem;
}

.footer-section h3,
.footer-section h4 {
  color: #f9fafb;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.05rem;
}

.brand h3 {
  font-size: 1.2rem;
}

.footer-section p {
  font-size: 0.9rem;
  line-height: 1.7;
  color: #9ca3af;
  margin-bottom: 0.6rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 0.6rem;
}

.footer-section a {
  color: #cbd5f5;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.15s ease, transform 0.15s ease;
}

.footer-section a:hover {
  color: #f97316; /* orange accent [web:10][web:142] */
  transform: translateX(2px);
}

/* social icons */
.social-links {
  display: flex;
  gap: 0.7rem;
  margin-top: 1.1rem;
}

.social-links a {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.5);
  color: #e5e7eb;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  font-size: 0.8rem;
  transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease,
    box-shadow 0.15s ease;
}

.social-links a:hover {
  background: #f97316;
  color: #111827;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.7);
}

/* footer bottom */
.footer-bottom {
  border-top: 1px solid rgba(31, 41, 55, 0.9);
  padding-top: 1.2rem;
  text-align: center;
  font-size: 0.85rem;
  color: #6b7280;
}

/* responsive */
@media (max-width: 768px) {
  .footer {
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }

  .footer-section h3,
  .footer-section h4 {
    margin-top: 0.5rem;
  }
}
</style>
