import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      propertyId,
      cityId,
      categoryId,
      preferredDate,
      message,
      leadSource = 'PROPERTY_ENQUIRY',
      landingPage,
    } = body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter a valid full name.' }, { status: 400 });
    }

    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    // 2. Generate unique Lead Number
    const count = await prisma.lead.count();
    const year = new Date().getFullYear();
    const leadNumber = `GR-${year}-${String(count + 1).padStart(4, '0')}`;

    // 3. Find default sales executive to assign
    const defaultUser = await prisma.user.findFirst({
      where: { role: { in: ['SALES_EXECUTIVE', 'PROPERTY_MANAGER', 'SUPER_ADMIN'] } },
    });

    // 4. Create Lead in Database
    const newLead = await prisma.lead.create({
      data: {
        leadNumber,
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        propertyId: propertyId || null,
        cityId: cityId || null,
        categoryId: categoryId || null,
        message: message ? message.trim() : null,
        leadSource,
        landingPage: landingPage || null,
        assignedUserId: defaultUser?.id || null,
        status: 'NEW',
        notes: preferredDate ? `Requested visit date: ${preferredDate}` : null,
      },
    });

    // 5. Create Lead Activity Log
    await prisma.leadActivity.create({
      data: {
        leadId: newLead.id,
        action: 'LEAD_CREATED',
        details: `Enquiry generated from ${leadSource}${propertyId ? ' for property ID: ' + propertyId : ''}.`,
      },
    });

    // 6. If preferred date given, create SiteVisit record
    if (preferredDate && propertyId) {
      try {
        await prisma.siteVisit.create({
          data: {
            leadId: newLead.id,
            propertyId,
            scheduledDate: new Date(preferredDate),
            timeSlot: 'Morning (11:00 AM - 1:00 PM)',
            visitorName: name.trim(),
            visitorPhone: phone.trim(),
            visitorEmail: email ? email.trim() : null,
            status: 'REQUESTED',
            notes: 'Requested via online enquiry form.',
          },
        });
      } catch (visitErr) {
        console.warn('Could not auto-create site visit date:', visitErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your enquiry has been successfully registered.',
        leadNumber: newLead.leadNumber,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving your enquiry. Please contact us directly.' },
      { status: 500 }
    );
  }
}
