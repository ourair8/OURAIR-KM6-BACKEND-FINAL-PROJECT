'use strict'

const { registerUserController } = require("../features/auth/controllers/register")
const { verifyOTPController } = require("../features/auth/controllers/verifyOTP")
const { loginByEmailController } = require("../features/auth/controllers/login")
const { isEmailAvailable } = require ("../features/auth/controllers/checkEmailAvailable")
const { sendEmailAgainController } = require ("../features/auth/controllers/sendMailAgain")
const { checkEmailSendTokentoEmail } = require("../features/auth/controllers/forgotPassword")
const { resetPassword } =require("../features/auth/controllers/resetPassword")
const { whoIAm } =require("../features/auth/controllers/whoAmI")
const { loginOAuthController } = require("../features/auth/controllers/login")

const { sanitizeBody, handleValidationErrors, validateEmailOtpInput, registerUserInput, loginUserInput, validateEmailInput } = require("../validators/bodyValidator")
const passport = require("../libs/passport")

const auth = require("express").Router()
    .post("/signin", sanitizeBody(['email', 'password']), loginUserInput, handleValidationErrors, loginByEmailController)
    .post("/signup", sanitizeBody(['name', `phone_number`, 'email', 'password']), registerUserInput, handleValidationErrors, registerUserController)
    .post("/verify-email-token", sanitizeBody(['email', 'otp']), validateEmailOtpInput, handleValidationErrors, verifyOTPController)
    .post("/check-email", sanitizeBody(['email']), validateEmailInput, handleValidationErrors, isEmailAvailable)
    .post("/try-send-email", sanitizeBody(['email']), validateEmailInput, handleValidationErrors, sendEmailAgainController)
    .post("/forgot-password-send-email", checkEmailSendTokentoEmail)
    .post("/forgot-password-send-email-again", checkEmailSendTokentoEmail)
    .post("/reset-password-do-login", resetPassword)
    .get("/who-am-i", whoIAm)
    .get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
    .get("/google/callback", passport.authenticate("google", {
        failureRedirect: "/api/v1/auth/google",
        session: false,
      }),
      loginOAuthController
    );

module.exports = { auth };
