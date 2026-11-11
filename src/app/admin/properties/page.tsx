import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  Building,
  PlusCircle,
  Eye,
  Edit,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  Users,
} from 'lucide-react';
import { formatIndianPrice } from '@/lib/utils';

export default async function AdminPropertiesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      city: true,
      locality: true,
      images: { take: 1, orderBy: { displayOrder: 'asc' } },
      _count: { select: { leads: true, siteVisits: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Property Inventory Management</h1>
          <p className="text-xs text-slate-500">
            Publish, edit, feature, and archive real estate listings across Delhi NCR ({properties.length} listings).
          </p>
        </div>

        <Link
          href="/admin/properties/new"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* 1. MOBILE RESPONSIVE CARD VIEW (Visible on phone screens < md) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {properties.map((prop) => (
          <div
            key={prop.id}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                {prop.images[0]?.url ? (
                  <img
                    src={prop.images[0].url}
                    alt={prop.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Building className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Title & Location */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[9px] uppercase">
                    {prop.category.name}
                  </span>
                  {prop.featuredStatus && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[9px] uppercase">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-xs text-slate-900 truncate mt-1">
                  {prop.title}
                </h3>

                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                  <span className="truncate">
                    {prop.locality?.name ? `${prop.locality.name}, ` : ''}
                    {prop.city.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Status Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Demand Price</div>
                <div className="text-xs font-extrabold text-slate-900">
                  {prop.priceDisplay || formatIndianPrice(prop.price)}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {prop.published ? (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                    Published
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                    Draft
                  </span>
                )}

                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold flex items-center gap-1">
                  <Users className="w-2.5 h-2.5" />
                  <span>{prop._count.leads}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href={`/property/${prop.slug}`}
                target="_blank"
                className="flex items-center justify-center gap-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live</span>
              </Link>
              <Link
                href={`/admin/properties/${prop.id}`}
                className="flex items-center justify-center gap-1 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Listing</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 2. DESKTOP TABLE VIEW (Visible on >= md screens) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Property Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Leads</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-semibold text-slate-900 max-w-xs">
                    <div className="truncate">{prop.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">/{prop.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {prop.category.name}
                    </span>
                  </td>
                  <td className="p-4">
                    {prop.locality?.name ? `${prop.locality.name}, ` : ''}
                    {prop.city.name}
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    {prop.priceDisplay || formatIndianPrice(prop.price)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {prop.published ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-500 font-bold text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                          <XCircle className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                      {prop.featuredStatus && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[9px] uppercase">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">
                    {prop._count.leads} leads
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/property/${prop.slug}`}
                      target="_blank"
                      className="inline-flex p-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200"
                      title="View on site"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/properties/${prop.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
