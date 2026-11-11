import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import PropertyListingView from '@/components/PropertyListingView';
import { getFilteredProperties } from '@/lib/propertyQueries';

export const metadata: Metadata = {
  title: 'Residential Property in Delhi NCR | Luxury Apartments, Flats & Villas',
  description:
    'Explore verified luxury 2/3/4/5 BHK residential apartments, sky penthouses, and gated villas for sale and rent across Sector 150 Noida, Golf Course Road Gurugram, and Delhi.',
  alternates: {
    canonical: '/residential-property',
  },
};

export default async function ResidentialPropertyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  const [properties, categories, cities] = await Promise.all([
    getFilteredProperties({
      categorySlug: 'residential-property',
      citySlug: resolvedSearchParams.city,
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
    <PropertyListingView
      title="Residential Properties for Sale & Rent in Delhi NCR"
      subtitle="Luxury Living & Gated Communities"
      description="Browse handpicked, RERA-compliant residential apartments, high-rise condominiums, penthouses, and luxury villas with verified construction milestones."
      breadcrumbName="Residential Property"
      categorySlug="residential-property"
      citySlug={resolvedSearchParams.city}
      properties={properties}
      categories={categories}
      cities={cities}
      searchParams={resolvedSearchParams}
    />
  );
}
