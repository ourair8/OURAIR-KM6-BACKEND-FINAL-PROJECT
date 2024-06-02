'use strict'

const express = require('express');
const {
   getFlightsByCityOrCountryName,
   getFlightsByDate
} = require('../features/flights/controllers/flight.controller');

const flightRoutes = express.Router()
    .get("/search-location-by-date", getFlightsByCityOrCountryName)
    .get("/search-date", getFlightsByDate)

module.exports = { flightRoutes };