# Nextdoor Tech Academy - Backend API

Complete backend for an e-commerce + LMS (Learning Management System) platform built with Node.js, Express, PostgreSQL, and Sequelize.

## 🎯 Features

### E-Commerce
- 🛍️ Product catalog with filtering and search
- 🛒 Shopping cart management
- 📦 Order management and tracking
- 💳 Stripe payment integration

### Learning Management System (LMS)
- 📚 Course management
- 👥 Student enrollment
- 📝 Lessons and course progress tracking
- 🧪 Quizzes and assessments
- 📜 Certificate generation

### Additional Features
- ✍️ Blog/Resource center
- 👤 User authentication with JWT
- 🔐 Role-based access control (Admin, Instructor, Student, Customer)
- 📧 Email notifications
- ☁️ Cloud file uploads (Cloudinary)
- 🔍 Advanced search and filtering

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd nextdoor-tech-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=nextdoor_tech_dev
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

4. **Create PostgreSQL database**
```bash
createdb nextdoor_tech_dev
```

5. **Start the server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   ├── database.js      # Database connection
│   ├── environment.js   # Environment variables
│   └── constants.js     # App constants
├── models/              # Sequelize models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Course.js
│   ├── Enrollment.js
│   ├── Cart.js
│   ├── Payment.js
│   └── Blog.js
├── controllers/         # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── courseController.js
│   ├── paymentController.js
│   └── blogController.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── courseRoutes.js
│   ├── paymentRoutes.js
│   └── blogRoutes.js
├── middleware/          # Custom middleware
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── errorHandler.js
│   └── validation.js
├── services/            # External integrations
│   ├── emailService.js
│   ├── fileService.js
│   ├── paymentService.js
│   └── certificateService.js
├── utils/               # Utilities
│   ├── validators.js
│   ├── helpers.js
│   └── errors.js
├── server.js            # Main entry point
├── package.json
└── .env                 # Environment variables (GITIGNORE!)
```

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/signup           - Register new user
POST   /api/auth/login            - Login user
POST   /api/auth/verify-email     - Verify email
POST   /api/auth/forgot-password  - Request password reset
POST   /api/auth/reset-password   - Reset password
GET    /api/auth/profile          - Get user profile (protected)
PUT    /api/auth/profile          - Update profile (protected)
```

### Products
```
GET    /api/products              - Get all products (with filtering)
GET    /api/products/:id          - Get product details
GET    /api/products/search       - Search products
GET    /api/products/category/:category - Get products by category
GET    /api/products/featured     - Get featured products
POST   /api/products              - Create product (admin only)
PUT    /api/products/:id          - Update product (admin only)
DELETE /api/products/:id          - Delete product (admin only)
```

### Shopping Cart
```
POST   /api/cart                  - Add to cart (protected)
GET    /api/cart                  - Get cart (protected)
PUT    /api/cart/:cartItemId      - Update cart item (protected)
DELETE /api/cart/:cartItemId      - Remove from cart (protected)
DELETE /api/cart                  - Clear cart (protected)
```

### Orders
```
POST   /api/orders                - Create order (protected)
GET    /api/orders                - Get orders (protected)
GET    /api/orders/:orderId       - Get order details (protected)
PATCH  /api/orders/:orderId/cancel - Cancel order (protected)
POST   /api/orders/:orderId/payment - Initialize payment (protected)
PATCH  /api/orders/:orderId/status - Update status (admin only)
```

### Courses
```
GET    /api/courses               - Get all courses
GET    /api/courses/:courseId     - Get course details
POST   /api/courses               - Create course (instructor/admin)
PUT    /api/courses/:courseId     - Update course (instructor/admin)
DELETE /api/courses/:courseId     - Delete course (instructor/admin)
POST   /api/courses/:courseId/enroll - Enroll in course (protected)
GET    /api/courses/enrolled      - Get enrolled courses (protected)
GET    /api/courses/enrollment/:enrollmentId/progress - Get progress (protected)
```

### Blog
```
GET    /api/blogs                 - Get all blogs
GET    /api/blogs/featured        - Get featured blogs
GET    /api/blogs/search          - Search blogs
GET    /api/blogs/slug/:slug      - Get blog by slug
GET    /api/blogs/:blogId         - Get blog details
POST   /api/blogs                 - Create blog (admin/instructor)
PUT    /api/blogs/:blogId         - Update blog (admin/instructor)
DELETE /api/blogs/:blogId         - Delete blog (admin/instructor)
```

### Payments
```
POST   /api/payments/webhook/stripe - Stripe webhook (no auth)
POST   /api/payments/success       - Handle payment success (protected)
POST   /api/payments/failure       - Handle payment failure (protected)
POST   /api/payments/refund        - Refund payment (protected)
GET    /api/payments/history       - Get payment history (protected)
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

## 👥 User Roles

- **Admin**: Full access to all features
- **Instructor**: Can create and manage courses
- **Student**: Can enroll in courses
- **Customer**: Can purchase products

## 📦 Key Dependencies

- **Express.js** - Web framework
- **Sequelize** - ORM for database
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **Cloudinary** - File upload
- **bcryptjs** - Password hashing

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=nextdoor_tech_dev

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRY=24h

# Stripe (get from https://stripe.com)
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# Cloudinary (get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password
EMAIL_FROM=noreply@nextdoortech.com

# URLs
APP_URL=http://localhost:3000
API_URL=http://localhost:5000
```

## 🚀 Deployment

### Using Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create app-name`
4. Set env vars: `heroku config:set KEY=VALUE`
5. Deploy: `git push heroku main`

### Using Docker

Create a `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t nextdoor-tech-backend .
docker run -p 5000:5000 nextdoor-tech-backend
```

## 📝 API Response Format

All endpoints return consistent JSON responses:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors */ ]
}
```

## 🔗 Integration with Frontend

Connect your Vue.js frontend:

```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

## 🐛 Troubleshooting

**Database connection fails:**
- Check PostgreSQL is running
- Verify DB credentials in `.env`
- Ensure database exists

**Payment not working:**
- Verify Stripe keys are correct
- Check webhook is properly configured
- Use Stripe test cards

**Emails not sending:**
- Enable "Less secure app access" (Gmail)
- Use App Password instead of account password
- Check SMTP settings

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review error messages carefully
3. Check console logs for details
4. Verify environment variables are set correctly

## 📄 License

MIT License

## 👨‍💻 Author

Nextdoor Tech Academy Team
