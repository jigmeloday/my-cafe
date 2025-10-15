import prisma from '../src/generated/prisma';
import { seedRole } from './role-seed';
import { seedUsers } from './users';
import { seedCafes } from './cafes';
import { seedBanners } from './banners';

async function main() {
  console.log('🌱 Starting database seeding...');

  // Optional: clear tables
  await prisma.banner.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.address.deleteMany();
  await prisma.cafe.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  const roleMap = await seedRoles();
  const userMap = await seedUsers(roleMap);
  const systemUserId = userMap['Jigme Lodey'];

  const cafeMap = await seedCafes(systemUserId);

  await seedBanners(cafeMap);

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  