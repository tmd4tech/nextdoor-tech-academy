# Quick Reference - Commands & Snippets

## 🚀 Essential Commands

### Initial Setup
```bash
# Create project folder
mkdir nextdoor-tech-backend
cd nextdoor-tech-backend

# Copy all files here, then:
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

### Running the Server
```bash
# Development mode (auto-reload with nodemon)
npm run dev

# Production mode
npm start

# Check if server is running
curl http://localhost:5000/health
```

### Database Setup
```bash
# Create database in PostgreSQL
psql -U postgres
CREATE DATABASE nextdoor_tech_dev;

# Or using createdb
createdb -U postgres nextdoor_tech_dev
```

---

## 📝 Testing with Postman/cURL

### Authentication - Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "+1234567890"
  }'
```

### Authentication - Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=12"
```

### Add to Cart (with token)
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": "product-uuid",
    "quantity": 1
  }'
```

### Get Cart
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "billingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "shippingCost": 10,
    "taxAmount": 25,
    "discountAmount": 0
  }'
```

### Get Courses
```bash
curl -X GET "http://localhost:5000/api/courses?page=1&limit=12"
```

### Enroll in Course
```bash
curl -X POST http://localhost:5000/api/courses/course-uuid/enroll \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Blog Post
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Getting Started with Phone Repair",
    "content": "Complete guide to basic phone repair...",
    "excerpt": "Learn the basics",
    "category": "repair",
    "tags": ["repair", "phones", "tutorial"],
    "image": "https://image-url.jpg"
  }'
```

---

## 💻 JavaScript/Vue.js Integration

### Create API Service
```javascript
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data)
  }
)

export default api
```

### Login Example
```javascript
import api from '@/services/api'

async function login(email, password) {
  try {
    const { token, user } = await api.post('/auth/login', {
      email,
      password
    })
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    return { success: true, user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### Get Products Example
```javascript
import api from '@/services/api'

async function getProducts(filters = {}) {
  try {
    const { data: products, pagination } = await api.get('/products', {
      params: {
        page: filters.page || 1,
        limit: filters.limit || 12,
        category: filters.category || '',
        search: filters.search || ''
      }
    })
    return { success: true, products, pagination }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### Add to Cart Example
```javascript
import api from '@/services/api'

async function addToCart(productId, quantity) {
  try {
    const { cartItem } = await api.post('/cart', {
      productId,
      quantity
    })
    return { success: true, cartItem }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### Enroll in Course Example
```javascript
import api from '@/services/api'

async function enrollCourse(courseId) {
  try {
    const response = await api.post(`/courses/${courseId}/enroll`)
    
    if (response.clientSecret) {
      // Payment required
      return {
        success: true,
        paymentRequired: true,
        clientSecret: response.clientSecret,
        paymentIntentId: response.paymentIntentId
      }
    }
    
    // Free course
    return { success: true, enrollment: response.enrollment }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

---

## 🔧 Environment Variables Checklist

```env
# REQUIRED FOR DEVELOPMENT
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=nextdoor_tech_dev

PORT=5000
NODE_ENV=development

JWT_SECRET=your_32_char_minimum_secret_key_here

# REQUIRED FOR PAYMENTS
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# REQUIRED FOR FILE UPLOADS
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# REQUIRED FOR EMAIL
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@nextdoortech.com

# FRONTEND URLS
APP_URL=http://localhost:3000
API_URL=http://localhost:5000
```

---

## 🐛 Common Errors & Fixes

### Error: "Cannot find module 'express'"
```bash
# Solution: Install dependencies
npm install
```

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
```bash
# Solution: Start PostgreSQL
# Windows: Start from Services
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Error: "JWT_SECRET is not defined"
```bash
# Solution: Check .env file exists and JWT_SECRET is set
cat .env | grep JWT_SECRET
```

### Error: "stripe is not defined"
```bash
# Solution: Verify Stripe key in .env
cat .env | grep STRIPE_SECRET_KEY
```

### Error: "EADDRINUSE: address already in use :::5000"
```bash
# Solution: Kill process on port 5000
# Windows: netstat -ano | findstr :5000 → taskkill /PID xxx /F
# macOS/Linux: lsof -i :5000 | awk 'NR!=1 {print $2}' | xargs kill -9
```

---

## 📊 Database Queries

### View All Users
```sql
SELECT id, email, first_name, last_name, role FROM users;
```

### View All Products
```sql
SELECT id, name, price, stock, category FROM products;
```

### View All Orders
```sql
SELECT id, order_number, user_id, total_amount, status FROM orders;
```

### View All Courses
```sql
SELECT id, title, instructor_id, price, is_published FROM courses;
```

### Delete Test Data
```sql
DELETE FROM users WHERE email LIKE '%test%';
DELETE FROM products WHERE name LIKE '%test%';
```

---

## 🚀 Deployment Commands

### For Heroku
```bash
heroku login
heroku create app-name
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret
git push heroku main
```

### For Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### For Docker
```bash
# Build image
docker build -t nextdoor-tech-backend .

# Run container
docker run -p 5000:5000 -e DB_HOST=host.docker.internal nextdoor-tech-backend
```

---

## 📞 Getting Help

1. **Check console logs** - First step for debugging
2. **Verify .env file** - Most common issue
3. **Check database** - Ensure PostgreSQL is running
4. **Test API endpoints** - Use Postman to isolate issues
5. **Review error messages** - They usually point to the problem
6. **Check network tab** - In browser dev tools
7. **Read README.md** - Complete API documentation

---

## 🎯 Development Workflow

```
1. Start PostgreSQL
   ↓
2. Run: npm run dev
   ↓
3. Check: http://localhost:5000/health
   ↓
4. Test APIs with Postman
   ↓
5. Connect Vue.js frontend
   ↓
6. Test full workflow
   ↓
7. Deploy to production
```

---

## 📚 File Organization

Ensure files are in correct locations:

```
nextdoor-tech-backend/
├── config/
│   ├── database.js
│   └── environment.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── courseController.js
│   ├── paymentController.js
│   └── blogController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── errorHandler.js
│   └── validation.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Course.js
│   ├── Enrollment.js
│   ├── Cart.js
│   ├── Payment.js
│   ├── Blog.js
│   ├── Lesson.js
│   ├── LessonProgress.js
│   ├── Quiz.js
│   └── QuizSubmission.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── courseRoutes.js
│   ├── paymentRoutes.js
│   ├── cartRoutes.js
│   └── blogRoutes.js
├── services/
│   ├── emailService.js
│   ├── fileService.js
│   ├── paymentService.js
│   └── certificateService.js
├── .env
├── .env.example
├── server.js
├── package.json
├── README.md
├── SETUP_GUIDE.md
└── COMPLETION_SUMMARY.md
```

**Everything is ready. Start building! 🚀**
