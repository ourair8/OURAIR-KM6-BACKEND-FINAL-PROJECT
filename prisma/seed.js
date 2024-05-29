const prisma = require("../src/config/prisma.config");
const fs = require("fs");

async function main() {
  try {
    const rawData = fs.readFileSync(`${__dirname}/airline.json`);
    const airlinesData = JSON.parse(rawData.toString());

    for (const airline of airlinesData) {
      await prisma.airlines.create({
        data: {
          name: airline.name,
          airline_code: airline.airline_code,
        },
      });
    }

    console.log("Data seeded successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});
