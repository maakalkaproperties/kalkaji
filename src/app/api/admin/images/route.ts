import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');
    const imageType = searchParams.get('imageType');

    const where: any = {};
    if (propertyId) {
      where.propertyId = propertyId;
    }
    if (imageType && imageType !== 'ALL') {
      where.imageType = imageType;
    }

    const images = await prisma.propertyImage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            city: { select: { name: true } },
          },
        },
      },
    });

    const properties = await prisma.property.findMany({
      select: { id: true, title: true, slug: true },
      orderBy: { title: 'asc' },
    });

    return NextResponse.json({ images, properties });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch images.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER']);
    const body = await req.json();
    const { propertyId, url, alt, caption, imageType = 'GALLERY', isFeatured = false, displayOrder = 0 } = body;

    if (!propertyId || !url) {
      return NextResponse.json({ error: 'Property ID and Image URL are required.' }, { status: 400 });
    }

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return NextResponse.json({ error: 'Associated property not found.' }, { status: 404 });
    }

    const image = await prisma.propertyImage.create({
      data: {
        propertyId,
        url: url.trim(),
        alt: alt?.trim() || property.title,
        caption: caption?.trim() || null,
        imageType,
        isFeatured: Boolean(isFeatured),
        displayOrder: Number(displayOrder) || 0,
      },
      include: {
        property: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    return NextResponse.json({ success: true, image }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create image record.' }, { status: 500 });
  }
}
