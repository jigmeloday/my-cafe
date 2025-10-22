import { PrismaClient } from '../src/generated/prisma';
import { hashSync } from 'bcrypt-ts-edge';
import { CAFE_DATA, ADDRESS_DATA, MENU_DATA, BANNER_DATA, ROLE, USER } from './sample-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ---------------------------
  // 🧹 Clear all existing data in correct order
  // ---------------------------
  await prisma.banner.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.address.deleteMany();
  await prisma.cafe.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  console.log('🧹 Existing data cleared.');

  // ---------------------------
  // 🛡️ Seed Roles
  // ---------------------------
  const roleMap: Record<string, string> = {};
  for (const roleData of ROLE) {
    const role = await prisma.role.create({ data: roleData });
    roleMap[role.name] = role.id;
    console.log(`🛡️ Created role: ${role.name}`);
  }

  // ---------------------------
  // 🧑‍💻 Seed Users
  // ---------------------------
  const userMap: Record<string, string> = {};
  for (const userData of USER) {
    const roleId = roleMap[userData.name.includes('Admin') ? 'super_admin' : userData.name.includes('Owner') ? 'owner' : 'user'];
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        roleId,
        payment: 'Stripe', // default payment for seeding
      },
    });
    userMap[user.name] = user.id;
    console.log(`👤 Created user: ${user.name}`);
  }

  // Use first super_admin as system user for address assignment
  const systemUserId = userMap['Jigme Lodey'];

  // ---------------------------
  // ☕ Seed Cafes
  // ---------------------------
  const cafeMap: Record<string, string> = {};
  for (const cafeData of CAFE_DATA) {
    const cafe = await prisma.cafe.create({
      data: {
        name: cafeData.name,
        subTitle: cafeData.subTitle,
        logo: cafeData.logo,
        openTime: cafeData.openTime,
        closeTime: cafeData.closeTime,
        themeColor: cafeData.themeColor,
        isFeature: cafeData.isFeature,
        ownerId: systemUserId, // assign system user as owner for simplicity
      },
    });
    cafeMap[cafe.name] = cafe.id;
    console.log(`☕ Created cafe: ${cafe.name}`);
  }

  // ---------------------------
  // 📍 Seed Addresses
  // ---------------------------
  for (const addressEntry of ADDRESS_DATA) {
    const cafeId = cafeMap[addressEntry.cafeName];
    if (!cafeId) continue;

    for (const addr of addressEntry.addresses) {
      await prisma.address.create({
        data: {
          street: addr.street,
          city: addr.city,
          state: addr.state,
          zip: addr.zip,
          country: addr.country,
          map: addr.map,
          isDefault: addr.isDefault,
          cafeId,
          userId: systemUserId, // assign system user
        },
      });
    }
    console.log(`🏠 Addresses added for ${addressEntry.cafeName}`);
  }

  // ---------------------------
  // 🍽️ Seed Menus
  // ---------------------------
  for (const menuEntry of MENU_DATA) {
    const cafeId = cafeMap[menuEntry.cafeName];
    if (!cafeId) continue;

    for (const menu of menuEntry.menus) {
      await prisma.menu.create({
        data: {
          name: menu.name,
          img: menu.img,
          price: menu.price,
          spicyRate: menu.spicyRate,
          ingredients: menu.ingredients,
          cafeId,
        },
      });
    }
    console.log(`🍴 Menu items added for ${menuEntry.cafeName}`);
  }

  // ---------------------------
  // 🎏 Seed Banners
  // ---------------------------
  for (const bannerEntry of BANNER_DATA) {
    const cafeId = cafeMap[bannerEntry.cafeName];
    if (!cafeId) continue;

    for (const banner of bannerEntry.banners) {
      await prisma.banner.create({
        data: {
          cafeId,
          buttonText: banner.buttonText,
          link: banner.link,
          active: banner.active,
          title: banner.title,
          subtitle: banner.subtitle,
          imageUrl: banner.imageUrl,
          startDate: banner.startDate,
          endDate: banner.endDate,
        },
      });
    }
    console.log(`🎉 Banners added for ${bannerEntry.cafeName}`);
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
