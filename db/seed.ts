import { PrismaClient } from '../src/generated/prisma';
import { CAFE_DATA, ADDRESS_DATA } from './sample-data';

const prisma = new PrismaClient();

const main = async () => {
  // Clear existing data
  await prisma.address.deleteMany();
  await prisma.cafe.deleteMany();

  for (let i = 0; i < CAFE_DATA.length; i++) {
    // Create cafe
    const cafe = await prisma.cafe.create({
      data: CAFE_DATA[i],
    });

    // Create corresponding addresses
    const addresses = ADDRESS_DATA[i].addresses.map(addr => ({
      ...addr,
      cafeId: cafe.id, // assign the generated UUID
    }));

    await prisma.address.createMany({
      data: addresses,
    });
  }

  console.log('Database seeded successfully!');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
