const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'order_items',
  timestamps: false,
});

module.exports = OrderItem;
