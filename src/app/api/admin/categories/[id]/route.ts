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
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { properties: true, leads: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching category.' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER']);
    const { id } = await params;
    const body = await req.json();
    const { name, slug: customSlug, description, displayOrder } = body;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    let slug = existing.slug;
    if (customSlug || (name && name !== existing.name)) {
      slug = (customSlug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existing.name,
        slug,
        description: description !== undefined ? description?.trim() || null : existing.description,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update category.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;

    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { properties: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    if (existing._count.properties > 0) {
      return NextResponse.json(
        { error: `Cannot delete category because it contains ${existing._count.properties} properties. Move or delete those properties first.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete category.' }, { status: 500 });
  }
}
