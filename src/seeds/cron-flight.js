'use strict';

const { PrismaClient } = require('@prisma/client');
const cron = require('node-cron');
const { mongoose, FlightSeats } = require('../db/schema');

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
  const futureDate = new Date(now.getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)); 
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
    class: (() => {
      const randomClass = Math.random();
      if (randomClass < 1 / 3) {
        return 'ECONOMY';
      } else if (randomClass < 2 / 3) {
        return 'BUSINESS';
      } else {
        return 'FIRSTCLASS';
      }
    })(),
    ticket_price: Math.floor(Math.random() * (24000 - 1000 + 1) + 1000) * 1000,
  };
};

const testConnection = async () => {
  console.log(`CRON IS ACTIVE`);

  try {
    await prisma.$connect();
    console.log("Koneksi ke database berhasil");
  } catch (error) {
    console.error("Koneksi ke database gagal", error);
  } finally {
    await prisma.$disconnect();
  }
};

testConnection();

const seedFlights = async (req, res) => {
  try {
    const flights = [];
    for (let i = 0; i < 100; i++) {
      flights.push(generateRandomFlight());
    }

    for (const flight of flights) {
      const createdFlight = await prisma.flights.create({
          data: flight,
      });
    
      const seats = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
      for (let rowNumber = 1; rowNumber <= 12; rowNumber++) {
          for (const rowLetter of rows) {
              seats.push({ seatNumber: `${rowNumber}${rowLetter}`, isBooked: false, passengerId: null });
          }
      }
    
      await FlightSeats.updateOne(
          { flightId: createdFlight.id },
          { $set: { seats: seats } },
          { upsert: true }
      );
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      error: err.message,
    });
  } finally {
    console.log('done');
    await prisma.$disconnect();

    // return res.json({
    //   status: true,
    // });
  }
};

cron.schedule('0 0 * * *', () => {
  console.log('Running cron job to seed flights');
  seedFlights();
});

module.exports = {
  seedFlights,
};
