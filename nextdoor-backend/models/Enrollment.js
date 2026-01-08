const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active',
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  certificateIssued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  certificateUrl: {
    type: DataTypes.STRING,
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
  tableName: 'enrollments',
  timestamps: true,
});

module.exports = Enrollment;
