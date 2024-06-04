'use strict'

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const airports = {
  Tokyo: [3658, 3659, 8058, 8059],
  Singapore: [3232, 7632],
  Sydney: [3424, 3425, 3426, 7824, 7825, 7826],
  PhnomPenh: [2822, 7222],
  Manila: [2288, 6688],
  KualaLumpur: [1843, 1844, 6243, 6244],
  Bandung: [276, 4676],
  Hanoi: [1332, 5732],
  BandarSeriBegawan: [512, 4912],
  Beijing: [361, 362, 4761, 4762],
  Bangkok: [368, 369, 4768, 4769],
  London: [2006],
  Jakarta: [1658, 1659],
};

const airportIds = Object.values(airports).flat();

const generateRandomDate = () => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
  return futureDate;
};

const generateRandomFlight = () => {
  const fromId = airportIds[Math.floor(Math.random() * airportIds.length)];
  let toId = airportIds[Math.floor(Math.random() * airportIds.length)];
  while (toId === fromId) {
    toId = airportIds[Math.floor(Math.random() * airportIds.length)];
  }

  const departureTime = generateRandomDate();
  const arrivalTime = new Date(departureTime.getTime() + Math.floor(Math.random() * 10 + 1) * 60 * 60 * 1000);

  return {
    airplane_id: Math.floor(Math.random() * 120) + 1,
    from_id: fromId,
    to_id: toId,
    departure_time: departureTime,
    arrival_time: arrivalTime,
    flight_type: Math.random() > 0.5 ? 'DOMESTIC' : 'INTERNATIONAL',
    ticket_price: Math.floor(Math.random() * (30000000 - 2000000 + 1)) + 2000000,
  };
};

const seedFlights = async (req, res) => {
  try {
    const flights = [];
    for (let i = 0; i < 100; i++) {
      flights.push(generateRandomFlight());
    }

    for (const flight of flights) {
      await prisma.flights.create({
        data: flight,
      });
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: false,
      error: err.message
    });
  } finally {
    res.json({
        message: true
      });
    await prisma.$disconnect();
  }
};

module.exports = {
  seedFlights
};
