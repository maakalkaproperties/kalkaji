'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  X,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';

interface BannerItem {
  id: string;
  title: string | null;
  desktopImage: string;
  mobileImage: string;
  link: string;
  alt: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    desktopImage: '',
    mobileImage: '',
    link: '/residential-property',
    alt: '',
    isActive: true,
    displayOrder: 1,
  });

  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [saving, setSaving] = useState(false);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/banners');
      if (!res.ok) throw new Error('Failed to load banners');
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (err: any) {
      setError(err.message || 'Error loading banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      desktopImage: '',
      mobileImage: '',
      link: '/residential-property',
      alt: '',
      isActive: true,
      displayOrder: banners.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: BannerItem) => {
    setEditingBanner(b);
    setFormData({
      title: b.title || '',
      desktopImage: b.desktopImage,
      mobileImage: b.mobileImage,
      link: b.link,
      alt: b.alt,
      isActive: b.isActive,
      displayOrder: b.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'desktop') setUploadingDesktop(true);
    else setUploadingMobile(true);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Upload failed');

      if (type === 'desktop') {
        setFormData((prev) => ({ ...prev, desktopImage: resData.url }));
      } else {
        setFormData((prev) => ({ ...prev, mobileImage: resData.url }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image file.');
    } finally {
      if (type === 'desktop') {
        setUploadingDesktop(false);
        if (desktopInputRef.current) desktopInputRef.current.value = '';
      } else {
        setUploadingMobile(false);
        if (mobileInputRef.current) mobileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.desktopImage || !formData.mobileImage) {
      setError('Please provide both Desktop Banner and Mobile Banner images.');
      return;
    }

    setSaving(true);
    try {
      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save banner');

      setSuccess(
        editingBanner
          ? `Banner "${formData.title || 'Banner'}" updated successfully.`
          : 'New banner added successfully.'
      );
      setIsModalOpen(false);
      await fetchBanners();
    } catch (err: any) {
      setError(err.message || 'Error saving banner.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (banner: BannerItem) => {
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });

      if (!res.ok) throw new Error('Failed to update banner status');
      await fetchBanners();
    } catch (err: any) {
      setError(err.message || 'Error updating banner status');
    }
  };

  const handleDelete = async (b: BannerItem) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      setError(null);
      const res = await fetch(`/api/admin/banners/${b.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete banner');

      setSuccess('Banner deleted successfully.');
      await fetchBanners();
    } catch (err: any) {
      setError(err.message || 'Error deleting banner.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Homepage Banners & Hero Slider</h1>
            <p className="text-xs text-slate-500">
              Upload tailored mobile (3:2) and desktop (3:1) promotional banners.
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
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

      {/* Recommended Specs Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl flex items-center gap-3 text-xs border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Desktop Banner Specs</div>
            <div className="text-[11px] text-slate-400">
              Standard Ratio <strong>3:1</strong> (Recommended: <strong>1024 x 341 px</strong> or 1920 x 640 px)
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl flex items-center gap-3 text-xs border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Mobile Phone Banner Specs</div>
            <div className="text-[11px] text-slate-400">
              Standard Ratio <strong>3:2</strong> (Recommended: <strong>1024 x 682 px</strong> or 600 x 400 px)
            </div>
          </div>
        </div>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <span className="text-xs">Loading banners...</span>
          </div>
        ) : banners.length === 0 ? (
          <div className="p-16 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No promotional banners found. Click &quot;Add New Banner&quot; above to create one.
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                banner.isActive ? 'border-slate-200 hover:shadow-md' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    Order #{banner.displayOrder}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {banner.title || 'Untitled Banner'}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <LinkIcon className="w-3 h-3 text-red-600" />
                      <span className="font-mono">{banner.link}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleStatus(banner)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      banner.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {banner.isActive ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Active on Website</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden / Paused</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-2 text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(banner)}
                    className="p-2 text-red-600 hover:bg-red-50 border border-slate-200 rounded-xl transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Side-by-side Desktop and Mobile Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {/* Desktop Preview (Takes 2 Cols) */}
                <div className="md:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5 text-red-600" />
                      Desktop View (3:1 Ratio)
                    </span>
                    <a
                      href={banner.desktopImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative aspect-[3/1] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={banner.desktopImage}
                      alt={banner.alt || 'Desktop Banner'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Mobile Preview (Takes 1 Col) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                      Mobile Phone View (3:2 Ratio)
                    </span>
                    <a
                      href={banner.mobileImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative aspect-[3/2] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 max-w-[280px]">
                    <img
                      src={banner.mobileImage}
                      alt={banner.alt || 'Mobile Banner'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add / Edit Banner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 shrink-0">
              <h2 className="text-sm font-bold text-slate-900">
                {editingBanner ? 'Edit Promotional Banner' : 'Add New Promotional Banner'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Banner Title <span className="text-slate-400 font-normal">(Internal name)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Navratri Special Offer, Dwarka Luxury Homes"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Click Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/residential-property or /property/slug"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* 1. Desktop Banner Upload & URL */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-red-600" />
                    <span className="font-bold text-slate-900">
                      1. Desktop Banner (3:1 Ratio, 1024 x 341 px) <span className="text-red-500">*</span>
                    </span>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={desktopInputRef}
                      onChange={(e) => handleFileUpload(e, 'desktop')}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingDesktop}
                      onClick={() => desktopInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold disabled:opacity-60"
                    >
                      {uploadingDesktop ? (
                        <Loader2 className="w-3 h-3 animate-spin text-red-500" />
                      ) : (
                        <Upload className="w-3 h-3 text-red-500" />
                      )}
                      <span>{uploadingDesktop ? 'Uploading...' : 'Upload Desktop File'}</span>
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Or enter Desktop Image URL (https://... or /uploads/...)"
                  value={formData.desktopImage}
                  onChange={(e) => setFormData({ ...formData, desktopImage: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                {formData.desktopImage && (
                  <div className="relative aspect-[3/1] bg-slate-200 rounded-xl overflow-hidden border border-slate-300">
                    <img
                      src={formData.desktopImage}
                      alt="Desktop Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* 2. Mobile Banner Upload & URL */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">
                      2. Mobile Banner (3:2 Ratio, 1024 x 682 px) <span className="text-red-500">*</span>
                    </span>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={mobileInputRef}
                      onChange={(e) => handleFileUpload(e, 'mobile')}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingMobile}
                      onClick={() => mobileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold disabled:opacity-60"
                    >
                      {uploadingMobile ? (
                        <Loader2 className="w-3 h-3 animate-spin text-red-500" />
                      ) : (
                        <Upload className="w-3 h-3 text-red-500" />
                      )}
                      <span>{uploadingMobile ? 'Uploading...' : 'Upload Mobile File'}</span>
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Or enter Mobile Image URL (https://... or /uploads/...)"
                  value={formData.mobileImage}
                  onChange={(e) => setFormData({ ...formData, mobileImage: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                {formData.mobileImage && (
                  <div className="relative aspect-[3/2] bg-slate-200 rounded-xl overflow-hidden border border-slate-300 max-w-[260px]">
                    <img
                      src={formData.mobileImage}
                      alt="Mobile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alt Text (SEO)</label>
                  <input
                    type="text"
                    placeholder="e.g. Special Discounts on Delhi Luxury Apartments"
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Active & Visible on Homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
