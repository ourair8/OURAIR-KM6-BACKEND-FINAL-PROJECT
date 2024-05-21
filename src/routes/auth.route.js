const { registerUserController } = require("../features/auth/controllers/register")
const { verifyOTPController } = require("../features/auth/controllers/verifyOTP")

const auth = require("express").Router()
    .post("/signup", registerUserController)
    .post("/verify-token", verifyOTPController)

module.exports = { auth };
