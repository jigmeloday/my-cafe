import { PrismaClient, Prisma } from '../src/generated/prisma';
import { CAFE_DATA, ADDRESS_DATA, MENU_DATA, BANNER_DATA } from './sample-data';

const prisma = new PrismaClient();

// --------------------
// 💡 Type Definitions
// --------------------
type CafeSeed = {
  name: string;
  subTitle?: string | null;
  logo?: string | null;
  openTime: string;
  closeTime: string;
  themeColor: string;
  closed?: boolean;
  isFeature: boolean;
  createdAt?: Date;
};

type AddressSeed = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  map?: string;
  createdAt: Date;
};

type AddressGroup = {
  cafeName: string;
  addresses: AddressSeed[];
};

type MenuSeed = {
  name: string;
  img?: string | null;
  price: number;
  spicyRate?: number;
  ingredients: string[] | string;
  createdAt: Date;
};

type MenuGroup = {
  cafeName: string;
  menus: MenuSeed[];
};

type BannerSeed = {
  title?: string | null;
  subtitle?: string | null;
  imageUrl: string;
  buttonText: string;
  link: string;
  active?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  createdAt?: Date;
};

type BannerGroup = {
  cafeName: string;
  banners: BannerSeed[];
};

// --------------------
// 🌱 Main Seed Script
// --------------------
async function main(): Promise<void> {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (order matters due to FK constraints)
  await prisma.menu.deleteMany();
  await prisma.address.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.cafe.deleteMany();

  console.log('🧹 Existing data cleared.');

  // Seed each cafe
  for (const cafeData of CAFE_DATA as CafeSeed[]) {
    const createdCafe = await prisma.cafe.create({
      data: {
        name: cafeData.name,
        subTitle: cafeData.subTitle,
        logo: cafeData.logo,
        isFeature: cafeData.isFeature,
        openTime: cafeData.openTime,
        closeTime: cafeData.closeTime,
        themeColor: cafeData.themeColor,
        closed: cafeData.closed ?? false,
        createdAt: cafeData.createdAt ?? new Date(),
      },
    });

    console.log(`☕ Created cafe: ${createdCafe.name}`);

    // Seed addresses
    const addressEntry = (ADDRESS_DATA as AddressGroup[]).find(
      a => a.cafeName === cafeData.name
    );

    if (addressEntry?.addresses?.length) {
      const addresses: Prisma.AddressCreateManyInput[] = addressEntry.addresses.map(
        addr => ({
          ...addr,
          cafeId: createdCafe.id,
        })
      );

      await prisma.address.createMany({ data: addresses });
      console.log(`🏠 Added ${addresses.length} address(es) for ${createdCafe.name}`);
    }

    // Seed menus
    const menuEntry = (MENU_DATA as MenuGroup[]).find(
      m => m.cafeName === cafeData.name
    );

    if (menuEntry?.menus?.length) {
      const menus: Prisma.MenuCreateManyInput[] = menuEntry.menus.map(menu => ({
        cafeId: createdCafe.id,
        name: menu.name,
        img: menu.img || null,
        price: menu.price,
        spicyRate: menu.spicyRate ?? 0,
        ingredients: Array.isArray(menu.ingredients)
          ? menu.ingredients
          : menu.ingredients.split(',').map(i => i.trim()),
        createdAt: menu.createdAt ?? new Date(),
      }));

      await prisma.menu.createMany({ data: menus });
      console.log(`📜 Added ${menus.length} menu item(s) for ${createdCafe.name}`);
    }

    // Seed banners (selective)
    const bannerEntry = (BANNER_DATA as BannerGroup[]).find(
      b => b.cafeName === cafeData.name
    );

    if (bannerEntry?.banners?.length) {
      for (const banner of bannerEntry.banners) {
        await prisma.banner.create({
          data: {
            cafeId: createdCafe.id,
            title: banner.title ?? null,
            subtitle: banner.subtitle ?? null,
            imageUrl: banner.imageUrl,
            buttonText: banner.buttonText,
            link: banner.link,
            active: banner.active ?? false,
            startDate: banner.startDate ?? null,
            endDate: banner.endDate ?? null,
            createdAt: banner.createdAt ?? new Date(),
          },
        });
      }
      console.log(`🎨 Added ${bannerEntry.banners.length} banner(s) for ${createdCafe.name}`);
    }
  }

  console.log('🎉 Database seeded successfully!');
}

// --------------------
// 🧩 Run Seed
// --------------------
main()
  .catch(error => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
