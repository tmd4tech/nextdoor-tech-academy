const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const {
  validateProduct,
  handleValidationErrors,
} = require('../middleware/validation')

// NOTE: server.js mounts this at /api/products
// so router.get('/') == GET /api/products for the shop

// Public routes (SHOP)
// use the existing controller method
router.get('/', productController.getAllProducts)

// Other public routes
router.get('/search', productController.searchProducts)
router.get('/featured', productController.getFeaturedProducts)
router.get('/category/:category', productController.getProductsByCategory)
router.get('/:id', productController.getProductById)

// Admin routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  validateProduct,
  handleValidationErrors,
  productController.createProduct,
)

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  productController.updateProduct,
)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  productController.deleteProduct,
)

router.patch(
  '/:id/stock',
  authMiddleware,
  roleMiddleware('admin'),
  productController.updateStock,
)

module.exports = router
