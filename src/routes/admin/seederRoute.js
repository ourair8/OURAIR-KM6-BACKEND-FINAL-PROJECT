'use strict'

const { main } = require('../../seeds/airportSeeder')

const { checkRole, verifyToken } = require('../../features/auth/controllers/whoAmI');

const seeder = require("express").Router()
    .get("/trigger-seed-airports", verifyToken, checkRole(['ADMIN']), main)

module.exports = {
    seeder
}