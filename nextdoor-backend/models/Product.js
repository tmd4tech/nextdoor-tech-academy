const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM('phones', 'laptops', 'accessories', 'repair_tools', 'parts'),
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
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
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
