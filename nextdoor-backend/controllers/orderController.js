const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const emailService = require('../services/emailService');
const paymentService = require('../services/paymentService');
const { Op } = require('sequelize');

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, billingAddress, shippingCost = 0, taxAmount = 0, discountAmount = 0 } = req.body;

    // Get cart items
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [Product],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty.',
      });
    }

    // Calculate total
    let subtotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const itemTotal = parseFloat(item.Product.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
        totalPrice: itemTotal,
      });

      // Update product stock
      item.Product.stock -= item.quantity;
      await item.Product.save();
    }

    const totalAmount = subtotal + parseFloat(shippingCost) + parseFloat(taxAmount) - parseFloat(discountAmount);
    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const order = await Order.create({
      orderNumber,
      userId,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      taxAmount: parseFloat(taxAmount),
      shippingCost: parseFloat(shippingCost),
      discountAmount: parseFloat(discountAmount),
      shippingAddress,
      billingAddress,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
      });
    }

    // Clear cart
    await Cart.destroy({ where: { userId } });

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items' }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      orders: rows,
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

const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [{ model: OrderItem, as: 'items', include: [Product] }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this order.',
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

const initializePayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    const paymentResult = await paymentService.createPaymentIntent(order.totalAmount, 'usd', {
      orderId: order.id,
      userId,
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment initialization failed.',
        error: paymentResult.error,
      });
    }

    // Create payment record
    await Payment.create({
      orderId: order.id,
      userId,
      amount: order.totalAmount,
      status: 'pending',
      paymentType: 'order',
      stripePaymentIntentId: paymentResult.paymentIntentId,
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  initializePayment,
};
