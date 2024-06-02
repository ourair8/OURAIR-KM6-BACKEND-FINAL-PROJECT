'use strict'

const { main } = require('../../seeds/airportSeeder')
const { AirlineSeeder } = require('../../seeds/airlineSeeder')

const { checkRole, verifyToken } = require('../../features/auth/controllers/whoAmI');
//verifyToken, checkRole(['ADMIN']),
const seeder = require("express").Router()
    .get("/trigger-seed-airports", main)
    .get("/trigger-seed-airlines", verifyToken, checkRole(['ADMIN']), AirlineSeeder)

module.exports = {
    seeder
}