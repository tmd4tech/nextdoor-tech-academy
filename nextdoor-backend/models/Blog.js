const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  publishedAt: {
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
  tableName: 'blogs',
  timestamps: true,
});

module.exports = Blog;
