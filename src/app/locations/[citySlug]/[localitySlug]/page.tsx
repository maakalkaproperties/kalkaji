import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PropertyListingView from '@/components/PropertyListingView';
import { getFilteredProperties } from '@/lib/propertyQueries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string; localitySlug: string }>;
}): Promise<Metadata> {
  const { citySlug, localitySlug } = await params;
  if (!citySlug || !localitySlug) {
    return { title: 'Area / Sector Not Found' };
  }

  const city = await prisma.city.findUnique({
    where: { slug: citySlug },
  });

  if (!city) {
    return { title: 'Area / Sector Not Found' };
  }

  const locality = await prisma.locality.findUnique({
    where: {
      cityId_slug: {
        cityId: city.id,
        slug: localitySlug,
      },
    },
  });

  if (!locality) {
    return { title: 'Area / Sector Not Found' };
  }

  return {
    title:
      locality.seoTitle ||
      `${locality.heading || locality.name} | Maa Kalkaji Properties`,
    description:
      locality.seoDescription ||
      locality.description ||
      `Explore verified luxury apartments, floors, and plots in ${locality.name}, ${city.name} with RERA assurance.`,
    alternates: {
      canonical: `/locations/${city.slug}/${locality.slug}`,
    },
  };
}

export default async function LocalitySectorPropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ citySlug: string; localitySlug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { citySlug, localitySlug } = await params;
  if (!citySlug || !localitySlug) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;

  const city = await prisma.city.findUnique({
    where: { slug: citySlug },
    include: {
      localities: {
        orderBy: { displayOrder: 'asc' },
        include: { _count: { select: { properties: true } } },
      },
    },
  });

  if (!city) {
    notFound();
  }

  const locality = await prisma.locality.findUnique({
    where: {
      cityId_slug: {
        cityId: city.id,
        slug: localitySlug,
      },
    },
  });

  if (!locality) {
    notFound();
  }

  const [properties, categories, cities] = await Promise.all([
    getFilteredProperties({
      citySlug: city.slug,
      localitySlug: locality.slug,
      categorySlug: resolvedSearchParams.category,
      purpose: resolvedSearchParams.purpose,
      search: resolvedSearchParams.search,
      bhk: resolvedSearchParams.bhk,
      minPrice: resolvedSearchParams.minPrice,
      maxPrice: resolvedSearchParams.maxPrice,
      possession: resolvedSearchParams.possession,
      sort: resolvedSearchParams.sort,
    }),
    prisma.category.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.city.findMany({ orderBy: { displayOrder: 'asc' } }),
  ]);

  return (
    <div className="space-y-6">
      <PropertyListingView
        title={locality.heading || `Properties for Sale & Rent in ${locality.name}, ${city.name}`}
        subtitle={locality.subheading || `${locality.name} • ${city.name} Micro-Market`}
        description={
          locality.description ||
          `Browse verified residential & commercial properties located in ${locality.name}, ${city.name} with RERA verified documentation.`
        }
        breadcrumbName={locality.name}
        breadcrumbParent={{
          name: `Property in ${city.name}`,
          url: `/locations/${city.slug}`,
        }}
        citySlug={city.slug}
        localitySlug={locality.slug}
        localities={city.localities}
        properties={properties}
        categories={categories}
        cities={cities}
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
