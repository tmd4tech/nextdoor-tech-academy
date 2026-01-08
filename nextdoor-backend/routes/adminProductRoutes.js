// routes/adminProductRoutes.js
const express = require('express')
const multer = require('multer')
const requireAuth = require('../middleware/authMiddleware')
const requireAdmin = require('../middleware/adminauth')
const adminProductController = require('../controllers/adminProductController')

const upload = multer({ dest: 'uploads/products/' }) // or your storage config

const router = express.Router()

router.post(
  '/products',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  adminProductController.createProduct
)

router.put(
  '/products/:id',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  adminProductController.updateProduct
)

router.get('/products', requireAuth, requireAdmin, adminProductController.listProducts)
router.get('/products/:id', requireAuth, requireAdmin, adminProductController.getProduct)

module.exports = router
