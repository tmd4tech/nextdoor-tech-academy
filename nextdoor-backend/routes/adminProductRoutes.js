// routes/adminProductRoutes.js
const express = require('express')
const multer = require('multer')
const requireAuth = require('../middleware/authMiddleware')
const requireAdmin = require('../middleware/adminauth')
const adminProductController = require('../controllers/adminProductController')

const upload = multer({ dest: 'uploads/products/' })

const router = express.Router()

// CREATE product  -> POST /api/admin/products
router.post(
  '/',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  adminProductController.createProduct
)

// UPDATE product  -> PUT /api/admin/products/:id
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  adminProductController.updateProduct
)

// LIST products   -> GET /api/admin/products
router.get(
  '/',
  requireAuth,
  requireAdmin,
  adminProductController.listProducts
)

// GET single      -> GET /api/admin/products/:id
router.get(
  '/:id',
  requireAuth,
  requireAdmin,
  adminProductController.getProduct
)

module.exports = router
