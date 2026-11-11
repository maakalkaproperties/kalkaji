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
    const faq = await prisma.faq.findUnique({ where: { id } });

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
    }

    return NextResponse.json({ faq });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching FAQ.' }, { status: 500 });
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
    const { question, answer, category, displayOrder, isPublished } = body;

    const existing = await prisma.faq.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
    }

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        question: question !== undefined ? question.trim() : existing.question,
        answer: answer !== undefined ? answer.trim() : existing.answer,
        category: category !== undefined ? category : existing.category,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
      },
    });

    return NextResponse.json({ success: true, faq: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update FAQ.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;

    await prisma.faq.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete FAQ.' }, { status: 500 });
  }
}
