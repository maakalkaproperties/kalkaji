'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Building,
  Briefcase,
  Store,
  Layers,
  Trees,
  Landmark,
  Compass,
} from 'lucide-react';

const MOBILE_CATEGORIES = [
  {
    title: 'Flats & Apts',
    href: '/residential-property',
    icon: Home,
    badge: 'Popular',
    iconBg: 'bg-red-50 text-red-600 border-red-100',
  },
  {
    title: 'Luxury Villas',
    href: '/residential-property?type=Villa',
    icon: Building,
    badge: 'Luxury',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    title: 'Office Spaces',
    href: '/commercial-property?type=Office',
    icon: Briefcase,
    badge: 'High ROI',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    title: 'Retail Shops',
    href: '/commercial-property?type=Retail+Shop',
    icon: Store,
    badge: 'High Footfall',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    title: 'Freehold Plots',
    href: '/plots-for-sale',
    icon: Layers,
    badge: 'Expressway',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
  {
    title: 'Farmhouses',
    href: '/farmhouse-for-sale',
    icon: Trees,
    badge: 'Green Living',
    iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
  },
  {
    title: 'Noida City',
    href: '/locations/noida',
    icon: Landmark,
    badge: 'Top Pick',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
  },
  {
    title: 'Gurugram Hub',
    href: '/locations/gurugram',
    icon: Compass,
    badge: 'Prime',
    iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  },
];

export default function MobileCategoryStrip() {
  return (
    <div className="w-full bg-white border-b border-slate-200/80 py-3 sm:hidden relative">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="flex w-full items-start gap-2.5 overflow-x-auto no-scrollbar scrollbar-hide px-3 scroll-px-3 snap-x snap-mandatory overscroll-x-contain">
        {MOBILE_CATEGORIES.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col items-center gap-1 w-[78px] min-w-[78px] shrink-0 snap-start active:scale-95 transition-transform duration-150 select-none"
            >
              <div className="relative flex h-[70px] w-[70px] items-center justify-center rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white via-white to-slate-50 p-2 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.06)] group-hover:border-red-400 group-active:border-red-600 group-active:scale-95 transition-all overflow-hidden">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.iconBg}`}>
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
              </div>
              <div className="h-[32px] w-full flex items-center justify-center">
                <span className="text-[11px] font-bold text-center leading-[1.2] text-slate-800 group-hover:text-red-600 transition-colors line-clamp-2 px-0.5">
                  {item.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
