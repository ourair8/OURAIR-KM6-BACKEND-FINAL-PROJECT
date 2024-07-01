"use strict";

const prisma = require("../config/prisma.config");
const fs = require("fs");

const AirplaneSeeder = async function (req, res) {
  try {
    // Baca file JSON
    const rawData = fs.readFileSync(`${__dirname}/airplane.json`);
    const airplanesData = JSON.parse(rawData.toString());
    ; //berhasil
    for (const airplaneData of airplanesData) {
      const wow = await prisma.airplanes.create({
        data: {
          airline_id: airplaneData.airline_id,
          airplane_code: airplaneData.airplane_code,
          baggage: airplaneData.baggage,
          cabin_baggage: airplaneData.cabin_baggage,
          description: airplaneData.description,
        },
      });
    }
    ;

    ;
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  } finally {
    await prisma.$disconnect();

    return res.json({
      status: true,
      message: "success aaa",
    });
  }
};

module.exports = {
  AirplaneSeeder,
};
