const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const LessonProgress = sequelize.define('LessonProgress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  enrollmentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  lessonId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
    defaultValue: 'not_started',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'lesson_progresses',
  timestamps: false,
});

module.exports = LessonProgress;
