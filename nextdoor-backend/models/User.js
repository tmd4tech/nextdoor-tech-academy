const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'instructor', 'student', 'customer'),
    defaultValue: 'customer',
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastLogin: {
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
  tableName: 'users',
  timestamps: true,
});

// Hash password before saving
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
});

// Method to compare passwords
User.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = User;
