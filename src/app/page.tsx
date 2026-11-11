import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import PropertyCard from '@/components/PropertyCard';
import EnquiryForm from '@/components/EnquiryForm';
import HeroPropertyFinder from '@/components/HeroPropertyFinder';
import MobileCategoryStrip from '@/components/MobileCategoryStrip';
import PromoBannerSection from '@/components/PromoBannerSection';
import HomeFaqSection from '@/components/HomeFaqSection';
import {
  Home,
  Briefcase,
  Layers,
  Trees,
  ShieldCheck,
  Building2,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageCircle,
  Award,
  Users,
  Compass,
  FileCheck2,
  Sparkles,
  Calendar,
  Car,
  Clock,
  BadgeCheck,
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export default async function HomePage() {
  const agencyPhone = process.env.NEXT_PUBLIC_AGENCY_PHONE || '+91 98100 00000';
  const agencyWhatsApp = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || '+919810000000';

  // 1. Fetch Featured Properties
  const featuredProperties = await prisma.property.findMany({
    where: { published: true, featuredStatus: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      city: true,
      locality: true,
      images: { orderBy: { displayOrder: 'asc' } },
    },
  });

  // 2. Fetch Latest Listed Properties
  const latestProperties = await prisma.property.findMany({
    where: { published: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      city: true,
      locality: true,
      images: { orderBy: { displayOrder: 'asc' } },
    },
  });

  // 2.5 Fetch Active Promotional Banners
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });

  // 3. Fetch Cities with property counts
  const cities = await prisma.city.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: { select: { properties: { where: { published: true } } } },
    },
  });

  // 3.5 Fetch Homepage FAQs
  const homeFaqs = await prisma.faq.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: 'asc' },
  });

  // 4. Curated Primary Categories (BatteryMantra Shop by Category)
  const categoryCatalogue = [
    {
      title: 'Residential Apartments',
      slug: 'residential-property',
      icon: Home,
      count: 'Luxury 2, 3, 4 BHK & Penthouses',
      badge: 'Bestseller',
      description: 'Gated high-rise complexes with clubhouses on Noida Expressway & Golf Course Road.',
    },
    {
      title: 'Commercial Properties',
      slug: 'commercial-property',
      icon: Briefcase,
      count: 'Grade-A Offices & Retail Shops',
      badge: 'High ROI',
      description: 'Pre-leased corporate spaces and double-height shops with 7-9% annual rental yields.',
    },
    {
      title: 'Freehold Plots',
      slug: 'plots-for-sale',
      icon: Layers,
      count: 'Authority Approved Land',
      badge: 'Jewar Airport Hub',
      description: 'Clear-title residential and commercial plots in Greater Noida and upcoming airport zones.',
    },
    {
      title: 'Luxury Farmhouses',
      slug: 'farmhouse-for-sale',
      icon: Trees,
      count: '1 to 5 Acre Country Estates',
      badge: 'Ultra Luxury',
      description: 'Sprawling countryside retreats in South Delhi (Chhatarpur) and green peripheral zones.',
    },
  ];

  const cityOptions = cities.map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="flex flex-col">
      {/* 1. BATTERYMANTRA MOBILE CATEGORY STRIP (Order-1 on Mobile) */}
      <MobileCategoryStrip />

      {/* 2. BATTERYMANTRA EXACT HERO SECTION (Light Theme + Two Column Composition) */}
      <section className="relative bg-gradient-to-b from-slate-50/90 via-white to-white border-b border-slate-200/80 pt-6 pb-10 sm:py-14 lg:py-18 overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-red-100/40 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-24 w-96 h-96 bg-red-50/50 rounded-full blur-3xl" />

        <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[88rem]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Heading, Value Prop & Direct Action CTAs */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              {/* Trust Pill matching BatteryMantra */}
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/80 px-3.5 py-1 text-xs font-semibold text-red-700 shadow-xs">
                <ShieldCheck className="h-4 w-4 text-red-600 shrink-0" />
                <span>100% RERA Verified · Free AC Cab Site Visit Pickup</span>
              </div>

              {/* H1 Heading */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight text-slate-900">
                Delhi NCR&apos;s Most Trusted<br />
                <span className="text-red-600">Real Estate Agency</span>
              </h1>

              {/* Subtitle */}
              <p className="max-w-xl text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
                Find verified luxury apartments, commercial shops, builder floors, plots &amp; farmhouses across Noida, Gurugram, Greater Noida &amp; Delhi NCR — delivered with free doorstep site visit pickup &amp; zero brokerage on builder direct bookings.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/residential-property"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-[0.98] bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg h-11 sm:h-12 rounded-xl px-6 text-sm"
                >
                  <span>Browse Properties</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={`tel:${agencyPhone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-[0.98] border border-red-300 bg-white text-red-600 hover:bg-red-50 h-11 sm:h-12 rounded-xl px-5 text-sm shadow-xs"
                >
                  <Phone className="h-4 w-4 text-red-600" />
                  <span>Call {agencyPhone}</span>
                </a>

                <a
                  href={getWhatsAppLink(agencyWhatsApp, 'Hello Grand Realty NCR, I would like to enquire about properties.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98] border border-emerald-300 bg-emerald-50/60 text-emerald-700 hover:bg-emerald-100 h-11 sm:h-12 rounded-xl px-4 text-sm"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* BatteryMantra Guarantee Checkmarks Bar */}
              <div className="pt-4 border-t border-slate-200/90 grid grid-cols-3 gap-2 sm:gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <BadgeCheck className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs">UP &amp; HRERA Verified</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Car className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs">Free AC Cab Pickup</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs">0% Brokerage Direct</span>
                </div>
              </div>
            </div>

            {/* Right Column: BatteryMantra Stepper-Style Property Finder */}
            <div className="lg:col-span-5 min-w-0">
              <HeroPropertyFinder cities={cityOptions} />
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 PROMOTIONAL BANNER SLIDER (Right above Shop by Category) */}
      <PromoBannerSection banners={banners.length > 0 ? banners : undefined} />

      {/* 3. BATTERYMANTRA "SHOP BY CATEGORY" SECTION (Curated Catalogue) */}
      <section className="w-full bg-white py-10 sm:py-14 border-b border-slate-200/80">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[88rem]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-red-600">
                Browse
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Shop by Category
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Pick from a curated catalogue of leading Delhi NCR real estate asset classes.
              </p>
            </div>
            <Link
              href="/residential-property"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <span>View All Categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {categoryCatalogue.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-red-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 group-hover:bg-red-50 group-hover:border-red-200 transition-colors shrink-0">
                        <Icon className="w-6 h-6 text-slate-700 group-hover:text-red-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-red-600 mt-1">
                      {cat.count}
                    </p>
                    <p className="hidden sm:block text-xs text-slate-500 mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-red-600">
                    <span>Explore Listings</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROPERTIES (BatteryMantra Product Grid) */}
      {featuredProperties.length > 0 && (
        <section className="w-full py-10 sm:py-14 bg-slate-50/50">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[88rem]">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                  Handpicked &amp; Verified
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Featured Properties
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Top-rated projects with confirmed RERA registration, prime connectivity, and transparent developer terms.
                </p>
              </div>
              <Link
                href="/residential-property"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
              >
                <span>View All Properties</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/residential-property"
                className="inline-flex items-center justify-center gap-1.5 w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-xs"
              >
                <span>View All Properties</span>
                <ArrowRight className="w-3.5 h-3.5 text-red-600" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. BROWSE BY CITY / DELHI NCR REGION */}
      <section id="cities" className="w-full bg-white py-10 sm:py-14 border-t border-slate-200/80">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[88rem]">
          <div className="text-center max-w-xl mx-auto space-y-1 mb-6 sm:mb-8">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
              NCR Micro-Markets
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Explore Properties by City
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Discover verified residential and commercial opportunities across top Delhi NCR growth corridors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/property-in-${city.slug}`}
                className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-red-400 hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                      {city._count.properties} {city._count.properties === 1 ? 'Listing' : 'Listings'}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    {city.name}
                  </h3>
                  {city.tagline && (
                    <p className="hidden sm:block text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                      {city.tagline}
                    </p>
                  )}
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 group-hover:text-red-600 font-bold">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LATEST PROPERTY INVENTORY */}
      {latestProperties.length > 0 && (
        <section className="w-full py-10 sm:py-14 bg-slate-50/50 border-t border-slate-200/80">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[88rem]">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                  Fresh Inventory
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Latest Property Listings
                </h2>
              </div>
              <Link
                href="/residential-property"
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {latestProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. WHY MAA KALKAJI PROPERTIES (BatteryMantra Dark Crimson Layout) */}
      <section className="w-full bg-white py-10 sm:py-14 border-t border-slate-200/80">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[88rem]">
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center shadow-xl">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
                Why Maa Kalkaji Properties
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Transparent, RERA-First Real Estate
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                We independently cross-verify building sanctions, RERA disclosures, and title certificates before listing any property.
              </p>
              <div>
                <a
                  href={getWhatsAppLink(agencyWhatsApp, 'Hello Maa Kalkaji Properties, I would like to schedule a property consultation.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Senior Advisor</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                <ShieldCheck className="w-7 h-7 text-red-500" />
                <h3 className="text-sm font-bold text-white">100% RERA Diligence</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  UP RERA and HRERA verification on sanctions, escrow accounts, and construction progress.
                </p>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                <Award className="w-7 h-7 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Direct Builder Rates</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authentic developer pricing, transparent payment schedules, and zero undisclosed markup.
                </p>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                <Compass className="w-7 h-7 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Chauffeur-Driven Site Visits</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dedicated door-to-door cab pickup with an in-depth micro-market specialist.
                </p>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                <Users className="w-7 h-7 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Complete Transaction Support</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  From home loan sanction (HDFC, SBI, ICICI) to registry handover and possession assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7.5 FREQUENTLY ASKED QUESTIONS (FAQS) */}
      <HomeFaqSection
        faqs={homeFaqs}
        agencyPhone={agencyPhone}
        agencyWhatsApp={agencyWhatsApp}
      />

      {/* 8. REQUEST A CALLBACK / ENQUIRY SECTION */}
      <section className="w-full bg-slate-50/60 py-10 sm:py-14 border-t border-slate-200/80 mb-6">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[88rem]">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
                  Priority Advisory
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Request a Callback or Property Consultation
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Leave your requirements and our sector specialist will contact you within 30 minutes with verified inventory matching your exact budget.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-4 text-xs font-bold">
                <a
                  href={`tel:${agencyPhone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-1.5 text-white hover:text-red-400"
                >
                  <Phone className="w-4 h-4 text-red-500" />
                  <span>{agencyPhone}</span>
                </a>
                <span className="text-slate-700">|</span>
                <a
                  href={getWhatsAppLink(agencyWhatsApp, 'Hello Maa Kalkaji Properties, I would like to request a callback.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="p-6 sm:p-10 bg-slate-50/40">
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Enter Your Contact Details
              </h3>
              <EnquiryForm leadSource="HOMEPAGE_CALLBACK_SECTION" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
