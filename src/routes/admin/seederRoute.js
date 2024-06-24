"use strict";

const { main } = require("../../seeds/airportSeeder");
const { AirlineSeeder } = require("../../seeds/airlineSeeder");
const { userSeeder } = require("../../seeds/users");
const { AirplaneSeeder } = require("../../seeds/airplaneSeeder");
const { updateRatings } = require("../../seeds/flights");
const { seedFlights } = require('../../seeds/cron-flight')
const { updateThumbnails } = require("../../seeds/thumbnailseed");
const { insertDataMongo, updateFlightSeats } = require("../../db/mongo_seed")
const { passangerSeeder } = require('../../seeds/passangerseeder')


const {
  checkRole,
  verifyToken,
} = require("../../features/auth/controllers/whoAmI");

//airport
//airline
//airplane
//thumbnail airport
//rating update
//user seeder
//passanger seeder
const seeder = require("express")
  .Router()
  .get("/trigger-update-seed-seat", updateFlightSeats)
  .get("/trigger-seed-seat", insertDataMongo)
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
  .get('/trigger-user-seeder', userSeeder)
  .get('/update-airports-ratings', updateRatings)
  .get('/trigger-passanger-seeder', passangerSeeder)

module.exports = {
    seeder
}