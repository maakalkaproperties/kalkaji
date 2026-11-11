import React from 'react';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import PropertyGallery from '@/components/PropertyGallery';
import EnquiryForm from '@/components/EnquiryForm';
import PropertyCard from '@/components/PropertyCard';
import StructuredData from '@/components/StructuredData';
import PropertyAnchorNav from '@/components/PropertyAnchorNav';
import FloorPlanSelector from '@/components/FloorPlanSelector';
import EmiCalculator from '@/components/EmiCalculator';
import PropertyFaqSection from '@/components/PropertyFaqSection';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Home,
  ChevronRight,
  Phone,
  MessageCircle,
  FileCheck2,
  Calendar,
  Layers,
  Sparkles,
  Car,
  Compass,
  Train,
  Plane,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  Clock,
  Download,
  Award,
  Zap,
  Flame,
  Check,
} from 'lucide-react';
import { formatIndianPrice, formatArea, getWhatsAppLink } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) return { title: 'Property Not Found' };

  const property = await prisma.property.findUnique({
    where: { slug },
    include: { city: true, category: true, images: true },
  });

  if (!property) return { title: 'Property Not Found' };

  const title = property.seoTitle || `${property.title} | Maa Kalkaji Properties`;
  const description =
    property.seoDescription ||
    property.shortDescription ||
    `${property.title} located in ${property.city.name}. Explore price, floor plans, and verified RERA details.`;

  const ogImage =
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

  return {
    title,
    description,
    alternates: {
      canonical: property.canonicalUrl || `/property/${property.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/property/${property.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: property.title }],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const redirectRule = await prisma.redirect.findUnique({
    where: { sourcePath: `/property/${slug}` },
  });
  if (redirectRule) redirect(redirectRule.targetPath);

  const property = await prisma.property.findUnique({
    where: { slug },
    include: {
      category: true,
      city: true,
      locality: true,
      builder: true,
      images: { orderBy: { displayOrder: 'asc' } },
      amenities: { include: { amenity: true } },
    },
  });

  if (!property || !property.published) notFound();

  const similarProperties = await prisma.property.findMany({
    where: {
      published: true,
      categoryId: property.categoryId,
      NOT: { id: property.id },
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      city: true,
      locality: true,
      images: { orderBy: { displayOrder: 'asc' } },
    },
  });

  const agencyPhone = process.env.NEXT_PUBLIC_AGENCY_PHONE || '+91 98100 00000';
  const agencyWhatsApp = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || '+919810000000';

  const waMessage = `Hello Maa Kalkaji Properties, I am interested in "${property.title}" (Ref: ${property.slug}). Please provide official brochure, floor plans, payment schedules, and site visit cab pickup availability.`;

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: property.category.name, url: `/${property.category.slug}` },
    { name: property.city.name, url: `/property-in-${property.city.slug}` },
    { name: property.title, url: `/property/${property.slug}` },
  ];

  // 99acres Detailed Architectural Specifications Matrix
  const specifications = [
    {
      category: 'Living & Dining Hall',
      specs: [
        'Imported Italian marble flooring with mirror polish finish',
        'Designer pop false ceiling with concealed warm LED profile lights',
        'Premium acrylic emulsion paint with anti-fungal coating (Asian Paints Royale)',
        'Heavy-duty UPVC sliding glass doors connecting to spacious balcony',
      ],
    },
    {
      category: 'Bedrooms & Master Suite',
      specs: [
        'Laminated wooden flooring in master bedroom, premium vitrified tiles in others',
        'Floor-to-ceiling modular wardrobes with soft-close Blum hardware',
        'Concealed copper piping installed for split air conditioning',
        'Ample natural daylight and cross-ventilation with Vastu-compliant layout',
      ],
    },
    {
      category: 'European Modular Kitchen',
      specs: [
        'Custom modular kitchen cabinets with quartz stone/granite countertop',
        'Branded stainless steel chimney and 4-burner glass hob included',
        'IGL piped natural gas (PNG) connection line installed',
        'Dual-bowl stainless steel sink with pull-out mixer faucet (Franke/Nirali)',
      ],
    },
    {
      category: 'Bathrooms & Sanitary Fittings',
      specs: [
        'Premium CP fittings and sanitaryware (Kohler / Grohe / Jaquar)',
        'Toughened glass partition in shower zone with rain-shower head',
        'Anti-skid designer vitrified tiles with full-height wall cladding',
        'Wall-hung WC with concealed cistern and hot/cold geyser provisions',
      ],
    },
    {
      category: 'Doors, Windows & Balconies',
      specs: [
        'Solid teak wood entrance door with multi-point smart digital lock (Yale/Godrej)',
        'Soundproof double-glazed UPVC windows for acoustic insulation',
        'Weather-resistant rustic ceramic tiles in all balconies',
        'Stainless steel railing with toughened safety glass panels',
      ],
    },
    {
      category: 'Electrical, Power & Smart Home',
      specs: [
        'Schneider / Legrand modular switches with concealed fire-resistant wiring',
        '100% DG power backup for lights, fans, refrigerator & lift',
        'Color video door phone (VDP) with intercom connected to main security gate',
        'Dedicated high-speed fiber broadband and DTH conduits pre-wired',
      ],
    },
  ];

  // 99acres Location & Connectivity Matrix (Tailored to Micro-Market)
  const isDwarka = property.locality?.name?.toLowerCase().includes('dwarka') || property.address?.toLowerCase().includes('dwarka');
  const isNoida = property.city?.slug === 'noida' || property.city?.name?.toLowerCase().includes('noida');
  const isGurugram = property.city?.slug === 'gurugram' || property.city?.name?.toLowerCase().includes('gurugram');

  const connectivityLandmarks = isDwarka
    ? [
        { icon: Train, type: 'Metro Station', name: 'Dwarka Sector 9 Metro Station', distance: '800 m', time: '3 mins' },
        { icon: Train, type: 'Metro Station', name: 'Dwarka Sector 8 Metro Station', distance: '1.2 km', time: '4 mins' },
        { icon: Plane, type: 'International Airport', name: 'IGI Airport Terminal 3', distance: '8.5 km', time: '12 mins via UER-II' },
        { icon: HeartPulse, type: 'Hospital', name: 'Venkateshwar Super Specialty Hospital', distance: '2.1 km', time: '5 mins' },
        { icon: HeartPulse, type: 'Hospital', name: 'Manipal Hospital Dwarka', distance: '2.8 km', time: '7 mins' },
        { icon: GraduationCap, type: 'Education', name: 'DPS Dwarka & Mount Carmel School', distance: '1.8 km', time: '5 mins' },
        { icon: ShoppingBag, type: 'Retail & Mall', name: 'Vegas Mall & Pacific Mall D21', distance: '3.0 km', time: '7 mins' },
        { icon: Compass, type: 'Highways & Corridors', name: 'Dwarka Expressway & UER-II Junction', distance: '2.5 km', time: '6 mins' },
      ]
    : isNoida
    ? [
        { icon: Train, type: 'Metro Station', name: 'Sector 148 / 150 Metro Station', distance: '1.2 km', time: '4 mins' },
        { icon: Plane, type: 'Airport', name: 'Upcoming Noida International Airport (Jewar)', distance: '32 km', time: '25 mins' },
        { icon: HeartPulse, type: 'Hospital', name: 'Jaypee Hospital Sector 128', distance: '12 km', time: '12 mins' },
        { icon: GraduationCap, type: 'Education', name: 'DPS Noida & Lotus Valley International', distance: '8 km', time: '10 mins' },
        { icon: ShoppingBag, type: 'Retail & Mall', name: 'DLF Mall of India & Advant Navis Park', distance: '14 km', time: '15 mins' },
        { icon: Compass, type: 'Expressway', name: 'Noida-Greater Noida Expressway', distance: '500 m', time: '2 mins' },
      ]
    : [
        { icon: Train, type: 'Metro Station', name: 'Rapid Metro / HUDA City Centre', distance: '3.5 km', time: '8 mins' },
        { icon: Plane, type: 'Airport', name: 'IGI Airport T3 via NH-48', distance: '18 km', time: '25 mins' },
        { icon: HeartPulse, type: 'Hospital', name: 'Medanta The Medicity & Fortis', distance: '6 km', time: '12 mins' },
        { icon: GraduationCap, type: 'Education', name: 'The Heritage School & GD Goenka', distance: '4 km', time: '8 mins' },
        { icon: ShoppingBag, type: 'Retail & Mall', name: 'Ambience Mall & CyberHub', distance: '10 km', time: '15 mins' },
        { icon: Compass, type: 'Expressway', name: 'Golf Course Extension Road & Dwarka Exp', distance: '800 m', time: '3 mins' },
      ];

  const defaultFloorPlans = property.images
    .filter((img) => img.imageType === 'FLOOR_PLAN' || img.imageType === 'MASTER_PLAN')
    .map((img) => ({ url: img.url, caption: img.caption || img.alt }));

  return (
    <div className="bg-white min-h-screen">
      <StructuredData type="BreadcrumbList" data={{ items: breadcrumbItems }} />
      <StructuredData type="Property" data={property} />

      {/* Top Breadcrumb Header */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-red-600 transition-colors flex items-center gap-1 font-medium">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href={`/${property.category.slug}`} className="hover:text-red-600 transition-colors font-medium">
              {property.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href={`/property-in-${property.city.slug}`} className="hover:text-red-600 transition-colors font-medium">
              {property.city.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-900 truncate max-w-xs">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. 99ACRES STYLE PROJECT TITLE & PRICING HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-2.5 max-w-4xl">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                {property.category.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                {property.purpose === 'RENT' ? 'For Rent' : 'For Sale'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RERA Verified</span>
              </span>
              {property.reraId && (
                <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  RERA Reg: <strong className="font-mono text-slate-900">{property.reraId}</strong>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-600">
              <span className="flex items-center gap-1 font-medium text-slate-800">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                {property.address}
              </span>
              {property.locality?.name && (
                <span className="text-slate-400 font-semibold">• {property.locality.name}</span>
              )}
              {property.city?.name && (
                <span className="text-slate-400 font-semibold">• {property.city.name}</span>
              )}
            </div>
          </div>

          {/* Pricing & Key Callouts */}
          <div className="lg:text-right shrink-0 bg-slate-50 lg:bg-transparent p-4 lg:p-0 rounded-2xl border lg:border-none border-slate-200 space-y-1">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              {property.purpose === 'RENT' ? 'Monthly Rent' : 'Starting Price'}
            </div>
            <div className="text-2xl sm:text-4xl font-black text-red-600 tracking-tight">
              {property.priceDisplay || formatIndianPrice(property.price)}
            </div>
            {property.superArea && (
              <div className="text-xs font-semibold text-slate-500">
                Approx. ₹{Math.round(property.price / property.superArea).toLocaleString('en-IN')} / sq.ft
              </div>
            )}
            <div className="text-xs font-bold text-emerald-700 pt-1 flex items-center lg:justify-end gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Status: {property.possessionStatus?.replace(/_/g, ' ') || 'Ready to Move'}</span>
            </div>
          </div>
        </div>

        {/* 2. 99ACRES STICKY SUB-NAVIGATION BAR */}
        <PropertyAnchorNav />

        {/* 3. HERO GALLERY SHOWCASE */}
        <div id="overview" className="space-y-6">
          <PropertyGallery images={property.images} title={property.title} />

          {/* 99acres Project Snapshot Quick-Grid */}
          <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>Property Snapshot &amp; Key Details</span>
              </h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Independent Verified Asset
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <div className="text-slate-500 flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  <span>Configuration</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {property.bedrooms ? `${property.bedrooms} BHK` : '2, 3, 4 BHK'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <div className="text-slate-500 flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bathrooms</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {property.bathrooms ? `${property.bathrooms} Baths` : '2 - 4 Baths'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <div className="text-slate-500 flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Super Area</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {property.superArea ? formatArea(property.superArea, property.areaUnit) : '1,150 – 3,200 sq.ft'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <div className="text-slate-500 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Carpet Area</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {property.carpetArea ? formatArea(property.carpetArea, property.areaUnit) : '920 – 2,600 sq.ft'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <div className="text-slate-500 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-slate-400" />
                  <span>Car Parking</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  Dedicated Stilt
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <div className="text-slate-500 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Furnishing</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {property.furnishing?.replace(/_/g, ' ') || 'Semi-Furnished'}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 4. MAIN TWO-COLUMN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLUMNS: DETAILED 99ACRES SECTIONS */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description Section */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-600" />
                <span>Project Description &amp; Architectural Concept</span>
              </h2>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
                {property.description}
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Freehold Title Deed</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Vastu Compliant Layout</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Zero Brokerage Builder Deal</span>
                </div>
              </div>
            </section>

            {/* 5. 99ACRES FLOOR PLANS & CONFIGURATIONS SELECTOR */}
            <FloorPlanSelector
              propertyTitle={property.title}
              defaultPlans={defaultFloorPlans}
            />

            {/* 6. DETAILED SPECIFICATIONS MATRIX (Room-by-Room 99acres style) */}
            <section id="specifications" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                  Craftsmanship &amp; Materials
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-600" />
                  <span>Detailed Architectural Specifications</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specifications.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2.5"
                  >
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      <span>{item.category}</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {item.specs.map((s, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. AMENITIES & SOCIETY FACILITIES */}
            <section id="amenities" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                  Modern Conveniences
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-600" />
                  <span>Amenities &amp; Building Features</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { name: 'High-Speed Automated Elevator', icon: Building2 },
                  { name: 'Dedicated Stilt Car Parking', icon: Car },
                  { name: '24/7 CCTV & Security Guard', icon: ShieldCheck },
                  { name: '100% DG Power Backup', icon: Zap },
                  { name: 'Intercom & Smart Video Door Phone', icon: Phone },
                  { name: 'Piped Natural Gas (PNG)', icon: Flame },
                  { name: 'EV Charging Points', icon: Sparkles },
                  { name: 'Terrace Garden & Lounge', icon: Home },
                ].map((amenity, idx) => {
                  const Icon = amenity.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-red-50 hover:border-red-200 transition-all flex flex-col items-center text-center gap-1.5 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform shadow-xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 leading-tight">
                        {amenity.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 8. 99ACRES LOCATION & CONNECTIVITY MATRIX */}
            <section id="connectivity" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                  Commute &amp; Accessibility
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span>Location Advantages &amp; Commute Times</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Prime positioning with immediate access to metro, expressways, healthcare, and schools.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {connectivityLandmarks.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/90 flex items-center justify-between gap-3 hover:border-red-300 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            {item.type}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate block">
                            {item.name}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-red-600 block">{item.time}</span>
                        <span className="text-[10px] text-slate-500">{item.distance}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 9. HOME LOAN EMI CALCULATOR */}
            <div id="emi-calculator">
              <EmiCalculator propertyPrice={property.price} />
            </div>

            {/* 10. DEVELOPER DOSSIER */}
            {property.builder && (
              <section id="developer" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="space-y-1 border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                    Developer Track Record
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-red-600" />
                    <span>About Developer: {property.builder.name}</span>
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {property.builder.description}
                </p>

                {property.builder.reraNo && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Developer RERA License: <strong className="font-mono text-slate-900">{property.builder.reraNo}</strong></span>
                  </div>
                )}
              </section>
            )}

            {/* 11. PROPERTY SPECIFIC FAQS */}
            <PropertyFaqSection
              faqs={property.faqs as any}
              propertyTitle={property.title}
              projectName={property.projectName}
              reraId={property.reraId}
              possessionStatus={property.possessionStatus}
            />
          </div>

          {/* RIGHT 4 COLUMNS: STICKY CONTACT & CALLBACK DESK */}
          <div className="lg:col-span-4 sticky top-28 space-y-5">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                  Maa Kalkaji Verified Desk
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2 leading-tight">
                  Schedule Guided Site Visit &amp; Official Pricing
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect with the project manager. Free doorstep AC cab pickup available across Delhi NCR.
                </p>
              </div>

              {/* Direct CTAs */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={getWhatsAppLink(agencyWhatsApp, waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${agencyPhone.replace(/\s+/g, '')}`}
                  className="py-3 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Advisor</span>
                </a>
              </div>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-400 font-semibold uppercase text-[10px]">
                    Or Request Official Callback
                  </span>
                </div>
              </div>

              <EnquiryForm
                propertyId={property.id}
                propertyTitle={property.title}
                cityId={property.cityId}
                categoryId={property.categoryId}
                leadSource="PROPERTY_DETAIL_STICKY_PANEL"
              />

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% RERA &amp; Title Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Car className="w-3.5 h-3.5 text-red-600" />
                  <span>Free Doorstep AC Cab Pickup &amp; Drop</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Zero Brokerage on Direct Builder Deal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 11. SIMILAR PROPERTIES IN SAME CATEGORY */}
        {similarProperties.length > 0 && (
          <section className="pt-10 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                  Explore Alternatives
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Similar Verified Properties in Delhi NCR
                </h2>
              </div>
              <Link
                href={`/${property.category.slug}`}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 12. 99ACRES MOBILE FIXED BOTTOM ACTION DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 shadow-2xl p-3 flex sm:hidden items-center justify-between gap-3 backdrop-blur-md">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Starting Price</span>
          <span className="text-base font-black text-red-600 leading-none">
            {property.priceDisplay || formatIndianPrice(property.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={getWhatsAppLink(agencyWhatsApp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <a
            href={`tel:${agencyPhone.replace(/\s+/g, '')}`}
            className="py-2.5 px-4 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </a>
        </div>
      </div>
    </div>
  );
}
