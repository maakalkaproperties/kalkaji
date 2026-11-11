import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const banners = await prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ banners });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch banners.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER', 'CONTENT_EDITOR']);
    const body = await req.json();
    const {
      title,
      desktopImage,
      mobileImage,
      link = '/residential-property',
      alt = 'Promotional Banner',
      isActive = true,
      displayOrder = 0,
    } = body;

    if (!desktopImage || !mobileImage) {
      return NextResponse.json(
        { error: 'Both Desktop Banner and Mobile Banner images are required.' },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title: title?.trim() || null,
        desktopImage: desktopImage.trim(),
        mobileImage: mobileImage.trim(),
        link: link?.trim() || '/residential-property',
        alt: alt?.trim() || 'Promotional Banner',
        isActive: Boolean(isActive),
        displayOrder: Number(displayOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create banner.' }, { status: 500 });
  }
}
