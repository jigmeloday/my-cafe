import { PrismaClient } from '../src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  // Example Users (Cafe Owners)
  const user1 = await prisma.user.upsert({
    where: { email: 'owner1@example.com' },
    update: {},
    create: {
      name: 'Owner One',
      email: 'owner1@example.com',
      password: 'hashedpassword',
      payment: 'stripe',
      role: { connectOrCreate: { where: { name: 'owner' }, create: { name: 'owner' } } },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'owner2@example.com' },
    update: {},
    create: {
      name: 'Owner Two',
      email: 'owner2@example.com',
      password: 'hashedpassword',
      payment: 'paypal',
      role: { connectOrCreate: { where: { name: 'owner' }, create: { name: 'owner' } } },
    },
  });

  // Cafe Seed Data
  const cafe1 = await prisma.cafe.create({
    data: {
      name: 'Cafe Mocha',
      subTitle: 'Best coffee in town',
      description: 'A cozy place to enjoy your favorite coffee.',
      website: 'https://cafemocha.example.com',
      phone: '+975-12345678',
      email: 'contact@cafemocha.example.com',
      socialLinks: { facebook: 'fb.com/cafemocha', instagram: 'insta.com/cafemocha' },
      googleMap: 'https://maps.google.com/?q=cafemocha',
      logo: 'https://example.com/cafemocha-logo.png',
      openTime: '08:00',
      closeTime: '22:00',
      themeColor: '#65cdb0',
      isFeature: true,
      closed: false,
      isActive: true,
      Owner: { connect: { id: user1.id } },
      Addresses: {
        create: [
          {
            street: 'Main Street 1',
            city: 'Thimphu',
            state: 'Thimphu District',
            zip: '11001',
            country: 'Bhutan',
            map: 'https://maps.google.com/?q=mainstreet1',
            isDefault: true,
            userId: user1.id,
          },
        ],
      },
      Banner: {
        create: [
          {
            creatorId: user1.id,
            buttonText: 'Order Now',
            link: 'https://cafemocha.example.com/order',
            active: true,
            title: 'Summer Specials!',
            subtitle: 'Cool drinks for hot days',
            imageUrl: 'https://example.com/cafemocha-banner.jpg',
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          },
        ],
      },
      Menus: {
        create: [
          {
            name: 'Cappuccino',
            slug: 'cappuccino',
            price: 3.5,
            ingredients: ['espresso', 'milk', 'foam'],
            description: 'Classic cappuccino with rich flavor.',
            category: { connectOrCreate: { where: { name: 'Coffee' }, create: { name: 'Coffee' } } },
            prepTime: 5,
            spicyRate: 0,
            calories: 150,
            protein: 6,
            fat: 5,
            carbs: 20,
            Images: { create: [{ url: 'https://example.com/cappuccino.jpg' }] },
          },
          {
            name: 'Blueberry Muffin',
            slug: 'blueberry-muffin',
            price: 2.5,
            ingredients: ['flour', 'butter', 'blueberries', 'sugar'],
            description: 'Freshly baked blueberry muffin.',
            category: { connectOrCreate: { where: { name: 'Bakery' }, create: { name: 'Bakery' } } },
            prepTime: 10,
            Images: { create: [{ url: 'https://example.com/blueberry-muffin.jpg' }] },
          },
        ],
      },
    },
  });

  const cafe2 = await prisma.cafe.create({
    data: {
      name: 'Green Leaf Cafe',
      subTitle: 'Healthy and Fresh',
      description: 'A place for healthy meals and drinks.',
      website: 'https://greenleaf.example.com',
      phone: '+975-87654321',
      email: 'info@greenleaf.example.com',
      socialLinks: { facebook: 'fb.com/greenleaf', instagram: 'insta.com/greenleaf' },
      googleMap: 'https://maps.google.com/?q=greenleaf',
      logo: 'https://example.com/greenleaf-logo.png',
      openTime: '07:00',
      closeTime: '21:00',
      themeColor: '#9eeccd',
      isFeature: false,
      closed: false,
      isActive: true,
      Owner: { connect: { id: user2.id } },
      Addresses: {
        create: [
          {
            street: 'Second Street 5',
            city: 'Paro',
            state: 'Paro District',
            zip: '12001',
            country: 'Bhutan',
            map: 'https://maps.google.com/?q=secondstreet5',
            isDefault: true,
            userId: user2.id,
          },
        ],
      },
      Banner: {
        create: [
          {
            creatorId: user2.id,
            buttonText: 'Check Menu',
            link: 'https://greenleaf.example.com/menu',
            active: true,
            title: 'Fresh Salads!',
            subtitle: 'Healthy options for you',
            imageUrl: 'https://example.com/greenleaf-banner.jpg',
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          },
        ],
      },
      Menus: {
        create: [
          {
            name: 'Quinoa Salad',
            slug: 'quinoa-salad',
            price: 5.0,
            ingredients: ['quinoa', 'tomato', 'cucumber', 'olive oil'],
            description: 'Fresh quinoa salad with veggies.',
            category: { connectOrCreate: { where: { name: 'Salads' }, create: { name: 'Salads' } } },
            prepTime: 7,
            Images: { create: [{ url: 'https://example.com/quinoa-salad.jpg' }] },
          },
          {
            name: 'Green Smoothie',
            slug: 'green-smoothie',
            price: 4.0,
            ingredients: ['spinach', 'banana', 'apple', 'almond milk'],
            description: 'Healthy green smoothie.',
            category: { connectOrCreate: { where: { name: 'Smoothies' }, create: { name: 'Smoothies' } } },
            prepTime: 3,
            Images: { create: [{ url: 'https://example.com/green-smoothie.jpg' }] },
          },
        ],
      },
    },
  });

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
