import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import LeadPipelineManager from '@/components/admin/LeadPipelineManager';

export default async function AdminLeadsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      property: { select: { id: true, title: true, slug: true } },
      category: { select: { id: true, name: true } },
      city: { select: { id: true, name: true } },
      activities: { orderBy: { createdAt: 'desc' } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Lead Pipeline & CRM Management</h1>
        <p className="text-xs text-slate-500">
          Track customer enquiries, qualify prospects, update pipeline statuses, and record site visit outcomes.
        </p>
      </div>

      <LeadPipelineManager initialLeads={leads} />
    </div>
  );
}
