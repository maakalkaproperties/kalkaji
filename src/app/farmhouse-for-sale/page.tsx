import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import PropertyListingView from '@/components/PropertyListingView';
import { getFilteredProperties } from '@/lib/propertyQueries';

export const metadata: Metadata = {
  title: 'Luxury Farmhouse for Sale in Delhi NCR | Chhatarpur, Sultanpur & Aravalli Retreats',
  description:
    'Exclusive 1 to 5-acre luxury farmhouses and country estates for sale in South Delhi (Chhatarpur, Sultanpur, Dera Mandi) and Gurgaon Aravalli green belts.',
  alternates: {
    canonical: '/farmhouse-for-sale',
  },
};

export default async function FarmhouseForSalePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  const [properties, categories, cities] = await Promise.all([
    getFilteredProperties({
      categorySlug: 'farmhouse-for-sale',
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
      title="Luxury Farmhouse Estates & Country Retreats in Delhi NCR"
      subtitle="Exclusive Gated Green Sanctuaries"
      description="Sprawling private gated farmhouses featuring private swimming pools, manicured lawns, fruit orchards, bespoke villas, and multi-tier boundary security in South Delhi."
      breadcrumbName="Farmhouses"
      categorySlug="farmhouse-for-sale"
      citySlug={resolvedSearchParams.city}
      properties={properties}
      categories={categories}
      cities={cities}
      searchParams={resolvedSearchParams}
    />
  );
}
