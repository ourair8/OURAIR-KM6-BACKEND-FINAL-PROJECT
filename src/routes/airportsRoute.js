'use strict'

const { getAirportByCityCode} = require("../features/airports/airports.controller")

const airports = require("express").Router()
    .get("/", 
      getAirportByCityCode
    )

module.exports = {
    airports
}