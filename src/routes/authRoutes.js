'use strict'

const { registerUserController } = require("../features/auth/controllers/register")
const { verifyOTPController } = require("../features/auth/controllers/verifyOTP")
const { loginByEmailController } = require("../features/auth/controllers/login")
const { isEmailAvailable } = require ("../features/auth/controllers/checkEmailAvailable")
const { sendEmailAgainController } = require ("../features/auth/controllers/sendMailAgain")

const auth = require("express").Router()
    .post("/signin", loginByEmailController)
    .post("/signup", registerUserController)
    .post("/verify-token", verifyOTPController)
    .post("/check-email", isEmailAvailable)
    .post("/try-send-email", sendEmailAgainController)

module.exports = { auth };
