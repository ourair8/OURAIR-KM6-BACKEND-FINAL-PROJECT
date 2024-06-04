"use strict";

const { main } = require("../../seeds/airportSeeder");
const { AirlineSeeder } = require("../../seeds/airlineSeeder");
const { AirplaneSeeder } = require("../../seeds/airplaneSeeder");
const { seedFlights } = require("../../seeds/flights");
const { updateThumbnails } = require("../../seeds/thumbnailseed");


const {
  checkRole,
  verifyToken,
} = require("../../features/auth/controllers/whoAmI");

const seeder = require("express")
  .Router()
  .get("/trigger-seed-airports", main)
  // verifyToken, checkRole(["ADMIN"]),
  .get(
    "/trigger-seed-airlines",
    // verifyToken,
    // checkRole(["ADMIN"]),
    AirlineSeeder
  )
  .get(
    "/trigger-seed-airplanes",
    // verifyToken,
    // checkRole(["ADMIN"]),
    AirplaneSeeder
  )
  .get("/flight-seed", seedFlights)
  .get('/thumbnail-airport-seed', updateThumbnails)

module.exports = {
    seeder
}