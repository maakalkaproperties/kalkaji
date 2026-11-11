import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const cities = await prisma.city.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        localities: { orderBy: { displayOrder: 'asc' } },
        _count: { select: { properties: true } },
      },
    });
    return NextResponse.json({ cities });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch locations.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const body = await req.json();
    const { name, state = 'Delhi NCR', heading, tagline, description, seoTitle, seoDescription, isFeatured } = body;

    if (!name) {
      return NextResponse.json({ error: 'City name is required.' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const city = await prisma.city.create({
      data: {
        name: name.trim(),
        slug,
        state,
        heading: heading?.trim() || null,
        tagline: tagline || null,
        description: description || null,
        seoTitle: seoTitle || `Property in ${name} | Maa Kalkaji Properties`,
        seoDescription: seoDescription || `Explore verified properties in ${name}, Delhi NCR.`,
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({ success: true, city }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create city.' }, { status: 500 });
  }
}
