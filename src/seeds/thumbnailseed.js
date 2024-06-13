'use strict'

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const cityThumbnails = {
  "Tokyo": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/tokyo.webp?updatedAt=1717051705497",
  "Singapore": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/singapura.webp?updatedAt=1717051704946",
  "Sydney": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/sydney.webp?updatedAt=1717051705001",
  "Phnom Penh": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/phnom%20penh.webp?updatedAt=1717051704950",
  "Manila": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/manila.webp?updatedAt=1717051704913",
  "Kuala Lumpur": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/kuala%20lumpur.webp?updatedAt=1717051701554",
  "Bandung": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/bandung.webp?updatedAt=1717051701256",
  "Hanoi": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/hanoi.webp?updatedAt=1717051701630",
  "Bandar Seri Begawan": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/bandar%20seri%20begawan.webp?updatedAt=1717051701203",
  "Beijing": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/beijing.webp?updatedAt=1717051701159",
  "Bangkok": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/bangkok.webp?updatedAt=1717051701212",
  "London": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/london.webp?updatedAt=1717051701105",
  "Jakarta": "https://ik.imagekit.io/5zwoz8nkr/ourair/User/jakarta.webp?updatedAt=1717051701593",
};

async function updateThumbnails(req, res) {
    try {

    
  for (const cityName in cityThumbnails) {
    const thumbnail = cityThumbnails[cityName];
    await prisma.airports.updateMany({
      where: {
        cityName: cityName,
      },
      data: {
        thumbnail: thumbnail,
      },
    });
    console.log(`Updated thumbnail for ${cityName}`);
  }
    } catch (err) {
        throw err
    }
    finally {
        res.json({
            message : 'success'
        })
    }
}

module.exports = {
    updateThumbnails
}

// updateThumbnails()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
