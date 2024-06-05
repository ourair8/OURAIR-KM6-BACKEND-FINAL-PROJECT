'use strict'

const { createPassengerController } = require("../features/booking/controllers/passengerController")
const { sanitizeBody, validatePassengers } = require("../validators/bodyValidator")
const { checkRole, verifyToken } = require('../features/auth/controllers/whoAmI');

const booking = require("express").Router()
    .post("/create",
        verifyToken,
        sanitizeBody(['passengers']),
        validatePassengers,
        checkRole(['USER']),
        createPassengerController
    )

module.exports = { booking };