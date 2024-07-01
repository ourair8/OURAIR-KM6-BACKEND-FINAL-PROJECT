"use strict";

const prisma = require("../config/prisma.config");
const fs = require("fs");

const AirlineSeeder = async function (req, res) {
  try {
    // Baca file JSON
    const rawData = fs.readFileSync(`${__dirname}/airline.json`);
    const airlinesData = JSON.parse(rawData.toString());
    ; //berhasil
    for (const airportData of airlinesData) {
      const wow = await prisma.airlines.create({
        data: {
          name: airportData.name,
          airline_code: airportData.airline_code,
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
      message: "success",
    });
  }
};

module.exports = {
  AirlineSeeder,
};

