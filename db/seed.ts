import { PrismaClient } from '../src/generated/prisma';
import { CAFE_DATA } from './sample-data';

const prisma = new PrismaClient();

const main = async() => {
  await prisma.cafe.deleteMany();
  await prisma.cafe.createMany({ data: CAFE_DATA });
  console.log("db seeded successfully")
}

main();