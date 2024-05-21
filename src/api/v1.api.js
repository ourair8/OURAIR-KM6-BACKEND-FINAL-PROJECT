const { auth } = require('../routes/auth.route')

const v1 = require("express").Router()
    .use("/auth", auth)

module.exports = { v1 };