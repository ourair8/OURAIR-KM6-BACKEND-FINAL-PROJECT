const { registerUserController } = require("../features/auth/controllers/register")

const auth = require("express").Router()
    .post("/signup", registerUserController)

module.exports = { auth };
