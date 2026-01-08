const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contentType: {
    type: DataTypes.ENUM('video', 'pdf', 'text', 'quiz'),
    defaultValue: 'text',
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
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
  tableName: 'lessons',
  timestamps: true,
});

module.exports = Lesson;
