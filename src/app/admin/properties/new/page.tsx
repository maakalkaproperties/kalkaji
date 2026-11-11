import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import PropertyForm from '@/components/admin/PropertyForm';

export default async function NewPropertyPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const [categories, cities, localities, builders] = await Promise.all([
    prisma.category.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.city.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.locality.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.builder.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <PropertyForm
      categories={categories}
      cities={cities}
      localities={localities}
      builders={builders}
    />
  );
}
