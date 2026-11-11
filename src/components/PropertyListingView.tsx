import React from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import SearchFilterBar from '@/components/SearchFilterBar';
import StructuredData from '@/components/StructuredData';
import { Home, ChevronRight, Building, HelpCircle, MapPin } from 'lucide-react';

interface PropertyListingViewProps {
  title: string;
  subtitle: string;
  description?: string;
  breadcrumbName: string;
  breadcrumbParent?: { name: string; url: string };
  categorySlug?: string;
  citySlug?: string;
  localitySlug?: string;
  localities?: Array<{ id: string; name: string; slug: string; _count?: { properties: number } }>;
  properties: any[];
  categories: any[];
  cities: any[];
  searchParams: Record<string, string | undefined>;
}

export default function PropertyListingView({
  title,
  subtitle,
  description,
  breadcrumbName,
  breadcrumbParent,
  categorySlug,
  citySlug,
  localitySlug,
  localities,
  properties,
  categories,
  cities,
  searchParams,
}: PropertyListingViewProps) {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
  ];

  if (breadcrumbParent) {
    breadcrumbItems.push(breadcrumbParent);
  }

  breadcrumbItems.push({
    name: breadcrumbName,
    url: localitySlug && citySlug
      ? `/locations/${citySlug}/${localitySlug}`
      : categorySlug
      ? `/${categorySlug}`
      : `/locations/${citySlug}`,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      <StructuredData type="BreadcrumbList" data={{ items: breadcrumbItems }} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
        <Link href="/" className="hover:text-red-600 transition-colors flex items-center gap-1 font-medium">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        {breadcrumbParent && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href={breadcrumbParent.url} className="hover:text-red-600 transition-colors font-medium">
              {breadcrumbParent.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-slate-900">{breadcrumbName}</span>
      </nav>

      {/* Header and Intro */}
      <div className="space-y-2 max-w-4xl">
        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded inline-block">
          {subtitle}
        </span>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl whitespace-pre-line">
            {description}
          </p>
        )}
      </div>

      {/* Sectors / Micro-Markets Navigation Strip */}
      {localities && localities.length > 0 && (
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              Sectors & Micro-Markets in {cities.find(c => c.slug === citySlug)?.name || 'Region'}:
            </span>
            {localitySlug && (
              <Link
                href={`/locations/${citySlug}`}
                className="text-[11px] text-red-600 hover:underline font-semibold"
              >
                View All Sectors
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {localities.map((loc) => {
              const isActive = localitySlug === loc.slug;
              return (
                <Link
                  key={loc.id}
                  href={`/locations/${citySlug}/${loc.slug}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs font-bold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300 hover:text-red-600 font-medium'
                  }`}
                >
                  <span>{loc.name}</span>
                  {loc._count && loc._count.properties > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {loc._count.properties}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Search & Multi-Faceted Filter Engine */}
      <SearchFilterBar
        categories={categories}
        cities={cities}
        currentCategorySlug={categorySlug}
        currentCitySlug={citySlug}
      />

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-200 pb-2.5">
        <div>
          Showing <span className="font-bold text-slate-900">{properties.length}</span> verified properties
          {searchParams.search && <span> for &ldquo;{searchParams.search}&rdquo;</span>}
          {searchParams.purpose && <span> for {searchParams.purpose === 'RENT' ? 'Rent' : 'Sale'}</span>}
        </div>
      </div>

      {/* Property Cards Grid (Responsive: 1 col on mobile phone, 2 on tablet, 3 on desktop) */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <Building className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Matching Properties Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We currently don&apos;t have properties matching this specific combination of filters. Try broadening your budget or clearing locality filters to see more results.
          </p>
          <div>
            <Link
              href={categorySlug ? `/${categorySlug}` : '/residential-property'}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
            >
              Reset Filters
            </Link>
          </div>
        </div>
      )}

      {/* Bottom Legal & Regulatory Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900">Looking for unlisted inventory or upcoming pre-launches?</div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Our Delhi NCR desk works with verified developers on private resale opportunities and pre-launch allotments. Connect with our advisory team to get confidential developer decks.
          </p>
        </div>
      </div>
    </div>
  );
}
