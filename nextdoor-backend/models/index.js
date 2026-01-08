// models/index.js
const Sequelize = require('sequelize')
const sequelize = require('../config/database')

// Import all models
const User = require('./User')
const Course = require('./Course')
const Enrollment = require('./Enrollment')
const Lesson = require('./Lesson')
const LessonProgress = require('./LessonProgress')
const Payment = require('./Payment')
const Product = require('./Product')
const Order = require('./Order')
const OrderItem = require('./OrderItem')
const Cart = require('./Cart')
const Blog = require('./Blog')
const Quiz = require('./Quiz')
const QuizSubmission = require('./QuizSubmission')

// Put them in a single object
const db = {
  sequelize,
  Sequelize,
  User,
  Course,
  Enrollment,
  Lesson,
  LessonProgress,
  Payment,
  Product,
  Order,
  OrderItem,
  Cart,
  Blog,
  Quiz,
  QuizSubmission,
}

// Call associate() on each model if it exists
Object.values(db).forEach(model => {
  if (model && typeof model.associate === 'function') {
    model.associate(db)
  }
})

module.exports = db
