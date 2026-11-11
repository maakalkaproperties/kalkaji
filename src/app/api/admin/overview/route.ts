import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    // Fetch real metrics from database
    const [
      totalProperties,
      publishedProperties,
      featuredProperties,
      totalLeads,
      newLeads,
      scheduledVisits,
      recentLeads,
      recentProperties,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { published: true } }),
      prisma.property.count({ where: { featuredStatus: true } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.siteVisit.count({ where: { status: { in: ['REQUESTED', 'CONFIRMED'] } } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          property: { select: { title: true, slug: true } },
          category: { select: { name: true } },
          city: { select: { name: true } },
        },
      }),
      prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } },
          city: { select: { name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        totalProperties,
        publishedProperties,
        draftProperties: totalProperties - publishedProperties,
        featuredProperties,
        totalLeads,
        newLeads,
        scheduledVisits,
      },
      recentLeads,
      recentProperties,
      currentUser: user,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Admin overview error:', error);
    return NextResponse.json({ error: 'Failed to fetch overview metrics.' }, { status: 500 });
  }
}
