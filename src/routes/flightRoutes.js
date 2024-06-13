'use strict'

const express = require('express');
const {
   getFlightsByCityOrCountryName,
   getFlightsByDate, getAllFlightsByCityOrCountryNameFrom,
   getAllFlightsByCityOrCountryNameTo
} = require('../features/flights/controllers/flight.controller');

const flightRoutes = express.Router()
    .get("/search-city-or-country", getFlightsByCityOrCountryName)
    .get("/search-city-or-country-by-date", getFlightsByDate)
    .get("/search-or-fetch-all-flight-from", getAllFlightsByCityOrCountryNameFrom)
    .get("/search-or-fetch-all-flight-to", getAllFlightsByCityOrCountryNameTo)

module.exports = { flightRoutes };