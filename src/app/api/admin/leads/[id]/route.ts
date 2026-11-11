import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        property: true,
        category: true,
        city: true,
        assignedUser: { select: { id: true, name: true, email: true } },
        activities: {
          orderBy: { createdAt: 'desc' },
          include: { performedByUser: { select: { name: true } } },
        },
        siteVisits: { orderBy: { scheduledDate: 'desc' } },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch lead.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    const { status, notes, followUpDate, assignedUserId, newActivityNote } = body;

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        status: status || existing.status,
        notes: notes !== undefined ? notes : existing.notes,
        followUpDate: followUpDate ? new Date(followUpDate) : existing.followUpDate,
        assignedUserId: assignedUserId !== undefined ? assignedUserId : existing.assignedUserId,
      },
    });

    // Record activity log if status changed
    if (status && status !== existing.status) {
      await prisma.leadActivity.create({
        data: {
          leadId: id,
          action: 'STATUS_CHANGED',
          details: `Pipeline status updated from ${existing.status} to ${status}.`,
          performedByUserId: user.userId,
        },
      });
    }

    // Record user note if supplied
    if (newActivityNote) {
      await prisma.leadActivity.create({
        data: {
          leadId: id,
          action: 'NOTE_ADDED',
          details: newActivityNote,
          performedByUserId: user.userId,
        },
      });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    console.error('Lead update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update lead.' }, { status: 500 });
  }
}
