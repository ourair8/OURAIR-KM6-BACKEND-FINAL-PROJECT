'use strict'

const prisma = require("../config/prisma.config");
const fs = require("fs");

const AirlineSeeder = async function (req, res) {
  try {
    const rawData = fs.readFileSync(`${__dirname}/airlines.json`);
    const airlinesData = JSON.parse(rawData.toString());

    for (const airline of airlinesData) {
      await prisma.airlines.create({
        data: {
          name: airline.name,
          airline_code: airline.airline_code,
        },
      });
    }

    ;
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();

    return res.json({
        status : true,
        message : `berhasil memasukan data airline!`
    })
  }
}

module.exports = {
    AirlineSeeder
}

// main().catch((e) => {
//   console.error("Unexpected error:", e);
//   process.exit(1);
// });