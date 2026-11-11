import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  Building,
  Users,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  Layers,
  MapPin,
  Image as ImageIcon,
  Sliders,
  UserCog,
  HelpCircle,
} from 'lucide-react';
import { formatIndianPrice } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Fetch real database statistics
  const [
    totalProperties,
    publishedProperties,
    featuredProperties,
    totalLeads,
    newLeads,
    qualifiedLeads,
    scheduledVisits,
    totalCategories,
    totalCities,
    totalLocalities,
    totalImages,
    totalBanners,
    totalUsers,
    totalFaqs,
    recentLeads,
    recentProperties,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { published: true } }),
    prisma.property.count({ where: { featuredStatus: true } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.lead.count({ where: { status: 'QUALIFIED' } }),
    prisma.siteVisit.count({ where: { status: { in: ['REQUESTED', 'CONFIRMED'] } } }),
    prisma.category.count(),
    prisma.city.count(),
    prisma.locality.count(),
    prisma.propertyImage.count(),
    prisma.banner.count(),
    prisma.user.count(),
    prisma.faq.count(),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { title: true, slug: true } },
        category: { select: { name: true } },
        city: { select: { name: true } },
      },
    }),
    prisma.property.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        city: true,
        _count: { select: { leads: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
            Live Administrative Overview
          </span>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-900 mt-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-slate-500">
            Real-time Delhi NCR inventory status, CRM pipeline, and site visit schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Link
            href="/admin/properties/new"
            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </Link>
          <Link
            href="/admin/leads"
            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage CRM Leads</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Properties */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Inventory</span>
            <Building className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalProperties}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{publishedProperties} Published</span>
            <span>•</span>
            <span>{totalProperties - publishedProperties} Drafts</span>
          </div>
        </div>

        {/* Featured Properties */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Featured Properties</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{featuredProperties}</div>
          <div className="text-[11px] text-slate-500">Promoted across Homepage</div>
        </div>

        {/* Total Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">CRM Total Leads</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalLeads}</div>
          <div className="text-[11px] text-amber-600 font-semibold">
            {newLeads} Fresh Enquiries Awaiting Follow-up
          </div>
        </div>

        {/* Scheduled Site Visits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Site Visits</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{scheduledVisits}</div>
          <div className="text-[11px] text-slate-500">Confirmed or Requested visits</div>
        </div>
      </div>

      {/* Catalog & Content Management Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Banners & Sliders Card */}
        <Link
          href="/admin/banners"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-red-200 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center transition-colors shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                Banners & Hero
              </div>
              <div className="text-[11px] text-slate-500">
                {totalBanners} Mobile & Desktop
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-red-600 transition-all shrink-0" />
        </Link>

        {/* Categories Card */}
        <Link
          href="/admin/categories"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-red-200 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-red-50 text-amber-700 group-hover:text-red-700 flex items-center justify-center transition-colors shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                Categories
              </div>
              <div className="text-[11px] text-slate-500">
                {totalCategories} Defined Classes
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-red-600 transition-all shrink-0" />
        </Link>

        {/* Locations & Sectors Card */}
        <Link
          href="/admin/locations"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-red-200 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center transition-colors shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                Locations & Sectors
              </div>
              <div className="text-[11px] text-slate-500">
                {totalCities} Cities • {totalLocalities} Areas
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-red-600 transition-all shrink-0" />
        </Link>

        {/* Media & Images Card */}
        <Link
          href="/admin/images"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-red-200 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-red-50 text-slate-700 group-hover:text-red-700 flex items-center justify-center transition-colors shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                Media & Gallery
              </div>
              <div className="text-[11px] text-slate-500">
                {totalImages} Photos & Plans
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-red-600 transition-all shrink-0" />
        </Link>

        {/* Admin Accounts Card */}
        <Link
          href="/admin/users"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-red-200 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center transition-colors shrink-0">
              <UserCog className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                Staff & Logins
              </div>
              <div className="text-[11px] text-slate-500">
                {totalUsers} Login Accounts
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-red-600 transition-all shrink-0" />
        </Link>

        {/* Homepage FAQs Card */}
        <Link
          href="/admin/faqs"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-red-200 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center transition-colors shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                Homepage FAQs
              </div>
              <div className="text-[11px] text-slate-500">
                {totalFaqs} Active Questions
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-red-600 transition-all shrink-0" />
        </Link>
      </div>

      {/* Two Column Layout: Recent Leads / Recent Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Recent Leads Pipeline */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Recent Enquiries & Leads</span>
            </h2>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>View All ({totalLeads})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{lead.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{lead.leadNumber}</span>
                  </div>
                  <div className="text-xs text-slate-600 truncate">
                    {lead.property?.title || 'General Enquiry'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Ph: {lead.phone} • {lead.leadSource}
                  </div>
                </div>

                <div className="shrink-0 text-right space-y-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === 'NEW'
                        ? 'bg-amber-100 text-amber-800'
                        : lead.status === 'QUALIFIED'
                        ? 'bg-blue-100 text-blue-800'
                        : lead.status === 'SITE_VISIT_SCHEDULED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {lead.status.replace(/_/g, ' ')}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Property Inventory */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-600" />
              <span>Published Inventory</span>
            </h2>
            <Link
              href="/admin/properties"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Manage ({totalProperties})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentProperties.map((prop) => (
              <div
                key={prop.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <h3 className="font-bold text-xs text-slate-900 truncate">
                    <Link href={`/admin/properties/${prop.id}`} className="hover:text-amber-700">
                      {prop.title}
                    </Link>
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    {prop.category.name} • {prop.city.name}
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {prop.priceDisplay || formatIndianPrice(prop.price)}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href={`/property/${prop.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 bg-white border border-slate-200"
                    title="View live page"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/admin/properties/${prop.id}`}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
