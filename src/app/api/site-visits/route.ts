import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { propertyId, scheduledDate, timeSlot, visitorName, visitorPhone, visitorEmail, notes } = body;

    if (!propertyId || !scheduledDate || !visitorName || !visitorPhone) {
      return NextResponse.json(
        { error: 'Property, date, name, and phone number are required.' },
        { status: 400 }
      );
    }

    // Create lead if not exists
    const leadCount = await prisma.lead.count();
    const year = new Date().getFullYear();
    const leadNumber = `GR-${year}-${String(leadCount + 1).padStart(4, '0')}`;

    const lead = await prisma.lead.create({
      data: {
        leadNumber,
        name: visitorName.trim(),
        phone: visitorPhone.trim(),
        email: visitorEmail ? visitorEmail.trim() : null,
        propertyId,
        leadSource: 'SITE_VISIT_FORM',
        status: 'SITE_VISIT_SCHEDULED',
        notes: `Site visit requested for ${scheduledDate} (${timeSlot || 'Morning'})`,
      },
    });

    const visit = await prisma.siteVisit.create({
      data: {
        leadId: lead.id,
        propertyId,
        scheduledDate: new Date(scheduledDate),
        timeSlot: timeSlot || '11:00 AM - 1:00 PM',
        visitorName: visitorName.trim(),
        visitorPhone: visitorPhone.trim(),
        visitorEmail: visitorEmail ? visitorEmail.trim() : null,
        status: 'REQUESTED',
        notes: notes || null,
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        action: 'VISIT_SCHEDULED',
        details: `Site visit booked for ${scheduledDate} (${timeSlot || '11:00 AM - 1:00 PM'}).`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Site visit request registered successfully. Our property manager will confirm timing.',
      visitId: visit.id,
    });
  } catch (error: any) {
    console.error('Site visit scheduling error:', error);
    return NextResponse.json({ error: 'Failed to schedule site visit.' }, { status: 500 });
  }
}
