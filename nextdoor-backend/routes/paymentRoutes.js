const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Payment webhook (no auth needed)
router.post('/webhook/stripe', paymentController.stripeWebhook);

// Protected routes
router.use(authMiddleware);

router.post('/success', paymentController.handlePaymentSuccess);
router.post('/failure', paymentController.handlePaymentFailure);
router.post('/refund', paymentController.refundPayment);
router.get('/history', paymentController.getPaymentHistory);

module.exports = router;
