require('dotenv').config();

module.exports = {
  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'nextdoor_tech_dev',

  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  // Email
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@nextdoortech.com',

  // App
  APP_NAME: 'Nextdoor Tech Academy',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:5000',

  // Roles
  ROLES: {
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    STUDENT: 'student',
    CUSTOMER: 'customer'
  },

  // Product Categories
  PRODUCT_CATEGORIES: {
    PHONES: 'phones',
    LAPTOPS: 'laptops',
    ACCESSORIES: 'accessories',
    REPAIR_TOOLS: 'repair_tools',
    PARTS: 'parts'
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },

  // Order Status
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  },

  // Enrollment Status
  ENROLLMENT_STATUS: {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  // Lesson Status
  LESSON_STATUS: {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed'
  }
};
