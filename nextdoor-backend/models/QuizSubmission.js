const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const QuizSubmission = sequelize.define('QuizSubmission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  quizId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  enrollmentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isPassed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'quiz_submissions',
  timestamps: false,
});

module.exports = QuizSubmission;
