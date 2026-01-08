// routes/orderRoutes.js
const express = require('express')
const router = express.Router()
const adminOrderController = require('../controllers/adminOrderController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

// GET /api/orders  (admin only)
router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  adminOrderController.listOrders,
)

// PATCH /api/orders/:id/status  (admin only)
router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('admin'),
  adminOrderController.updateOrderStatus,
)

module.exports = router
