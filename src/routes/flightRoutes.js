'use strict'

const express = require('express');
const {
   getFlightById,
   getFlightsByCityOrCountryName,
   getFlightsByDate, getAllFlightsByCityOrCountryNameFrom,
   getAllFlightsByCityOrCountryNameTo,
   getFlightsByDateToFrom,
   getAllSeatFlight,
   getFlightRecommendation,
   getFlightsByDateRevision
} = require('../features/flights/controllers/flight.controller');

const flightRoutes = express.Router()
    .get("/recommendation", getFlightRecommendation)
    .get("/search-seat-of-flight-id", getAllSeatFlight)
    .get("/search-by-id", getFlightById)
    .get("/search-city-or-country", getFlightsByCityOrCountryName)
    .get("/search-city-or-country-airport-and-from-to-by-date", getFlightsByDate)
    .get("/search-city-or-country-by-date-to-from", getFlightsByDateToFrom)
    .get("/search-or-fetch-all-flight-from", getAllFlightsByCityOrCountryNameFrom)
    .get("/search-or-fetch-all-flight-to", getAllFlightsByCityOrCountryNameTo)
    .get("/search", getFlightsByDateRevision)

module.exports = { flightRoutes };