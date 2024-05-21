const { auth } = require('../routes/auth.route')
const { userRoutes } = require('../routes/userRoutes');
const { ticketRoutes } = require('../routes/ticketRoutes');
const { passangerRoutes } = require('../routes/passangerRoutes');
const { flightRoutes } = require('../routes/flightRoutes');
const { planeRoutes } = require('../routes/planeRoutes');
const { airportRoutes } = require('../routes/airportRoutes');

const v1 = require("express").Router()
    .use("/auth", auth)
    .use('/users', userRoutes)
    .use('/tickets', ticketRoutes)


module.exports = { v1 };