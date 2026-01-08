const validator = require('express-validator');

const validateSignup = [
  validator.body('firstName').notEmpty().withMessage('First name is required'),
  validator.body('lastName').notEmpty().withMessage('Last name is required'),
  validator.body('email').isEmail().withMessage('Valid email is required'),
  validator.body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validator.body('phoneNumber').optional().isMobilePhone().withMessage('Valid phone number is required'),
];

const validateLogin = [
  validator.body('email').isEmail().withMessage('Valid email is required'),
  validator.body('password').notEmpty().withMessage('Password is required'),
];

const validateProduct = [
  validator.body('name').notEmpty().withMessage('Product name is required'),
  validator.body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  validator.body('category').notEmpty().withMessage('Category is required'),
  validator.body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive number'),
];

const validateCourse = [
  validator.body('title').notEmpty().withMessage('Course title is required'),
  validator.body('description').notEmpty().withMessage('Course description is required'),
  validator.body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
];

const validateBlog = [
  validator.body('title').notEmpty().withMessage('Blog title is required'),
  validator.body('content').notEmpty().withMessage('Blog content is required'),
  validator.body('category').optional().isString().withMessage('Category must be a string'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateProduct,
  validateCourse,
  validateBlog,
  handleValidationErrors,
};
