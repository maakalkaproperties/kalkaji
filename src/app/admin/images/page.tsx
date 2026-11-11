'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Copy,
  Check,
  Filter,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  Building,
  Layers,
  X,
  Search,
} from 'lucide-react';
import Link from 'next/link';

interface PropertyImageItem {
  id: string;
  propertyId: string;
  url: string;
  alt: string;
  caption: string | null;
  isFeatured: boolean;
  displayOrder: number;
  imageType: string;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    slug: string;
    city?: { name: string };
  };
}

interface PropertyOption {
  id: string;
  title: string;
  slug: string;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<PropertyImageItem[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Add Image Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '',
    url: '',
    alt: '',
    caption: '',
    imageType: 'GALLERY',
    isFeatured: false,
  });
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/images');
      if (!res.ok) throw new Error('Failed to fetch images');
      const data = await res.json();
      setImages(data.images || []);
      setProperties(data.properties || []);
    } catch (err: any) {
      setError(err.message || 'Error loading media gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append('files', files[i]);
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Upload failed');

      setSuccess(`Successfully uploaded ${resData.files?.length || 1} file(s)!`);

      // If we uploaded one file, open modal with URL prefilled
      if (resData.url) {
        setFormData({
          propertyId: properties[0]?.id || '',
          url: resData.url,
          alt: resData.files?.[0]?.name || '',
          caption: '',
          imageType: 'GALLERY',
          isFeatured: false,
        });
        setIsAddModalOpen(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const res = await fetch('/api/admin/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save image record');

      setSuccess('Image successfully added to listing gallery.');
      setIsAddModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Error saving image.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (img: PropertyImageItem) => {
    if (!confirm('Are you sure you want to remove this image from the listing?')) return;

    try {
      setError(null);
      const res = await fetch(`/api/admin/images/${img.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete image');

      setSuccess('Image removed successfully.');
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Error removing image.');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    const fullUrl = text.startsWith('http') ? text : `${window.location.origin}${text}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredImages = images.filter((img) => {
    const matchesProperty = selectedPropertyFilter === 'ALL' || img.propertyId === selectedPropertyFilter;
    const matchesType = selectedTypeFilter === 'ALL' || img.imageType === selectedTypeFilter;
    const matchesSearch =
      img.alt.toLowerCase().includes(search.toLowerCase()) ||
      img.url.toLowerCase().includes(search.toLowerCase()) ||
      (img.property?.title && img.property.title.toLowerCase().includes(search.toLowerCase()));

    return matchesProperty && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Media & Image Assets</h1>
            <p className="text-xs text-slate-500">
              Manage property photos, floor plans, master layout blueprints, and local uploads.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <Upload className="w-4 h-4 text-red-500" />
            )}
            <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
          </button>

          <button
            onClick={() => {
              setFormData({
                propertyId: properties[0]?.id || '',
                url: '',
                alt: '',
                caption: '',
                imageType: 'GALLERY',
                isFeatured: false,
              });
              setIsAddModalOpen(true);
            }}
            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add by URL</span>
          </button>
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Property Filter */}
          <select
            value={selectedPropertyFilter}
            onChange={(e) => setSelectedPropertyFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">All Properties ({properties.length})</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">All Asset Types</option>
            <option value="GALLERY">Gallery Photos</option>
            <option value="FLOOR_PLAN">Floor Plans</option>
            <option value="MASTER_PLAN">Master Plans</option>
            <option value="LOCATION_MAP">Location Maps</option>
          </select>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search images or properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <span className="text-xs">Loading media library...</span>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-3">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
          <div>No media assets found matching the selected filters.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Box */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.alt || 'Property photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider ${
                        img.imageType === 'FLOOR_PLAN'
                          ? 'bg-blue-600 text-white'
                          : img.imageType === 'MASTER_PLAN'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-black/70 text-white backdrop-blur-xs'
                      }`}
                    >
                      {img.imageType.replace('_', ' ')}
                    </span>
                    {img.isFeatured && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-500 text-white rounded uppercase shadow-xs">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">
                    {img.alt || 'Property Image'}
                  </div>
                  {img.property && (
                    <Link
                      href={`/admin/properties/${img.property.id}`}
                      className="text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1 line-clamp-1"
                    >
                      <Building className="w-3 h-3 shrink-0" />
                      <span>{img.property.title}</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-3.5 pb-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => copyToClipboard(img.url, img.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                >
                  {copiedId === img.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Full Resolution"
                    className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(img)}
                    title="Delete Image"
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Image by URL / Attach */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900">Attach Image to Listing</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveImage} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Property Listing <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                >
                  <option value="">Select Property...</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://... or /uploads/..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Image Type</label>
                  <select
                    value={formData.imageType}
                    onChange={(e) => setFormData({ ...formData, imageType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  >
                    <option value="GALLERY">Gallery Photo</option>
                    <option value="FLOOR_PLAN">Floor Plan</option>
                    <option value="MASTER_PLAN">Master Plan</option>
                    <option value="LOCATION_MAP">Location Map</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alt Text (SEO)</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Bedroom"
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Preview Box */}
              {formData.url && (
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-semibold mb-1">Preview</div>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200">
                    <img
                      src={formData.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                  <span>Attach to Property</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
