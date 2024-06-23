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
  check('phone_number')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 characters long')
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

const validatePassengers = [
  check('passengers').isArray().withMessage('Passengers harus berupa array.'),
  
  check('passengers.*.title').isIn(['Mr', 'Ms']).withMessage('Title tidak valid.'),
  check('passengers.*.fullname').isString().notEmpty().withMessage('Fullname harus berupa string dan tidak boleh kosong.'),
  check('passengers.*.surname').isString().notEmpty().withMessage('Surname harus berupa string dan tidak boleh kosong.'),
  check('passengers.*.birth_date').isISO8601().withMessage('Birth date harus berupa tanggal yang valid.'),
  check('passengers.*.nationality').isString().notEmpty().withMessage('Nationality harus berupa string dan tidak boleh kosong.'),
  check('passengers.*.document').isString().notEmpty().withMessage('Document harus berupa string dan tidak boleh kosong.'),
  check('passengers.*.country_publication').isString().notEmpty().withMessage('Country of publication harus berupa string dan tidak boleh kosong.'),
  check('passengers.*.document_expired').isISO8601().withMessage('Document expired harus berupa tanggal yang valid.'),
  check('passengers.*.category').isIn(['adult', 'baby', 'child']).withMessage('Category tidak valid. Harus berupa adult, baby, atau child.'),
  check('passengers.*.seat_number').isString(),

  check('baby').isInt({ min: 0 }).withMessage('Baby harus berupa bilangan bulat positif atau nol.'),
  
  check('booker.fullname').isString().notEmpty().withMessage('Fullname harus berupa string dan tidak boleh kosong.'),
  check('booker.surname').isString().notEmpty().withMessage('Surname harus berupa string dan tidak boleh kosong.'),
  check('booker.phone_number').isString().notEmpty().withMessage('Phone number harus berupa string dan tidak boleh kosong.'),
  check('booker.email').isEmail().notEmpty().withMessage('Email harus berupa alamat email yang valid dan tidak boleh kosong.'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


// const validatePassengers = [
//   check('passengers').isArray().withMessage('Passengers harus berupa array.'),
  
//   // Validasi untuk setiap penumpang dalam array
//   // check('passengers.*.title').isIn(['Mr', 'Ms', 'Mrs', 'Dr']).withMessage('Title tidak valid.'),
//   check('passengers.*.fullname').isString().notEmpty().withMessage('Fullname harus berupa string dan tidak boleh kosong.'),
//   check('passengers.*.surname').isString().notEmpty().withMessage('Surname harus berupa string dan tidak boleh kosong.'),
//   check('passengers.*.birth_date').isISO8601().withMessage('Birth date harus berupa tanggal yang valid.'),
//   check('passengers.*.nationality').isString().notEmpty().withMessage('Nationality harus berupa string dan tidak boleh kosong.'),
//   check('passengers.*.document').isString().notEmpty().withMessage('Document harus berupa string dan tidak boleh kosong.'),
//   check('passengers.*.country_publication').isString().notEmpty().withMessage('Country of publication harus berupa string dan tidak boleh kosong.'),
//   check('passengers.*.document_expired').isISO8601().withMessage('Document expired harus berupa tanggal yang valid.'),
//   check('passengers.*.category').isIn(['adult', 'baby', 'child']).withMessage('Category tidak valid. Harus berupa adult, baby, atau child.'),
//   // check('passengers.*.seat_number').matches(/^[1-A][12-6]$/).withMessage('Seat number harus berupa A1-A6 sampai L1-L6.'),
//   check('passengers.*.seat_number').isString(),
//   check('passengers.*.ticket.flight_id').isInt({ min: 1 }).withMessage('Flight ID harus berupa angka positif.'),
  

  
//   // Middleware untuk menangani hasil validasi
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];

module.exports = {
  handleValidationErrors,
  sanitizeBody,
  registerUserInput,
  validateEmailOtpInput,
  loginUserInput,
  validateEmailInput,
  validatePassengers
};
