const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  title: {
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
  syllabus: {
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
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner',
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  enrollmentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  tableName: 'courses',
  timestamps: true,
});

module.exports = Course;
