// server.js
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const path = require('path')
const sequelize = require('./config/database')
const env = require('./config/environment')
const errorHandler = require('./middleware/errorHandler')
const User = require('./models/User')

// Import routes
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')              // uses your orders router
const courseRoutes = require('./routes/courseRoutes')
const blogRoutes = require('./routes/blogRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const adminProductRoutes = require('./routes/adminProductRoutes')

const app = express()

// CORS
app.use(
  cors({
    origin: env.APP_URL,
    credentials: true,
  }),
)

// Body parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// STATIC: serve uploaded product images
// /uploads/... -> backend/uploads/...
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminProductRoutes) // admin product CRUD

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Error handler middleware
app.use(errorHandler)

// helper: ensure master admin exists
async function ensureAdminUser() {
  const adminEmail = 'temidayoakanmu12@gmail.com'

  const [user, created] = await User.findOrCreate({
    where: { email: adminEmail },
    defaults: {
      firstName: 'Temidayo',
      lastName: 'Akanmu',
      phoneNumber: '0000000000',
      passwordHash: await bcrypt.hash('StrongAdminPassword123', 10),
      role: 'admin',
      isActive: true,
      isVerified: true,
    },
  })

  if (!created && user.role !== 'admin') {
    user.role = 'admin'
    await user.save()
  }

  console.log('✅ Admin user ready:', user.email)
}

// Database sync and server start
const PORT = env.PORT || 5000

sequelize
  .sync({ alter: env.NODE_ENV === 'development' })
  .then(async () => {
    console.log('✅ Database synchronized successfully.')

    // make sure admin exists BEFORE starting server
    await ensureAdminUser()

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║     Nextdoor Tech Academy - Backend Server                   ║
║     ${`Server running on port ${PORT}`.padEnd(58)}║
║     ${`Environment: ${env.NODE_ENV}`.padEnd(58)}║
║     ${`Database: ${env.DB_NAME}`.padEnd(58)}║
╚══════════════════════════════════════════════════════════════╝
      `)
    })
  })
  .catch(err => {
    console.error('❌ Database sync failed:', err)
    process.exit(1)
  })

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('❌ Unhandled Rejection:', err)
  process.exit(1)
})

module.exports = app
