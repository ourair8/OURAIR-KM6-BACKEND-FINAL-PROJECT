const { PrismaClient } = require('@prisma/client');
const {faker} = require('@faker-js/faker');
const prisma = new PrismaClient();

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  }
  
  function determineCategory(age) {
    if (age >= 0 && age <= 2) {
      return 'baby';
    } else if (age >= 3 && age <= 12) {
      return 'child';
    } else if (age >= 13 && age <= 18) {
      return 'teenager';
    } else {
      return 'adult';
    }
  }

const passangerSeeder= async function(req, res) {
try {
  const passengers = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const seats = [];
  
  // Generate seat numbers from A1 to L6
  for (const row of rows) {
    for (let number = 1; number <= 6; number++) {
      seats.push(`${row}${number}`);
    }
  }

  for (let i = 0; i < 70000; i++) {
    const seatNumber = seats[i % seats.length]; // Ensure seat number is within the range
    const birthDate = faker.date.past({years :18}); // Random birth date in the past 30 years
    const age = calculateAge(birthDate);
    const category = determineCategory(age);
    const documentExpired = faker.date.future({years : 10});
    const titles = ['Mr', 'Ms']

    passengers.push({
      title: titles[Math.floor(Math.random() * titles.length)],
      fullname: faker.person.firstName(),
      surname: faker.person.lastName(),
      birth_date: birthDate,
      category: category,
      nationality: faker.location.country(),
      document: faker.string.alphanumeric(10),
      country_publication: faker.location.country(),
      document_expired: documentExpired,
      seat_number: seatNumber,
    });
  }

  await prisma.passengers.createMany({
    data: passengers,
    skipDuplicates: true,
  });

//   await prisma.passengers.deleteMany()
    // data: passengers,
    // skipDuplicates: true,

  ;

} catch(err){
    
} finally {
    
    return res.json({
        status : 'success'
    })
}
}

module.exports = { passangerSeeder}