import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const cityId = searchParams.get('cityId');

    const where: any = {};
    if (cityId) {
      where.cityId = cityId;
    }

    const localities = await prisma.locality.findMany({
      where,
      orderBy: [{ city: { name: 'asc' } }, { displayOrder: 'asc' }, { name: 'asc' }],
      include: {
        city: { select: { id: true, name: true, slug: true } },
        _count: { select: { properties: true } },
      },
    });

    return NextResponse.json({ localities });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch sectors/localities.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER']);
    const body = await req.json();
    const { cityId, name, slug: customSlug, heading, subheading, pincode, description, seoTitle, seoDescription, displayOrder = 0 } = body;

    if (!cityId || !name || !name.trim()) {
      return NextResponse.json({ error: 'City and Sector/Locality name are required.' }, { status: 400 });
    }

    let slug = customSlug
      ? customSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check collision in this city
    const existing = await prisma.locality.findFirst({
      where: {
        cityId,
        OR: [{ name: name.trim() }, { slug }],
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Locality/Sector already exists in this city.' }, { status: 400 });
    }

    const locality = await prisma.locality.create({
      data: {
        cityId,
        name: name.trim(),
        slug,
        heading: heading?.trim() || null,
        subheading: subheading?.trim() || null,
        pincode: pincode?.trim() || null,
        description: description?.trim() || null,
        seoTitle: seoTitle?.trim() || null,
        seoDescription: seoDescription?.trim() || null,
        displayOrder: Number(displayOrder) || 0,
      },
      include: {
        city: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({ success: true, locality }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create locality.' }, { status: 500 });
  }
}
