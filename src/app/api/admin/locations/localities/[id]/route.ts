import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER']);
    const { id } = await params;
    const body = await req.json();
    const { name, slug: customSlug, cityId, heading, subheading, pincode, description, seoTitle, seoDescription, displayOrder } = body;

    const existing = await prisma.locality.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Locality/Sector not found.' }, { status: 404 });
    }

    let slug = existing.slug;
    if (customSlug || (name && name !== existing.name)) {
      slug = (customSlug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const updated = await prisma.locality.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existing.name,
        slug,
        cityId: cityId || existing.cityId,
        heading: heading !== undefined ? heading?.trim() || null : existing.heading,
        subheading: subheading !== undefined ? subheading?.trim() || null : existing.subheading,
        pincode: pincode !== undefined ? pincode?.trim() || null : existing.pincode,
        description: description !== undefined ? description?.trim() || null : existing.description,
        seoTitle: seoTitle !== undefined ? seoTitle?.trim() || null : existing.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription?.trim() || null : existing.seoDescription,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
      },
      include: {
        city: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({ success: true, locality: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update locality.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;

    const existing = await prisma.locality.findUnique({
      where: { id },
      include: { _count: { select: { properties: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Locality/Sector not found.' }, { status: 404 });
    }

    if (existing._count.properties > 0) {
      return NextResponse.json(
        { error: `Cannot delete sector/locality because it contains ${existing._count.properties} properties. Reassign them first.` },
        { status: 400 }
      );
    }

    await prisma.locality.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Locality/Sector deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete locality.' }, { status: 500 });
  }
}
