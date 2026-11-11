'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Building,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  Layers,
  X,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface LocalityItem {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  heading?: string | null;
  subheading?: string | null;
  pincode: string | null;
  description: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  displayOrder: number;
  city?: { id: string; name: string; slug: string };
  _count?: { properties: number };
}

interface CityItem {
  id: string;
  name: string;
  slug: string;
  state: string;
  heading?: string | null;
  tagline: string | null;
  description: string | null;
  isFeatured: boolean;
  displayOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  localities: LocalityItem[];
  _count: { properties: number };
}

export default function AdminLocationsPage() {
  const [activeTab, setActiveTab] = useState<'CITIES' | 'SECTORS'>('CITIES');
  const [cities, setCities] = useState<CityItem[]>([]);
  const [localities, setLocalities] = useState<LocalityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Search & Filters
  const [citySearch, setCitySearch] = useState('');
  const [sectorSearch, setSectorSearch] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('ALL');

  // City Modal
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CityItem | null>(null);
  const [cityForm, setCityForm] = useState({
    name: '',
    slug: '',
    state: 'Delhi NCR',
    heading: '',
    tagline: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    isFeatured: false,
    displayOrder: 0,
  });

  // Sector/Locality Modal
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<LocalityItem | null>(null);
  const [sectorForm, setSectorForm] = useState({
    cityId: '',
    name: '',
    slug: '',
    heading: '',
    subheading: '',
    pincode: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    displayOrder: 0,
  });

  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [citiesRes, localitiesRes] = await Promise.all([
        fetch('/api/admin/locations'),
        fetch('/api/admin/locations/localities'),
      ]);

      if (!citiesRes.ok || !localitiesRes.ok) {
        throw new Error('Failed to fetch location data');
      }

      const citiesData = await citiesRes.json();
      const localitiesData = await localitiesRes.json();

      setCities(citiesData.cities || []);
      setLocalities(localitiesData.localities || []);
    } catch (err: any) {
      setError(err.message || 'Error loading locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // City Handlers
  const openAddCityModal = () => {
    setEditingCity(null);
    setCityForm({
      name: '',
      slug: '',
      state: 'Delhi NCR',
      heading: '',
      tagline: '',
      description: '',
      seoTitle: '',
      seoDescription: '',
      isFeatured: false,
      displayOrder: cities.length + 1,
    });
    setIsCityModalOpen(true);
  };

  const openEditCityModal = (city: CityItem) => {
    setEditingCity(city);
    setCityForm({
      name: city.name,
      slug: city.slug,
      state: city.state,
      heading: city.heading || '',
      tagline: city.tagline || '',
      description: city.description || '',
      seoTitle: city.seoTitle || '',
      seoDescription: city.seoDescription || '',
      isFeatured: city.isFeatured,
      displayOrder: city.displayOrder,
    });
    setIsCityModalOpen(true);
  };

  const handleSaveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const url = editingCity ? `/api/admin/locations/${editingCity.id}` : '/api/admin/locations';
      const method = editingCity ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save city');

      setSuccess(
        editingCity
          ? `City "${cityForm.name}" updated successfully.`
          : `City "${cityForm.name}" added successfully.`
      );
      setIsCityModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Error saving city.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCity = async (city: CityItem) => {
    if (!confirm(`Are you sure you want to delete city "${city.name}"?`)) return;

    try {
      setError(null);
      const res = await fetch(`/api/admin/locations/${city.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete city');

      setSuccess(`City "${city.name}" deleted successfully.`);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Error deleting city.');
    }
  };

  // Sector Handlers
  const openAddSectorModal = (defaultCityId?: string) => {
    setEditingSector(null);
    setSectorForm({
      cityId: defaultCityId || (cities[0]?.id || ''),
      name: '',
      slug: '',
      heading: '',
      subheading: '',
      pincode: '',
      description: '',
      seoTitle: '',
      seoDescription: '',
      displayOrder: localities.length + 1,
    });
    setIsSectorModalOpen(true);
  };

  const openEditSectorModal = (sector: LocalityItem) => {
    setEditingSector(sector);
    setSectorForm({
      cityId: sector.cityId,
      name: sector.name,
      slug: sector.slug,
      heading: sector.heading || '',
      subheading: sector.subheading || '',
      pincode: sector.pincode || '',
      description: sector.description || '',
      seoTitle: sector.seoTitle || '',
      seoDescription: sector.seoDescription || '',
      displayOrder: sector.displayOrder,
    });
    setIsSectorModalOpen(true);
  };

  const handleSaveSector = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const url = editingSector
        ? `/api/admin/locations/localities/${editingSector.id}`
        : '/api/admin/locations/localities';
      const method = editingSector ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectorForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save sector/locality');

      setSuccess(
        editingSector
          ? `Sector "${sectorForm.name}" updated successfully.`
          : `Sector "${sectorForm.name}" added successfully.`
      );
      setIsSectorModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Error saving sector.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSector = async (sector: LocalityItem) => {
    if (!confirm(`Are you sure you want to delete sector "${sector.name}"?`)) return;

    try {
      setError(null);
      const res = await fetch(`/api/admin/locations/localities/${sector.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete sector');

      setSuccess(`Sector "${sector.name}" deleted successfully.`);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Error deleting sector.');
    }
  };

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.slug.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredLocalities = localities.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(sectorSearch.toLowerCase()) ||
      loc.slug.toLowerCase().includes(sectorSearch.toLowerCase()) ||
      (loc.city?.name && loc.city.name.toLowerCase().includes(sectorSearch.toLowerCase()));

    const matchesCity = selectedCityFilter === 'ALL' || loc.cityId === selectedCityFilter;

    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Locations & Sectors Manager</h1>
            <p className="text-xs text-slate-500">
              Manage Delhi NCR Cities, Municipal regions, Sectors, and Localities for listings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'CITIES' ? (
            <button
              onClick={openAddCityModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add City</span>
            </button>
          ) : (
            <button
              onClick={() => openAddSectorModal(selectedCityFilter !== 'ALL' ? selectedCityFilter : undefined)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sector / Locality</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Modern Tabs (Scrollable on small mobile) */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('CITIES')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'CITIES'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Cities & Regions ({cities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SECTORS')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'SECTORS'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Sectors & Localities ({localities.length})</span>
        </button>
      </div>

      {/* Tab 1: Cities & Regions */}
      {activeTab === 'CITIES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search cities..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredCities.length}</strong> cities
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-full p-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-red-600 mb-2" />
                <span className="text-xs">Loading regions...</span>
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="col-span-full p-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No cities found.
              </div>
            ) : (
              filteredCities.map((city) => (
                <div
                  key={city.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded uppercase">
                          {city.state}
                        </span>
                        <h2 className="text-base font-bold text-slate-900 mt-1">{city.name}</h2>
                        <div className="text-[11px] font-mono text-slate-400">/property-in-{city.slug}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/property-in-${city.slug}`}
                          target="_blank"
                          title="View live landing page"
                          className="p-1.5 text-slate-400 hover:text-slate-800 bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditCityModal(city)}
                          title="Edit City"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCity(city)}
                          title="Delete City"
                          className="p-1.5 text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {city.tagline && (
                      <p className="text-xs text-slate-600 italic">&ldquo;{city.tagline}&rdquo;</p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-slate-800 flex items-center justify-between">
                      <span>Sectors / Localities:</span>
                      <button
                        onClick={() => {
                          setSelectedCityFilter(city.id);
                          setActiveTab('SECTORS');
                        }}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-0.5"
                      >
                        <span>{city.localities.length} Areas</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {city.localities.slice(0, 4).map((loc) => (
                        <span
                          key={loc.id}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700"
                        >
                          {loc.name}
                        </span>
                      ))}
                      {city.localities.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{city.localities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-900">
                      {city._count.properties} Properties Listed
                    </span>
                    <button
                      onClick={() => openAddSectorModal(city.id)}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Sector</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Sectors & Localities */}
      {activeTab === 'SECTORS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {/* City selector dropdown */}
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="ALL">All Cities ({cities.length})</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sector (e.g. Sector 150, Dwarka)..."
                  value={sectorSearch}
                  onChange={(e) => setSectorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredLocalities.length}</strong> sectors
            </div>
          </div>

          {/* Mobile Sectors Card View (< md) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                <Loader2 className="w-5 h-5 animate-spin text-red-600 mx-auto mb-2" />
                <span className="text-xs">Loading sectors...</span>
              </div>
            ) : filteredLocalities.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
                No sectors or localities found for this filter.
              </div>
            ) : (
              filteredLocalities.map((sector) => (
                <div
                  key={sector.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{sector.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">/{sector.slug}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[10px] shrink-0">
                      {sector.city?.name || 'NCR'}
                    </span>
                  </div>

                  {sector.heading && (
                    <div className="text-xs text-red-700 font-bold bg-red-50/60 border border-red-100 px-2 py-1 rounded-lg">
                      <span className="text-[10px] text-red-500 uppercase tracking-wider block">Heading (H1):</span>
                      <span className="line-clamp-1">{sector.heading}</span>
                    </div>
                  )}

                  {sector.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">{sector.description}</p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">
                        PIN: <strong className="text-slate-700 font-mono">{sector.pincode || '—'}</strong>
                      </span>
                      <span>•</span>
                      <span className="text-red-700 font-bold text-[11px]">
                        {sector._count?.properties || 0} listings
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {sector.city?.slug && (
                        <Link
                          href={`/locations/${sector.city.slug}/${sector.slug}`}
                          target="_blank"
                          title="View live sector page"
                          className="p-1.5 text-slate-400 hover:text-slate-800 bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <button
                        onClick={() => openEditSectorModal(sector)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg"
                        title="Edit Sector"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSector(sector)}
                        className="p-1.5 text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg"
                        title="Delete Sector"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Sectors Table (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                <span className="text-xs">Loading sectors...</span>
              </div>
            ) : filteredLocalities.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No sectors or localities found for this filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Sector / Locality</th>
                      <th className="px-5 py-3.5">City / Region</th>
                      <th className="px-5 py-3.5">Page Heading & Description</th>
                      <th className="px-5 py-3.5">Pincode</th>
                      <th className="px-5 py-3.5">Properties Count</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLocalities.map((sector) => (
                      <tr key={sector.id} className="hover:bg-slate-50/75 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">{sector.name}</div>
                          <div className="font-mono text-slate-400 text-[10px]">/{sector.slug}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-semibold text-[11px]">
                            {sector.city?.name || 'NCR'}
                          </span>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          {sector.heading ? (
                            <div className="font-bold text-slate-900 text-xs truncate">
                              {sector.heading}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px] block">Default Heading</span>
                          )}
                          {sector.description ? (
                            <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                              {sector.description}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[10px]">No description added yet</span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-600">
                          {sector.pincode || <span className="text-slate-400 italic">—</span>}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-50 text-red-800 rounded font-semibold text-[11px]">
                            <Building className="w-3 h-3" />
                            <span>{sector._count?.properties || 0} listings</span>
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            {sector.city?.slug && (
                              <Link
                                href={`/locations/${sector.city.slug}/${sector.slug}`}
                                target="_blank"
                                title="View Live Sector Page"
                                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            )}
                            <button
                              onClick={() => openEditSectorModal(sector)}
                              title="Edit Sector Heading & Description"
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSector(sector)}
                              title="Delete Sector"
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add / Edit City */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 shrink-0">
              <h2 className="text-sm font-bold text-slate-900">
                {editingCity ? `Edit City: ${editingCity.name}` : 'Add New City / Region'}
              </h2>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCity} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    City Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Noida, Gurugram, Delhi"
                    value={cityForm.name}
                    onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State / Sub-Region</label>
                  <input
                    type="text"
                    placeholder="Delhi NCR"
                    value={cityForm.state}
                    onChange={(e) => setCityForm({ ...cityForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL Slug <span className="text-slate-400 font-normal">(Auto-generated if empty)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. noida"
                  value={cityForm.slug}
                  onChange={(e) => setCityForm({ ...cityForm, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Page Heading (H1 on Website)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified Properties for Sale & Rent in Noida"
                  value={cityForm.heading}
                  onChange={(e) => setCityForm({ ...cityForm, heading: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Marketing Tagline / Subtitle Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Modern High-Rises & Green Expressways"
                  value={cityForm.tagline}
                  onChange={(e) => setCityForm({ ...cityForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City Overview / Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief overview of infrastructure, connectivity, and real estate growth..."
                  value={cityForm.description}
                  onChange={(e) => setCityForm({ ...cityForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SEO Title Tag</label>
                  <input
                    type="text"
                    placeholder="Properties in Noida | Maa Kalkaji Properties"
                    value={cityForm.seoTitle}
                    onChange={(e) => setCityForm({ ...cityForm, seoTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SEO Meta Description</label>
                  <input
                    type="text"
                    placeholder="Explore properties in Noida..."
                    value={cityForm.seoDescription}
                    onChange={(e) => setCityForm({ ...cityForm, seoDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={cityForm.isFeatured}
                    onChange={(e) => setCityForm({ ...cityForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Featured City on Homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCityModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-1.5 disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCity ? 'Update City' : 'Create City'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Sector & Locality */}
      {isSectorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 shrink-0">
              <h2 className="text-sm font-bold text-slate-900">
                {editingSector ? `Edit Sector: ${editingSector.name}` : 'Add New Sector / Locality'}
              </h2>
              <button
                onClick={() => setIsSectorModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSector} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Parent City / Region <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={sectorForm.cityId}
                  onChange={(e) => setSectorForm({ ...sectorForm, cityId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sector / Locality Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 150, Sector 8 Dwarka, Golf Course Ext Road"
                  value={sectorForm.name}
                  onChange={(e) => setSectorForm({ ...sectorForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Slug <span className="text-slate-400 font-normal">(Auto)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="sector-150"
                    value={sectorForm.slug}
                    onChange={(e) => setSectorForm({ ...sectorForm, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="e.g. 201310"
                    value={sectorForm.pincode}
                    onChange={(e) => setSectorForm({ ...sectorForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Custom Heading & Subheading */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sector Page Heading (H1 on Website)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Properties for Sale & Rent in Sector 150, Noida"
                  value={sectorForm.heading}
                  onChange={(e) => setSectorForm({ ...sectorForm, heading: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Ye heading sector page ke top me sabse badi H1 heading ban kar dikhegi.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sector Subheading / Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sports City & Express Highway Green Belt"
                  value={sectorForm.subheading}
                  onChange={(e) => setSectorForm({ ...sectorForm, subheading: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sector Overview & Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed description of this sector/locality: infrastructure, metro connectivity, prominent builders, parks, expressway links..."
                  value={sectorForm.description}
                  onChange={(e) => setSectorForm({ ...sectorForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Ye description sector page ke header me detail text ke roop me dikhegi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SEO Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sector 150 Noida Properties | Maa Kalkaji Properties"
                    value={sectorForm.seoTitle}
                    onChange={(e) => setSectorForm({ ...sectorForm, seoTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SEO Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Buy verified apartments in Sector 150..."
                    value={sectorForm.seoDescription}
                    onChange={(e) => setSectorForm({ ...sectorForm, seoDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSectorModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-1.5 disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingSector ? 'Update Sector' : 'Create Sector'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
