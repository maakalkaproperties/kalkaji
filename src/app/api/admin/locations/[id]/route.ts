import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        localities: { orderBy: { displayOrder: 'asc' } },
        _count: { select: { properties: true } },
      },
    });

    if (!city) {
      return NextResponse.json({ error: 'City not found.' }, { status: 404 });
    }

    return NextResponse.json({ city });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching city.' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;
    const body = await req.json();
    const { name, slug: customSlug, state, heading, tagline, description, seoTitle, seoDescription, isFeatured, displayOrder } = body;

    const existing = await prisma.city.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'City not found.' }, { status: 404 });
    }

    let slug = existing.slug;
    if (customSlug || (name && name !== existing.name)) {
      slug = (customSlug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const updated = await prisma.city.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existing.name,
        slug,
        state: state !== undefined ? state.trim() : existing.state,
        heading: heading !== undefined ? heading?.trim() || null : existing.heading,
        tagline: tagline !== undefined ? tagline?.trim() || null : existing.tagline,
        description: description !== undefined ? description?.trim() || null : existing.description,
        seoTitle: seoTitle !== undefined ? seoTitle?.trim() || null : existing.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription?.trim() || null : existing.seoDescription,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
      },
    });

    return NextResponse.json({ success: true, city: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update city.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;

    const existing = await prisma.city.findUnique({
      where: { id },
      include: {
        _count: { select: { properties: true, localities: true } },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'City not found.' }, { status: 404 });
    }

    if (existing._count.properties > 0) {
      return NextResponse.json(
        { error: `Cannot delete city because it has ${existing._count.properties} active properties. Reassign them first.` },
        { status: 400 }
      );
    }

    await prisma.city.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'City deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete city.' }, { status: 500 });
  }
}
