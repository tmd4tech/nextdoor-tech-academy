const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
const User = require('../models/User');
const env = require('../config/environment');
const emailService = require('../services/emailService');



// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRY,
    }
  );
};

const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.',
      });
    }

    const verificationToken = uuidv4();
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: password,
      phoneNumber,
      role: role || 'customer',
      verificationToken,
    });

    const token = generateToken(user);

    const verificationLink = `${env.APP_URL}/verify-email?token=${verificationToken}`;
    await emailService.sendVerificationEmail(email, verificationToken, verificationLink);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify.',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token.',
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully.',
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const resetToken = uuidv4();
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetExpiry;
    await user.save();

    const resetLink = `${env.APP_URL}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail(email, resetLink);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: { [require('sequelize').Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.',
      });
    }

    user.passwordHash = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, bio, profileImage } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Google login: verifies Google ID token, finds/creates user, returns JWT.
 */
const googleLogin = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      console.error('googleLogin: missing code', req.body);
      return res
        .status(400)
        .json({ success: false, message: 'Missing authorization code' });
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('googleLogin: client env vars missing');
      return res
        .status(500)
        .json({ success: false, message: 'Server Google config missing' });
    }

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code)
    const idToken = tokens.id_token

    if (!idToken) {
      console.error('googleLogin: no id_token in tokens', tokens)
      return res.status(401).json({ success: false, message: 'Google authentication failed' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const email = payload.email
    const fullName = payload.name || ''
    const [firstName, ...rest] = fullName.split(' ')
    const lastName = rest.join(' ')

    let user = await User.findOne({ where: { email } })
    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
        passwordHash: uuidv4(),
        phoneNumber: null,
        role: 'customer',
        isVerified: true
      })
    }

    const token = generateToken(user)

    return res.status(200).json({
      success: true,
      message: 'Logged in with Google.',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    })
  } catch (error) {
    console.error('googleLogin error', error)
    return res.status(401).json({
      success: false,
      message: 'Google authentication failed'
    })
  }
};

module.exports = {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  googleLogin,
};
