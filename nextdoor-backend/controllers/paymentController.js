const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const paymentService = require('../services/paymentService');
const emailService = require('../services/emailService');
const certificateService = require('../services/certificateService');
const stripe = require('stripe')(require('../config/environment').STRIPE_SECRET_KEY);

const handlePaymentSuccess = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    // Verify payment with Stripe
    const paymentResult = await paymentService.confirmPaymentIntent(paymentIntentId);
    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed.',
      });
    }

    // Find payment record
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    // Update payment status
    payment.status = 'completed';
    payment.transactionId = paymentIntentId;
    await payment.save();

    // Handle order payment
    if (payment.paymentType === 'order' && payment.orderId) {
      const order = await Order.findByPk(payment.orderId);
      if (order) {
        order.paymentStatus = 'completed';
        order.status = 'confirmed';
        await order.save();

        const user = await User.findByPk(order.userId);
        await emailService.sendOrderConfirmationEmail(user.email, {
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status,
        });
      }
    }

    // Handle course enrollment payment
    if (payment.paymentType === 'course' && payment.metadata) {
      const courseId = payment.metadata.courseId;
      const enrollment = await Enrollment.create({
        courseId,
        userId: payment.userId,
        status: 'active',
      });

      const course = await Course.findByPk(courseId);
      course.enrollmentCount += 1;
      await course.save();

      const user = await User.findByPk(payment.userId);
      await emailService.sendEnrollmentConfirmationEmail(user.email, {
        courseName: course.title,
        amount: course.price,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully.',
      payment,
    });
  } catch (error) {
    next(error);
  }
};

const handlePaymentFailure = async (req, res, next) => {
  try {
    const { paymentIntentId, reason } = req.body;

    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    payment.status = 'failed';
    payment.failureReason = reason;
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded.',
    });
  } catch (error) {
    next(error);
  }
};

const refundPayment = async (req, res, next) => {
  try {
    const { paymentId, amount } = req.body;

    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.',
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded.',
      });
    }

    const refundResult = await paymentService.refundPayment(payment.stripePaymentIntentId, amount);
    if (!refundResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Refund failed.',
      });
    }

    payment.status = 'refunded';
    payment.refundAmount = amount || payment.amount;
    payment.refundedAt = new Date();
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment refunded successfully.',
      refund: refundResult,
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      where: { userId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      payments: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const stripeWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    const env = require('../config/environment');
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        const paymentIntent = event.data.object;
        await handlePaymentSuccess({ body: { paymentIntentId: paymentIntent.id } }, res);
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payment
        const failedIntent = event.data.object;
        await handlePaymentFailure(
          { body: { paymentIntentId: failedIntent.id, reason: failedIntent.last_payment_error?.message } },
          res
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handlePaymentSuccess,
  handlePaymentFailure,
  refundPayment,
  getPaymentHistory,
  stripeWebhook,
};
