import { PrismaClient } from '@/generated/prisma';
import { CATEGORY } from './sample-data'; // import your CATEGORY array

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for categories...');

  // Optional: delete existing categories first
  await prisma.category.deleteMany();

  for (const category of CATEGORY) {
    await prisma.category.create({
      data: { name: category.name },
    });
    console.log(`📦 Category created: ${category.name}`);
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
