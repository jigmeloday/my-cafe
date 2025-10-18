import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { INSERT_ADDRESS_BE_SCHEMA } from '@/lib/validator';
import prisma from '@/lib/prisma';
import { authOptions } from '../../../../../auth';

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1]
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userRole = session?.user?.role;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (userRole !== 'owner') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = INSERT_ADDRESS_BE_SCHEMA.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid data', errors: parsed.error.format() }, { status: 400 });
    }

    // Check if the cafe exists and belongs to the user
    const cafe = await prisma.cafe.findFirst({
      where: {
        id: parsed.data.cafeId,
        ownerId: userId,
      },
    });

    if (!cafe) {
      return NextResponse.json({ success: false, message: 'Cafe not found or not owned by user' }, { status: 404 });
    }

    // Check if the address exists and belongs to this cafe
    const address = await prisma.address.findFirst({
      where: {
        id: id, // address ID from URL
        cafeId: cafe.id,
      },
    });

    if (!address) {
      return NextResponse.json({ success: false, message: 'Address not found for this cafe' }, { status: 404 });
    }

    // Update the address
    const updatedAddress = await prisma.address.update({
      where: { id: id },
      data: {
        street: parsed.data.street,
        city: parsed.data.city,
        state: parsed.data.state,
        zip: parsed.data.zip,
        country: parsed.data.country,
      },
    });

    return NextResponse.json({ success: true, data: updatedAddress }, { status: 200 });

  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
