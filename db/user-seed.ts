import prisma from '../src/generated/prisma';
import { USER } from './sample-data';

export const seedUsers = async (roleMap: Record<string, string>) => {
  const userMap: Record<string, string> = {};

  for (const userData of USER) {
    const roleId = roleMap[
      userData.name.includes('Admin')
        ? 'super_admin'
        : userData.name.includes('Owner')
        ? 'owner'
        : 'user'
    ];

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        roleId,
        payment: 'Stripe',
      },
    });

    userMap[user.name] = user.id;
    console.log(`👤 Created user: ${user.name}`);
  }

  return userMap;
};
