import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { uploadImage } from '@/lib/services/image-upload-api';

export const INSERT_IMAGE_SCHEMA = z.object({
  image: z.instanceof(File),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: 'Image not found' }, { status: 400 });
    }
    const parsed = INSERT_IMAGE_SCHEMA.safeParse({ image: file });
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid request data' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ success: false, message: 'You need to be signed in.' }, { status: 401 });
    }
    const uploadedUrl = await uploadImage(parsed.data.image, 'logo');
    if (!uploadedUrl) {
      return NextResponse.json({ success: false, message: 'Failed to upload logo.' }, { status: 500 });
    }
    return NextResponse.json({ success: true, logoUrl: uploadedUrl });
  } catch (error) {
    console.error('POST /api/upload-logo error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

