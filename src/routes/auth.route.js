const { registerUserController } = require("../features/auth/controllers/register")
const { verifyOTPController } = require("../features/auth/controllers/verifyOTP")
const { loginByEmailController } = require("../features/auth/controllers/login")

const auth = require("express").Router()
    .post("/signin", loginByEmailController)
    .post("/signup", registerUserController)
    .post("/verify-token", verifyOTPController)

module.exports = { auth };
