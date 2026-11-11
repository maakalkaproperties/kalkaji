import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  MessageCircle,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { formatIndianPrice, formatArea, getWhatsAppLink } from '@/lib/utils';

export interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    slug: string;
    price: number;
    priceDisplay?: string;
    shortDescription?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    superArea?: number | null;
    carpetArea?: number | null;
    areaUnit?: string;
    propertyType: string;
    purpose: string;
    possessionStatus?: string | null;
    verifiedStatus: boolean;
    featuredStatus: boolean;
    address: string;
    city: { name: string; slug: string };
    locality?: { name: string; slug: string } | null;
    category: { name: string; slug: string };
    images?: Array<{ url: string; alt: string; isFeatured: boolean }>;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const agencyWhatsApp = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || '+919810000000';
  
  const displayImage =
    property.images?.find((img) => img.isFeatured)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  const imageAlt = property.images?.[0]?.alt || property.title;
  const area = property.superArea || property.carpetArea;
  const areaFormatted = formatArea(area, property.areaUnit || 'SQ_FT');

  const waMessage = `Hello Grand Realty NCR, I am interested in "${property.title}" (Ref: ${property.slug}). Please share floor plans, brochure, and final price breakdown.`;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-red-300 transition-all duration-300 flex flex-col h-full">
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={imageAlt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges (BatteryMantra Crimson accent) */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {property.category.name}
          </span>
          {property.featuredStatus && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
          {property.purpose === 'RENT' && (
            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Rent
            </span>
          )}
        </div>

        {/* Verified RERA Badge */}
        {property.verifiedStatus && (
          <div className="absolute top-2.5 right-2.5 z-10 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified</span>
          </div>
        )}

        {/* Price Tag in Image Lower Left */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <div className="text-white text-base sm:text-lg font-black tracking-tight drop-shadow-md">
            {property.priceDisplay || formatIndianPrice(property.price)}
          </div>
          {property.possessionStatus && (
            <span className="text-[10px] text-slate-200 flex items-center gap-1 font-semibold drop-shadow">
              <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
              {property.possessionStatus.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Location */}
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate font-medium">
              {property.locality?.name && property.locality?.slug ? (
                <Link
                  href={`/locations/${property.city.slug}/${property.locality.slug}`}
                  className="hover:text-red-600 hover:underline"
                >
                  {property.locality.name}
                </Link>
              ) : property.locality?.name ? (
                property.locality.name
              ) : null}
              {property.locality?.name ? ', ' : ''}
              <Link
                href={`/locations/${property.city.slug}`}
                className="hover:text-red-600 hover:underline"
              >
                {property.city.name}
              </Link>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
            <Link href={`/property/${property.slug}`}>{property.title}</Link>
          </h3>

          {/* Specifications Pills */}
          <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs text-slate-600 border-t border-slate-100">
            {property.bedrooms && (
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bedrooms} BHK</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{areaFormatted}</span>
              </div>
            )}
          </div>

          {property.shortDescription && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-0.5">
              {property.shortDescription}
            </p>
          )}
        </div>

        {/* Action Buttons Row (BatteryMantra Red Primary + WhatsApp) */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <Link
            href={`/property/${property.slug}`}
            className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-98"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>
          <a
            href={getWhatsAppLink(agencyWhatsApp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-xs active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
}
