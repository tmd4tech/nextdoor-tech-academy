const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateSignup,
  validateLogin,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.post('/signup', validateSignup, handleValidationErrors, authController.signup);
router.post('/login', validateLogin, handleValidationErrors, authController.login);

// NEW: Google login route (no validation middleware, it only accepts an idToken)
router.post('/google', authController.googleLogin);

router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
