'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw, X, Check, Crosshair, Loader2 } from 'lucide-react';
import { autoTrackGPSLocation } from '@/lib/location';

interface SearchFilterBarProps {
  categories?: Array<{ name: string; slug: string }>;
  cities?: Array<{ name: string; slug: string }>;
  currentCategorySlug?: string;
  currentCitySlug?: string;
}

export default function SearchFilterBar({
  categories = [],
  cities = [],
  currentCategorySlug = '',
  currentCitySlug = '',
}: SearchFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(currentCategorySlug || searchParams.get('category') || '');
  const [city, setCity] = useState(currentCitySlug || searchParams.get('city') || '');
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || 'SALE');
  const [bhk, setBhk] = useState(searchParams.get('bhk') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [possession, setPossession] = useState(searchParams.get('possession') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');
  const [isLocating, setIsLocating] = useState(false);

  const handleNearMe = async () => {
    setIsLocating(true);
    try {
      const loc = await autoTrackGPSLocation();
      if (loc.locality) {
        setSearch(loc.locality);
      }
      if (loc.ncrSlug) {
        setCity(loc.ncrSlug);
      }

      const params = new URLSearchParams(searchParams.toString());
      if (loc.locality) params.set('search', loc.locality);
      if (loc.ncrSlug) params.set('city', loc.ncrSlug);
      router.push(`${pathname}?${params.toString()}`);
    } catch (err: any) {
      alert(err.message || 'Could not detect location. Please check browser permissions.');
    } finally {
      setIsLocating(false);
    }
  };

  const applyFilters = (customSort?: string) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category && !pathname.includes('-property') && !pathname.includes('-for-sale')) {
      params.set('category', category);
    }
    if (city && !pathname.startsWith('/property-in-')) {
      params.set('city', city);
    }
    if (purpose && purpose !== 'ALL') params.set('purpose', purpose);
    if (bhk) params.set('bhk', bhk);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (possession) params.set('possession', possession);
    
    const activeSort = customSort || sort;
    if (activeSort && activeSort !== 'latest') params.set('sort', activeSort);

    router.push(`${pathname}?${params.toString()}`);
    setMobileDrawerOpen(false);
  };

  const handleReset = () => {
    setSearch('');
    setCategory(currentCategorySlug || '');
    setCity(currentCitySlug || '');
    setPurpose('SALE');
    setBhk('');
    setMinPrice('');
    setMaxPrice('');
    setPossession('');
    setSort('latest');
    router.push(pathname);
    setMobileDrawerOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const isResidential =
    category === 'residential-property' ||
    pathname.includes('residential-property') ||
    (!category && !pathname.includes('plots') && !pathname.includes('commercial') && !pathname.includes('farmhouse'));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 sm:p-5 mb-8">
      {/* Search Input & Quick Controls */}
      <form onSubmit={handleSearchSubmit} className="space-y-3.5">
        <div className="flex flex-col md:flex-row items-center gap-2.5 sm:gap-3">
          {/* Main Keyword Search */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by sector, locality, project or keyword (e.g. Sector 150, Godrej)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Quick Purpose Toggle (Buy / Rent) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full md:w-auto shrink-0 border border-slate-200">
            <button
              type="button"
              onClick={() => setPurpose('SALE')}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                purpose === 'SALE' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setPurpose('RENT')}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                purpose === 'RENT' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rent
            </button>
          </div>

          {/* Desktop Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0 active:scale-98"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>

          {/* Near Me Auto-Track GPS Button */}
          <button
            type="button"
            onClick={handleNearMe}
            disabled={isLocating}
            className="w-full md:w-auto px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0 active:scale-98 disabled:opacity-60 cursor-pointer"
            title="Auto-detect GPS location and find properties near you"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
            ) : (
              <Crosshair className="w-4 h-4 text-red-600" />
            )}
            <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
          </button>

          {/* Mobile Filter Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-red-600" />
            <span>Filters & Sorting</span>
          </button>
        </div>

        {/* Desktop Secondary Filters Grid */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">City / Region</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">All Delhi NCR</option>
              {cities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {!currentCategorySlug && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isResidential && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Bedrooms (BHK)</label>
              <select
                value={bhk}
                onChange={(e) => setBhk(e.target.value)}
                className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">Any BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Max Budget</label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">No Limit</option>
              <option value="5000000">Up to ₹ 50 Lakh</option>
              <option value="10000000">Up to ₹ 1.00 Cr</option>
              <option value="20000000">Up to ₹ 2.00 Cr</option>
              <option value="35000000">Up to ₹ 3.50 Cr</option>
              <option value="50000000">Up to ₹ 5.00 Cr</option>
              <option value="100000000">Up to ₹ 10.00 Cr</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Possession</label>
            <select
              value={possession}
              onChange={(e) => setPossession(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">Any Possession</option>
              <option value="READY_TO_MOVE">Ready to Move</option>
              <option value="UNDER_CONSTRUCTION">Under Construction</option>
              <option value="NEW_LAUNCH">New Launch</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                applyFilters(e.target.value);
              }}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="latest">Latest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="area_desc">Area: Large to Small</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => applyFilters()}
              className="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset all filters"
              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-red-600" />
                  <span>Filter Properties</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="">All Delhi NCR</option>
                  {cities.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {isResidential && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms (BHK)</label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="">Any BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Max Budget</label>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="">No Limit</option>
                  <option value="5000000">Up to ₹ 50 Lakh</option>
                  <option value="10000000">Up to ₹ 1.00 Cr</option>
                  <option value="20000000">Up to ₹ 2.00 Cr</option>
                  <option value="35000000">Up to ₹ 3.50 Cr</option>
                  <option value="50000000">Up to ₹ 5.00 Cr</option>
                  <option value="100000000">Up to ₹ 10.00 Cr</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Possession Status</label>
                <select
                  value={possession}
                  onChange={(e) => setPossession(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="">Any Status</option>
                  <option value="READY_TO_MOVE">Ready to Move</option>
                  <option value="UNDER_CONSTRUCTION">Under Construction</option>
                  <option value="NEW_LAUNCH">New Launch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sort Results</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="latest">Latest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="area_desc">Area: Large to Small</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => applyFilters()}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 px-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
