'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Phone,
  MessageCircle,
  MapPin,
  Search,
  Menu,
  X,
  Home,
  Briefcase,
  Trees,
  Layers,
  ShieldCheck,
  User,
  ChevronDown,
  Info,
  PhoneCall,
  ArrowRight,
  Crosshair,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';
import { autoTrackGPSLocation, getStoredLocation, detectLocationByIP } from '@/lib/location';

const CATEGORIES = [
  { name: 'Residential', href: '/residential-property', icon: Home },
  { name: 'Commercial', href: '/commercial-property', icon: Briefcase },
  { name: 'Plots', href: '/plots-for-sale', icon: Layers },
  { name: 'Farmhouse', href: '/farmhouse-for-sale', icon: Trees },
];

const CITIES = [
  { name: 'All Delhi NCR', slug: '' },
  { name: 'Noida', slug: 'noida' },
  { name: 'Gurugram', slug: 'gurugram' },
  { name: 'Greater Noida', slug: 'greater-noida' },
  { name: 'Greater Noida West', slug: 'greater-noida-west' },
  { name: 'Delhi', slug: 'delhi' },
  { name: 'Ghaziabad', slug: 'ghaziabad' },
  { name: 'Faridabad', slug: 'faridabad' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Select Location');
  const [headerSearch, setHeaderSearch] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Restore cached location or quietly detect by IP on mount
  React.useEffect(() => {
    const cached = getStoredLocation();
    if (cached && cached.ncrCity) {
      setSelectedCity(cached.ncrCity);
      if (cached.locality) {
        setLocationStatus(`Near ${cached.locality}`);
      }
    } else {
      // Quiet background IP detection
      detectLocationByIP()
        .then((loc) => {
          if (loc.ncrCity && loc.ncrCity !== 'All Delhi NCR') {
            setSelectedCity(loc.ncrCity);
            setLocationStatus(`Near ${loc.locality || loc.ncrCity}`);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleAutoTrackLocation = async () => {
    setIsDetectingLocation(true);
    setLocationStatus('Detecting your GPS location...');
    try {
      const loc = await autoTrackGPSLocation();
      setSelectedCity(loc.ncrCity);
      setLocationStatus(loc.locality ? `Near ${loc.locality}` : `Near ${loc.ncrCity}`);
      setLocationDropdownOpen(false);

      if (loc.ncrSlug) {
        router.push(`/property-in-${loc.ncrSlug}`);
      }
    } catch (err: any) {
      setLocationStatus(err.message || 'Could not detect location');
      setTimeout(() => setLocationStatus(null), 4000);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const agencyPhone = process.env.NEXT_PUBLIC_AGENCY_PHONE || '+91 98100 00000';
  const agencyWhatsApp = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || '+919810000000';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerSearch.trim()) {
      router.push('/residential-property');
      return;
    }
    router.push(`/residential-property?search=${encodeURIComponent(headerSearch.trim())}`);
  };

  const handleCitySelect = (cityName: string, citySlug: string) => {
    setSelectedCity(cityName);
    setLocationDropdownOpen(false);
    if (citySlug) {
      router.push(`/property-in-${citySlug}`);
    } else {
      router.push('/residential-property');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md transition-shadow border-b border-slate-200 shadow-xs">
      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-6">
        {/* Left: Logo with Maa Kalkaji Properties branding - BILKUL LEFT ME */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            href="/"
            className="flex flex-col items-center group shrink-0 text-center"
            aria-label="Maa Kalkaji Properties Home"
          >
            <img
              src="/logo.png"
              alt="Maa Kalkaji Properties"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-[9px] sm:text-[10px] font-black tracking-tight text-slate-900 leading-tight mt-0.5 group-hover:text-red-600 transition-colors uppercase whitespace-nowrap">
              Maa Kalkaji <span className="text-red-600">Properties</span>
            </span>
          </Link>

          {/* Desktop Location Selector (sits next to logo on desktop) */}
          <div className="hidden lg:block relative shrink-0">
            <button
              type="button"
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="h-8 sm:h-9 px-2 sm:px-3 rounded-lg text-xs flex items-center gap-1 sm:gap-2 hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-200/80 bg-slate-50/70"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 shrink-0" />
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[8px] sm:text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                  Select Location
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 truncate max-w-[120px]">
                  {selectedCity}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {locationDropdownOpen && (
              <div className="absolute left-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Auto Track GPS Button */}
                <div className="px-2 pb-2 mb-1.5 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={handleAutoTrackLocation}
                    disabled={isDetectingLocation}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-red-50 hover:bg-red-100/80 text-red-700 font-bold text-xs transition-colors group cursor-pointer disabled:opacity-60"
                  >
                    {isDetectingLocation ? (
                      <Loader2 className="w-4 h-4 text-red-600 animate-spin shrink-0" />
                    ) : (
                      <Crosshair className="w-4 h-4 text-red-600 shrink-0 group-hover:rotate-45 transition-transform" />
                    )}
                    <div className="flex flex-col text-left">
                      <span className="leading-tight">
                        {isDetectingLocation ? 'Locating...' : 'Detect My Location (GPS)'}
                      </span>
                      <span className="text-[10px] text-red-500 font-normal">
                        100% Free Auto-Track
                      </span>
                    </div>
                  </button>
                  {locationStatus && (
                    <div className="mt-1 px-1 text-[10px] text-slate-500 font-medium truncate">
                      📍 {locationStatus}
                    </div>
                  )}
                </div>

                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Delhi NCR Regions
                </div>
                {CITIES.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleCitySelect(c.name, c.slug)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                    {selectedCity === c.name && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Integrated Search Bar (Desktop only) */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search properties, sectors, builders (e.g. Sector 150 Noida)..."
              className="w-full pl-9 pr-20 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-3.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right: Mobile Location Selector + Mobile Menu Button + Desktop Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Location Selector Pill - RIGHT ME ON PHONE VIEW */}
          <div className="lg:hidden relative shrink-0">
            <button
              type="button"
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="h-8 px-2 rounded-lg text-xs flex items-center gap-1 hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-200/80 bg-slate-50/70"
            >
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider">
                  Location
                </span>
                <span className="text-[11px] font-bold text-slate-800 truncate max-w-[70px]">
                  {selectedCity === 'All Delhi NCR' || selectedCity === 'Select Location' ? 'NCR' : selectedCity}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {locationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Auto Track GPS Button for Mobile */}
                <div className="px-2 pb-2 mb-1.5 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={handleAutoTrackLocation}
                    disabled={isDetectingLocation}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors group cursor-pointer disabled:opacity-60"
                  >
                    {isDetectingLocation ? (
                      <Loader2 className="w-4 h-4 text-red-600 animate-spin shrink-0" />
                    ) : (
                      <Crosshair className="w-4 h-4 text-red-600 shrink-0 group-hover:rotate-45 transition-transform" />
                    )}
                    <div className="flex flex-col text-left">
                      <span className="leading-tight">
                        {isDetectingLocation ? 'Locating...' : 'Detect My Location'}
                      </span>
                      <span className="text-[10px] text-red-500 font-normal">
                        100% Free GPS Auto-Track
                      </span>
                    </div>
                  </button>
                  {locationStatus && (
                    <div className="mt-1 px-1 text-[10px] text-slate-500 font-medium truncate">
                      📍 {locationStatus}
                    </div>
                  )}
                </div>

                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Delhi NCR Regions
                </div>
                {CITIES.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleCitySelect(c.name, c.slug)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                    {selectedCity === c.name && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button (Jaha hai wahi) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <a
            href={getWhatsAppLink(agencyWhatsApp, 'Hello Maa Kalkaji Properties, I would like to consult about properties.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
          <a
            href={`tel:${agencyPhone.replace(/\s+/g, '')}`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 text-white" />
            <span>Call Expert</span>
          </a>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search properties in Delhi NCR..."
              className="w-full pl-9 pr-20 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg"
            >
              Search
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  <Icon className="w-4 h-4 text-red-600" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Explore Cities & Corridors
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              {CITIES.filter((c) => c.slug).map((c) => (
                <Link
                  key={c.name}
                  href={`/property-in-${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-red-600"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Primary Quick Links: About Us & Contact Us */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <Info className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-red-600">
                    About Us
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Maa Kalkaji Properties story &amp; heritage
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <PhoneCall className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-red-600">
                    Contact Us &amp; Office Visit
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Branch locations &amp; direct helpline
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>

          {/* Quick Direct Call & WhatsApp in Menu */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${agencyPhone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Helpline</span>
            </a>
            <a
              href={getWhatsAppLink(agencyWhatsApp, 'Hello Maa Kalkaji Properties, I would like to consult about properties.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="hover:text-red-600">
              Articles &amp; Guides
            </Link>
            <span>•</span>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-red-600 font-bold">
              Admin Desk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
