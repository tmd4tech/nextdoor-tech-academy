const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const adminController = require('../controllers/adminController')

router.use(authMiddleware, roleMiddleware('admin', 'instructor'))

router.get('/stats', adminController.getAdminStats)
router.get('/orders', adminController.getRecentOrders)
router.get('/top-courses', adminController.getTopCourses)

module.exports = router
