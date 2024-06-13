'use strict'

const prisma = require('../../../config/prisma.config');


const findAvailableFlights = async(passengers) => {
    const flightIds = passengers.map(p => p.ticket.flight_id);

    const flights = await prisma.flights.findMany({
        where: {
            id: { in: flightIds }
        }
    });

    return flights;
};


const createPassenger = async(passengerData) => {
    return await prisma.passengers.create({
        data: passengerData
    });
};

module.exports = {
    findAvailableFlights,
    createPassenger
};