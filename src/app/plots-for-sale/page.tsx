import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import PropertyListingView from '@/components/PropertyListingView';
import { getFilteredProperties } from '@/lib/propertyQueries';

export const metadata: Metadata = {
  title: 'Plots for Sale in Delhi NCR | Authority Approved Freehold Plots',
  description:
    'Verified freehold residential, commercial, and industrial plots in Greater Noida, Jewar Airport zone, Yamuna Expressway, and Sonipat with immediate registry.',
  alternates: {
    canonical: '/plots-for-sale',
  },
};

export default async function PlotsForSalePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  const [properties, categories, cities] = await Promise.all([
    getFilteredProperties({
      categorySlug: 'plots-for-sale',
      citySlug: resolvedSearchParams.city,
      purpose: resolvedSearchParams.purpose,
      search: resolvedSearchParams.search,
      minPrice: resolvedSearchParams.minPrice,
      maxPrice: resolvedSearchParams.maxPrice,
      sort: resolvedSearchParams.sort,
    }),
    prisma.category.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.city.findMany({ orderBy: { displayOrder: 'asc' } }),
  ]);

  return (
    <PropertyListingView
      title="Freehold & Authority Plots for Sale in Delhi NCR"
      subtitle="High Capital Appreciation Land Corridors"
      description="Invest in government-approved residential and industrial land plots with clear titles, wide blacktop roads, underground cabling, and immediate registry availability."
      breadcrumbName="Plots for Sale"
      categorySlug="plots-for-sale"
      citySlug={resolvedSearchParams.city}
      properties={properties}
      categories={categories}
      cities={cities}
      searchParams={resolvedSearchParams}
    />
  );
}
