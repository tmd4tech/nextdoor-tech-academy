const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'carts',
  timestamps: false,
});

module.exports = Cart;
