"use strict";

const prisma = require("../config/prisma.config");
const fs = require("fs");

const main = async function (req, res) {
  try {
    // Baca file JSON
    const rawData = fs.readFileSync(`${__dirname}/airports.json`);
    const airportsData = JSON.parse(rawData.toString());
    console.log("cek"); //berhasil
    for (const airportData of airportsData) {
      if (typeof airportData.city !== "boolean") {
        airportData.city = false;
      }
      const wow = await prisma.airports.create({
        data: {
          code: airportData.code,
          name: airportData.name,
          cityCode: airportData.alias,
          cityName: airportData.city_name,
          countryCode: airportData.country_code,
          countryName: airportData.country,
          city: airportData.city,
          total_visited: 0,
          thumbnail: " ",
        },
      });
    }
    console.log("cek1");

    console.log("Data bandara telah dimasukkan ke dalam tabel Airport.");
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
    main
}
