'use strict'

const { registerUserController } = require("../features/auth/controllers/register")
const { verifyOTPController } = require("../features/auth/controllers/verifyOTP")
const { loginByEmailController } = require("../features/auth/controllers/login")
const { isEmailAvailable } = require ("../features/auth/controllers/checkEmailAvailable")
const { sendEmailAgainController } = require ("../features/auth/controllers/sendMailAgain")
const { sanitizeBody, handleValidationErrors, validateEmailOtpInput, registerUserInput, loginUserInput, validateEmailInput } = require("../validators/bodyValidator")

const auth = require("express").Router()
    .post("/signin", sanitizeBody(['email', 'password']), loginUserInput, handleValidationErrors, loginByEmailController)
    .post("/signup", sanitizeBody(['name', 'email', 'password']), registerUserInput, handleValidationErrors, registerUserController)
    .post("/verify-token", sanitizeBody(['email', 'otp']), validateEmailOtpInput, handleValidationErrors, verifyOTPController)
    .post("/check-email", sanitizeBody(['email']), validateEmailInput, handleValidationErrors, isEmailAvailable)
    .post("/try-send-email", sanitizeBody(['email']), validateEmailInput, handleValidationErrors, sendEmailAgainController)

module.exports = { auth };
