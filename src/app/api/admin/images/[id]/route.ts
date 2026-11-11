import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER']);
    const { id } = await params;

    const existing = await prisma.propertyImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Image record not found.' }, { status: 404 });
    }

    await prisma.propertyImage.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Image deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete image.' }, { status: 500 });
  }
}
