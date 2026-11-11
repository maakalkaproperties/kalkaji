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
    const banner = await prisma.banner.findUnique({ where: { id } });

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found.' }, { status: 404 });
    }

    return NextResponse.json({ banner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching banner.' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER', 'CONTENT_EDITOR']);
    const { id } = await params;
    const body = await req.json();
    const { title, desktopImage, mobileImage, link, alt, isActive, displayOrder } = body;

    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Banner not found.' }, { status: 404 });
    }

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        title: title !== undefined ? title?.trim() || null : existing.title,
        desktopImage: desktopImage !== undefined ? desktopImage.trim() : existing.desktopImage,
        mobileImage: mobileImage !== undefined ? mobileImage.trim() : existing.mobileImage,
        link: link !== undefined ? link.trim() : existing.link,
        alt: alt !== undefined ? alt.trim() : existing.alt,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
      },
    });

    return NextResponse.json({ success: true, banner: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update banner.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;

    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Banner not found.' }, { status: 404 });
    }

    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Banner deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete banner.' }, { status: 500 });
  }
}
