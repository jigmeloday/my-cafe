import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../auth';
import { INSERT_ADDRESS_BE_SCHEMA } from '@/lib/validator';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (userRole !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = INSERT_ADDRESS_BE_SCHEMA.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({success: false, message: 'Invalid data' }, { status: 400 });
    }

    const cafes = await prisma.cafe.findMany({
      where: { ownerId: userId },
    });

    const cafe = cafes.find((item) => item.id === parsed.data.cafeId);

    if (!cafe) {
      return NextResponse.json(
        { message: 'Cafe not found or not owned by user', success: false },
        { status: 404 }
      );
    }

    const newAddress = await prisma.address.create({
      data: {
        street: parsed.data.street,
        city: parsed.data.city,
        state: parsed.data.state,
        zip: parsed.data.zip,
        country: parsed.data.country,
        cafeId: cafe.id,
        userId: userId
      },
    });

    return NextResponse.json({ success: true, data: newAddress }, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
