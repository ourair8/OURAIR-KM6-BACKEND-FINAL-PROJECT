"use strict";

const prisma = require("../config/prisma.config");
const fs = require("fs");

const AirplaneSeeder = async function (req, res) {
  try {
    // Baca file JSON
    const rawData = fs.readFileSync(`${__dirname}/airplane.json`);
    const airplanesData = JSON.parse(rawData.toString());
    console.log("cek"); //berhasil
    for (const airplaneData of airplanesData) {
      const wow = await prisma.airplanes.create({
        data: {
          airline_id: airplaneData.airline_id,
          airplane_code: airplaneData.airplane_code,
          baggage: airplaneData.baggage,
          cabin_baggage: airplaneData.cabin_baggage,
          description: airplaneData.description,
          seat_economy: airplaneData.seat_economy,
          seat_economy_premium: airplaneData.seat_economy_premium,
          seat_business: airplaneData.seat_business,
          seat_first_class: airplaneData.seat_first_class,
        },
      });
    }
    console.log("cek1");

    console.log("Data Airplane telah dimasukkan ke dalam tabel Airline.");
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  } finally {
    await prisma.$disconnect();

    return res.json({
      status: true,
      message: "success",
    });
  }
};

module.exports = {
  AirplaneSeeder,
};
