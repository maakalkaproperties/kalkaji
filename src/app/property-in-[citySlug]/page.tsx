import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PropertyListingView from '@/components/PropertyListingView';
import { getFilteredProperties } from '@/lib/propertyQueries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}): Promise<Metadata> {
  const { citySlug } = await params;
  if (!citySlug) {
    return { title: 'Location Not Found' };
  }

  const city = await prisma.city.findUnique({
    where: { slug: citySlug },
  });

  if (!city) {
    return { title: 'Location Not Found' };
  }

  return {
    title: city.seoTitle || `Property in ${city.name} | Verified Real Estate | Grand Realty NCR`,
    description:
      city.seoDescription ||
      `Explore verified luxury apartments, commercial office spaces, and plots in ${city.name}, Delhi NCR with 100% RERA compliance.`,
    alternates: {
      canonical: `/property-in-${city.slug}`,
    },
  };
}

export default async function CityPropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ citySlug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { citySlug } = await params;
  if (!citySlug) {
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

  const [properties, categories, cities] = await Promise.all([
    getFilteredProperties({
      citySlug: city.slug,
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
        title={city.heading || `Verified Properties for Sale & Rent in ${city.name}`}
        subtitle={city.tagline || `${city.name} Infrastructure & Growth Corridor`}
        description={city.description || undefined}
        breadcrumbName={`Property in ${city.name}`}
        citySlug={city.slug}
        localities={city.localities}
        properties={properties}
        categories={categories}
        cities={cities}
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
