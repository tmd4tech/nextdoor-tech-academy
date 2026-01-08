const express = require('express');
const requireAuth = require('../middleware/authMiddleware');   // your existing JWT check
const requireAdmin = require('./middleware/adminAuth');       // the new middleware
const adminUserController = require('../controllers/adminUserController');

const router = express.Router();

router.get('/users', requireAuth, requireAdmin, adminUserController.listUsers);
router.patch('/users/:id/role', requireAuth, requireAdmin, adminUserController.updateUserRole);

module.exports = router;
