'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Building2,
  BadgeIndianRupee,
  Home,
  Briefcase,
  Layers,
  Trees,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Crosshair,
  Loader2,
} from 'lucide-react';
import { autoTrackGPSLocation, getStoredLocation } from '@/lib/location';

interface CityOption {
  name: string;
  slug: string;
}

interface HeroPropertyFinderProps {
  cities: CityOption[];
}

const CATEGORY_TABS = [
  { id: 'residential-property', label: 'Residential', icon: Home, hint: 'Flats & Villas' },
  { id: 'commercial-property', label: 'Commercial', icon: Briefcase, hint: 'Offices & Shops' },
  { id: 'plots-for-sale', label: 'Plots', icon: Layers, hint: 'Freehold Land' },
  { id: 'farmhouse-for-sale', label: 'Farmhouse', icon: Trees, hint: 'Luxury Estates' },
];

const BUDGET_OPTIONS = [
  { label: 'Any Budget', value: '' },
  { label: 'Under ₹50 Lacs', value: '0-5000000' },
  { label: '₹50 Lacs - ₹1.5 Cr', value: '5000000-15000000' },
  { label: '₹1.5 Cr - ₹3 Cr', value: '15000000-30000000' },
  { label: '₹3 Cr - ₹5 Cr', value: '30000000-50000000' },
  { label: '₹5 Cr+ Luxury', value: '50000000-999999999' },
];

const LOCALITY_PRESETS: Record<string, string[]> = {
  noida: ['Sector 150', 'Sector 128', 'Noida Expressway', 'Sector 62', 'Sector 75'],
  gurugram: ['Golf Course Road', 'Golf Course Extn', 'Dwarka Expressway', 'Cyber City', 'Sohna Road'],
  'greater-noida': ['Pari Chowk', 'Omega 1', 'Alpha 1', 'Yamuna Expressway'],
  'greater-noida-west': ['Sector 1', 'Sector 16B', 'Gaur City 1', 'Gaur City 2'],
  delhi: ['South Delhi', 'Chhatarpur', 'Vasant Kunj', 'Dwarka'],
  ghaziabad: ['Indirapuram', 'Vaishali', 'Raj Nagar Extension'],
  faridabad: ['Sector 14', 'Sector 15', 'Neharpar (Greater Faridabad)'],
};

export default function HeroPropertyFinder({ cities }: HeroPropertyFinderProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('residential-property');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [purpose, setPurpose] = useState('SALE');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionNotice, setDetectionNotice] = useState<string | null>(null);

  // Restore cached location if available
  React.useEffect(() => {
    const cached = getStoredLocation();
    if (cached) {
      if (cached.ncrSlug) setSelectedCity(cached.ncrSlug);
      if (cached.locality) {
        setSelectedLocality(cached.locality);
        setDetectionNotice(`Auto-detected: ${cached.locality} (${cached.ncrCity})`);
      }
    }
  }, []);

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setDetectionNotice('Accessing GPS...');
    try {
      const loc = await autoTrackGPSLocation();
      if (loc.ncrSlug) {
        setSelectedCity(loc.ncrSlug);
      }
      if (loc.locality) {
        setSelectedLocality(loc.locality);
      }
      setDetectionNotice(`📍 Found: ${loc.locality || loc.ncrCity}`);
    } catch (err: any) {
      setDetectionNotice(err.message || 'Location access denied');
      setTimeout(() => setDetectionNotice(null), 4000);
    } finally {
      setIsDetecting(false);
    }
  };

  const localities = selectedCity && LOCALITY_PRESETS[selectedCity] ? LOCALITY_PRESETS[selectedCity] : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (selectedCity) params.set('city', selectedCity);
    if (selectedLocality) params.set('locality', selectedLocality);
    if (purpose) params.set('purpose', purpose);

    if (selectedBudget) {
      const [min, max] = selectedBudget.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `/${selectedCategory}?${queryString}` : `/${selectedCategory}`;
    router.push(targetUrl);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.1)] transition-all">
      {/* Header matching BatteryMantra Stepper Card */}
      <div className="mb-4 sm:mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-600 text-white shadow-xs shrink-0">
          <Search className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Find Your Property
          </h3>
          <p className="text-xs text-slate-500">
            Pick your category, city and budget for instant verified matches.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-3.5">
        {/* Step 1: Category Multi-Tab Selector */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full text-[10px] bg-red-100 text-red-600 font-bold">
                1
              </span>
              Category
            </span>
            {/* Sale / Rent Switch */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setPurpose('SALE')}
                className={`px-2.5 py-0.5 rounded-md font-bold transition-colors ${
                  purpose === 'SALE'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setPurpose('RENT')}
                className={`px-2.5 py-0.5 rounded-md font-bold transition-colors ${
                  purpose === 'RENT'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rent
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-red-600 bg-red-50/70 text-red-700 shadow-xs'
                      : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 mb-1 transition-colors ${
                      isSelected ? 'text-red-600' : 'text-slate-500 group-hover:text-slate-700'
                    }`}
                  />
                  <span className="text-xs font-bold leading-tight">{tab.label}</span>
                  <span className="text-[10px] text-slate-500 leading-none mt-0.5 hidden sm:block">
                    {tab.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: City / Location Dropdown */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span className="grid h-4 w-4 place-items-center rounded-full text-[10px] bg-red-100 text-red-600 font-bold">
                2
              </span>
              Location / City
            </label>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 hover:bg-red-100/90 px-2 py-0.5 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
            >
              {isDetecting ? (
                <Loader2 className="w-3 h-3 text-red-600 animate-spin" />
              ) : (
                <Crosshair className="w-3 h-3 text-red-600" />
              )}
              <span>{isDetecting ? 'Locating...' : 'Auto-Track GPS'}</span>
            </button>
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedLocality('');
              }}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">All Delhi NCR (Explore Everywhere)</option>
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
          {detectionNotice && (
            <p className="mt-1 text-[11px] text-red-600 font-medium flex items-center gap-1">
              {detectionNotice}
            </p>
          )}
        </div>

        {/* Step 3: Locality / Micro-Market (if city selected) OR Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span className="grid h-4 w-4 place-items-center rounded-full text-[10px] bg-red-100 text-red-600 font-bold">
                3
              </span>
              Micro Market / Sector
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              {localities.length > 0 ? (
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Sectors</option>
                  {localities.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Expressway, Sec 150"
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                />
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span className="grid h-4 w-4 place-items-center rounded-full text-[10px] bg-red-100 text-red-600 font-bold">
                4
              </span>
              Budget
            </label>
            <div className="relative">
              <BadgeIndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* BatteryMantra Primary Red Action Button */}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-[0.98] bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg h-11 sm:h-12 px-4 py-2 mt-2 w-full"
        >
          <span>Show Matching Properties</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* BatteryMantra Trust Bar at card footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium px-0.5">
        <span className="flex items-center gap-1 text-emerald-600 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Instant Match
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1 text-slate-700 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-red-600 shrink-0" /> RERA Verified
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1 text-slate-700 font-semibold">
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Free Cab Pickup
        </span>
      </div>
    </div>
  );
}
