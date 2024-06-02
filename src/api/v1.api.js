'use strict'

const { auth } = require('../routes/authRoutes')
const { userRoutes } = require('../routes/userRoutes');
const { ticketRoutes } = require('../routes/ticketRoutes');

// const { passangerRoutes } = require('../routes/passangerRoutes');

const { flightRoutes } = require('../routes/flightRoutes');
const { transactionRoutes } = require('../routes/transactionRoutes');
const { seeder } = require('../routes/admin/seederRoute');
const { booking } = require('../routes/boookingRoute')
const { airports } = require('../routes/airportsRoute')


// const { planeRoutes } = require('../routes/planeRoutes');
// const { airportRoutes } = require('../routes/airportRoutes');

const v1 = require("express").Router()
    .use("/auth", auth)
    .use('/users', userRoutes)
    .use('/tickets', ticketRoutes)
    .use('/flights', flightRoutes)
    .use('/transactions', transactionRoutes)
    .use('/seeder', seeder)
    .use('/booking', booking)
    .use('/airports', airports)

module.exports = { v1 };