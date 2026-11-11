import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import PropertyForm from '@/components/admin/PropertyForm';

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const { id } = await params;

  const [property, categories, cities, localities, builders] = await Promise.all([
    prisma.property.findUnique({
      where: { id },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    }),
    prisma.category.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.city.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.locality.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.builder.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!property) {
    notFound();
  }

  return (
    <PropertyForm
      initialData={property}
      categories={categories}
      cities={cities}
      localities={localities}
      builders={builders}
    />
  );
}
