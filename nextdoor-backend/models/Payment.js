const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  enrollmentId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentType: {
    type: DataTypes.ENUM('order', 'course'),
    allowNull: false,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'payments',
  timestamps: true,
});

module.exports = Payment;
