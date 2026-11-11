import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import PropertyListingView from '@/components/PropertyListingView';
import { getFilteredProperties } from '@/lib/propertyQueries';

export const metadata: Metadata = {
  title: 'Commercial Property in Delhi NCR | Grade-A Offices & Retail High Street',
  description:
    'Invest in high rental yield commercial office suites and retail shops across Golf Course Extension Road Gurugram, Noida Expressway, and Greater Noida West.',
  alternates: {
    canonical: '/commercial-property',
  },
};

export default async function CommercialPropertyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  const [properties, categories, cities] = await Promise.all([
    getFilteredProperties({
      categorySlug: 'commercial-property',
      citySlug: resolvedSearchParams.city,
      purpose: resolvedSearchParams.purpose,
      search: resolvedSearchParams.search,
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
      title="Commercial Office Spaces & Retail Shops in Delhi NCR"
      subtitle="Institutional Assets & High Rental Returns"
      description="Prime Grade-A commercial spaces, IT/ITES business towers, and high-street retail shops situated in high-footfall catchment zones with pre-leased tenant options."
      breadcrumbName="Commercial Property"
      categorySlug="commercial-property"
      citySlug={resolvedSearchParams.city}
      properties={properties}
      categories={categories}
      cities={cities}
      searchParams={resolvedSearchParams}
    />
  );
}
