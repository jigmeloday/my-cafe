import { PrismaClient } from '@/generated/prisma';
import { ROLE } from './sample-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');
  await prisma.role.deleteMany();

  for (const role of ROLE) {
    await prisma.role.create({
      data: { name: role.name },
    });
    console.log(`👤 Role created: ${role.name}`);
  }
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });