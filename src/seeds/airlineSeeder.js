"use strict";

const prisma = require("../config/prisma.config");
const fs = require("fs");

const testConnection = async () => {
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

const AirlineSeeder = async function (req, res) {
  try {
    // Baca file JSON
    const rawData = fs.readFileSync(`${__dirname}/airline.json`);
    const airlinesData = JSON.parse(rawData.toString());
    console.log("cek"); //berhasil
    for (const airportData of airlinesData) {
      const wow = await prisma.airports.create({
        data: {
          name: airportData.name,
          airline_code: airportData.airline_code,
        },
      });
    }
    console.log("cek1");

    console.log("Data Maskapai telah dimasukkan ke dalam tabel Airline.");
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