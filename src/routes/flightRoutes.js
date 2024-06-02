'use strict'

const express = require('express');
const {
   getFlightsByCityOrCountryName,
   getFlightsByDate
} = require('../features/flights/controllers/flight.controller');

const flightRoutes = express.Router()
    .get("/search-city-or-country", getFlightsByCityOrCountryName)
    .get("/search-city-or-country-by-date", getFlightsByDate)

module.exports = { flightRoutes };