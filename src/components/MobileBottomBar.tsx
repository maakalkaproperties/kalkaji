'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Grid3X3,
  Search,
  MessageCircle,
  Phone,
  Calendar,
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';
import EnquiryModal from './EnquiryModal';

export default function MobileBottomBar() {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const agencyPhone = process.env.NEXT_PUBLIC_AGENCY_PHONE || '+91 98100 00000';
  const agencyWhatsApp = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || '+919810000000';

  const isHome = pathname === '/';
  const isCategories = pathname.includes('-property') || pathname.includes('-for-sale');

  return (
    <>
      {/* BatteryMantra Exact Mobile Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t border-slate-200/80 bg-white/95 px-2 pb-safe backdrop-blur-lg sm:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        {/* 1. Home Tab */}
        <Link
          href="/"
          className={`relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors active:scale-95 duration-150 ${
            isHome ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          {isHome && (
            <span className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-red-600 shadow-xs" />
          )}
          <Home className={`h-5 w-5 ${isHome ? 'stroke-[2.5] text-red-600' : 'text-slate-500'}`} />
          <span className="text-[10px] leading-none">Home</span>
        </Link>

        {/* 2. Categories Tab */}
        <Link
          href="/residential-property"
          className={`relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors active:scale-95 duration-150 ${
            isCategories ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          {isCategories && (
            <span className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-red-600 shadow-xs" />
          )}
          <Grid3X3 className="h-5 w-5" />
          <span className="text-[10px] leading-none">Categories</span>
        </Link>

        {/* 3. Search / Filter Tab */}
        <Link
          href="/residential-property?focus=search"
          className="relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors active:scale-95 duration-150 text-slate-500 hover:text-slate-800 font-medium"
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] leading-none">Search</span>
        </Link>

        {/* 4. WhatsApp Tab (Instant 1-Tap) */}
        <a
          href={getWhatsAppLink(agencyWhatsApp, 'Hello Grand Realty NCR, I would like to enquire about properties.')}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors active:scale-95 duration-150 text-emerald-600 font-semibold"
        >
          <MessageCircle className="h-5 w-5 fill-emerald-100 text-emerald-600" />
          <span className="text-[10px] leading-none">WhatsApp</span>
        </a>

        {/* 5. Site Visit / Callback Tab */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors active:scale-95 duration-150 text-red-600 font-bold"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] leading-none">Book Visit</span>
        </button>
      </nav>

      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule a Site Visit or Request Callback"
        leadSource="MOBILE_BOTTOM_BAR"
      />
    </>
  );
}
