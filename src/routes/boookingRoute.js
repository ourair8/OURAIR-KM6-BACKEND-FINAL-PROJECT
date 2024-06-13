"use strict";

const { createPassangerController } = require("../features/booking/controllers/passengerController");
const { sanitizeBody, validatePassengers } = require("../validators/bodyValidator");
const { checkRole, verifyToken } = require("../features/auth/controllers/whoAmI");

const booking = require("express")
  .Router()
  .post(
    "/create",
    // verifyToken,
    //checkRole(['user']),
    sanitizeBody(["passengers"]),
    validatePassengers,
    createPassangerController
  );

module.exports = { booking };
