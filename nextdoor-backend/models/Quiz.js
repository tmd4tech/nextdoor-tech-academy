const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  lessonId: {
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
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  passingScore: {
    type: DataTypes.INTEGER,
    defaultValue: 70,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'quizzes',
  timestamps: false,
});

module.exports = Quiz;
