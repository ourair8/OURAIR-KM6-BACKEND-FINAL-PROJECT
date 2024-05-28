'use strict'

const { check, validationResult } = require('express-validator');

const registerUserInput = [
  check('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  check('email')
    .isEmail().withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginUserInput = [
    check('email')
      .isEmail().withMessage('Must be a valid email address'),
    check('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];

const validateEmailOtpInput = [
    check('email')
      .isEmail().withMessage('Must be a valid email address'),
    check('otp')
      .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 characters long')
      .isNumeric().withMessage('OTP must be numeric'),
  ];

const validateEmailInput = [
    check('email')
        .isEmail().withMessage('Must be a valid email address'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const sanitizeBody = (allowedFields) => {
    return (req, res, next) => {
      Object.keys(req.body).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete req.body[key];
        }
      });
      next();
    };
};

module.exports = {
  handleValidationErrors,
  sanitizeBody,
  registerUserInput,
  validateEmailOtpInput,
  loginUserInput,
  validateEmailInput
};
