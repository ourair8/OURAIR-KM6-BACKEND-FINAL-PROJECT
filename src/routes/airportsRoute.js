'use strict'

const { getAirports } = require("../features/airports/airports.controller")

const airports = require("express").Router()
    .get("/", 
      getAirports
    )

module.exports = {
    airports
}