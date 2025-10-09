import { PrismaClient } from '../src/generated/prisma';
import { CAFE_DATA, ADDRESS_DATA, MENU_DATA } from './sample-data';

const prisma = new PrismaClient();

const main = async () => {
  // Clear existing data
  await prisma.menu.deleteMany();
  await prisma.address.deleteMany();
  await prisma.cafe.deleteMany();

  for (let i = 0; i < CAFE_DATA.length; i++) {
    // Create cafe
    const cafe = await prisma.cafe.create({
      data: CAFE_DATA[i],
    });

    // Create addresses
    const addresses = ADDRESS_DATA[i].addresses.map(addr => ({
      ...addr,
      cafeId: cafe.id,
    }));

    await prisma.address.createMany({ data: addresses });

    // Create menus
    if (MENU_DATA[i]?.menus?.length) {
      for (const menu of MENU_DATA[i].menus) {
        await prisma.menu.create({
          data: {
            cafeId: cafe.id,
            name: menu.name,
            img: menu.img || null,
            price: menu.price,
            spicyRate: menu.spicyRate ?? 0,
            ingredients: Array.isArray(menu.ingredients)
              ? menu.ingredients
              : menu.ingredients.split(',').map((i: string) => i.trim()),
            createdAt: menu.createdAt || new Date(),
          },
        });
      }
    }
  }

  console.log('Database seeded successfully!');
};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
