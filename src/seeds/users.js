const prisma = require("../config/prisma.config");
const { faker } = require('@faker-js/faker');

async function userSeeder(req,res) {

    try {

  const users = [];
  const today = new Date();
  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(today.getMonth() + 5);

  for (let i = 0; i < 50000; i++) {
    const createdAt = new Date(today.getTime() + Math.random() * (twoMonthsLater.getTime() - today.getTime()));
    users.push({
      name: faker.person.fullName(),
      username: faker.internet.userName() + i, // Ensuring unique username by appending i
      phone_number: faker.phone.number(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      is_Verified: true,
      created_at: createdAt,
      avatar_link: faker.image.avatar(),
      googleId: faker.string.alphanumeric(10),
    });
  }

  await prisma.users.createMany({
    data: users,
    skipDuplicates: true, // In case there are any duplicates, skip them
  });

  console.log('Seeding finished.');

    } catch(err){
        throw err
    } finally {
        return res.json({
            status : true, message : 'done'
        })
    }


}

module.exports = {
    userSeeder
}
