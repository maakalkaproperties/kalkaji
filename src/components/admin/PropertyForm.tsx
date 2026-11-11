'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  ShieldCheck,
  Search,
  Globe,
  Sparkles,
  Upload,
  Image as ImageIcon,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

interface PropertyFormProps {
  initialData?: any;
  categories: any[];
  cities: any[];
  localities: any[];
  builders: any[];
}

export default function PropertyForm({
  initialData,
  categories,
  cities,
  localities,
  builders,
}: PropertyFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : '');
  const [priceDisplay, setPriceDisplay] = useState(initialData?.priceDisplay || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || '');
  const [cityId, setCityId] = useState(initialData?.cityId || cities[0]?.id || '');
  const [localityId, setLocalityId] = useState(initialData?.localityId || '');
  const [builderId, setBuilderId] = useState(initialData?.builderId || '');
  const [projectName, setProjectName] = useState(initialData?.projectName || '');
  const [purpose, setPurpose] = useState(initialData?.purpose || 'SALE');
  const [propertyType, setPropertyType] = useState(initialData?.propertyType || 'APARTMENT');
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms !== null && initialData?.bedrooms !== undefined ? String(initialData.bedrooms) : '');
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms !== null && initialData?.bathrooms !== undefined ? String(initialData.bathrooms) : '');
  const [carpetArea, setCarpetArea] = useState(initialData?.carpetArea ? String(initialData.carpetArea) : '');
  const [superArea, setSuperArea] = useState(initialData?.superArea ? String(initialData.superArea) : '');
  const [areaUnit, setAreaUnit] = useState(initialData?.areaUnit || 'SQ_FT');
  const [furnishing, setFurnishing] = useState(initialData?.furnishing || 'SEMI_FURNISHED');
  const [possessionStatus, setPossessionStatus] = useState(initialData?.possessionStatus || 'READY_TO_MOVE');
  const [possessionDate, setPossessionDate] = useState(initialData?.possessionDate || '');
  const [reraId, setReraId] = useState(initialData?.reraId || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [pinCode, setPinCode] = useState(initialData?.pinCode || '');
  const [published, setPublished] = useState(initialData?.published !== undefined ? initialData.published : true);
  const [featuredStatus, setFeaturedStatus] = useState(initialData?.featuredStatus || false);
  const [availabilityStatus, setAvailabilityStatus] = useState(initialData?.availabilityStatus || 'AVAILABLE');

  // Technical SEO fields
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '');

  // Images state
  const [images, setImages] = useState<Array<{ url: string; alt: string; imageType: string }>>(
    initialData?.images?.map((img: any) => ({
      url: img.url,
      alt: img.alt || '',
      imageType: img.imageType || 'GALLERY',
    })) || [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Main Property View',
        imageType: 'GALLERY',
      },
    ]
  );

  // FAQs state
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    Array.isArray(initialData?.faqs) && initialData.faqs.length > 0
      ? initialData.faqs
      : [
          {
            question: 'What is the RERA registration number for this property?',
            answer: initialData?.reraId
              ? `This project is RERA registered under number ${initialData.reraId}.`
              : 'This project is fully RERA compliant and approved with sanctioned building plans.',
          },
          {
            question: 'Are bank loans approved for this project?',
            answer: 'Yes, pre-approved home loan facilities are available from SBI, HDFC, ICICI, and Axis Bank with competitive interest rates.',
          },
        ]
  );

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, idx) => idx !== index));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter localities by selected city
  const filteredLocalities = localities.filter((loc) => loc.cityId === cityId);

  const handleAddImage = () => {
    setImages([...images, { url: '', alt: '', imageType: 'GALLERY' }]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
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

      if (resData.files && Array.isArray(resData.files)) {
        const newImages = resData.files.map((f: any) => ({
          url: f.url,
          alt: title || 'Property Image',
          imageType: 'GALLERY',
        }));
        setImages([...images, ...newImages]);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleImageChange = (index: number, field: string, value: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !price || !categoryId || !cityId || !address.trim()) {
      setError('Title, price, category, city and address are required fields.');
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      description: description.trim(),
      shortDescription: shortDescription.trim() || null,
      price: Number(price),
      priceDisplay: priceDisplay.trim() || undefined,
      categoryId,
      cityId,
      localityId: localityId || null,
      builderId: builderId || null,
      projectName: projectName.trim() || null,
      purpose,
      propertyType,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      carpetArea: carpetArea ? Number(carpetArea) : null,
      superArea: superArea ? Number(superArea) : null,
      areaUnit,
      furnishing,
      possessionStatus,
      possessionDate: possessionDate.trim() || null,
      reraId: reraId.trim() || null,
      address: address.trim(),
      pinCode: pinCode.trim() || null,
      published,
      featuredStatus,
      availabilityStatus,
      seoTitle: seoTitle.trim() || title.trim(),
      seoDescription: seoDescription.trim() || shortDescription.trim(),
      images: images.filter((img) => img.url.trim().length > 0),
      faqs: faqs.filter((f) => f.question.trim().length > 0 && f.answer.trim().length > 0),
    };

    try {
      const url = isEditing ? `/api/admin/properties/${initialData.id}` : '/api/admin/properties';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save property record.');
      }

      router.push('/admin/properties');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties"
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {isEditing ? `Edit: ${initialData.title}` : 'Add New Real Estate Property'}
            </h1>
            <p className="text-xs text-slate-500 line-clamp-1">
              Configure inventory specifications, RERA data, gallery photos, and SEO settings.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update Property' : 'Save & Publish'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: 2 Cols Main info / 1 Col Sidebar controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Primary Property Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 3 BHK Luxury Park-Facing Apartment in Sector 150 Noida"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unique URL Slug <span className="text-slate-400 font-normal">(Auto-generated if empty)</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="3-bhk-luxury-apartment-sector-150-noida"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Factual Description <span className="text-slate-400 font-normal">(Listing Cards)</span>
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Spacious 3-BHK home with wraparound balconies overlooking 40 acres of green parks..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Description & Highlights <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive description covering architecture, interior finishes, elevator access, parking, and sector advantages..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Pricing & Specifications Matrix */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Pricing, Area & Configurations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Price in INR (Numeric) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 18500000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Formatted Price Display <span className="text-slate-400 font-normal">(e.g. ₹ 1.85 Cr)</span>
                </label>
                <input
                  type="text"
                  value={priceDisplay}
                  onChange={(e) => setPriceDisplay(e.target.value)}
                  placeholder="₹ 1.85 Cr"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms (BHK)</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  placeholder="3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Super Area</label>
                <input
                  type="number"
                  value={superArea}
                  onChange={(e) => setSuperArea(e.target.value)}
                  placeholder="1950"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Carpet Area</label>
                <input
                  type="number"
                  value={carpetArea}
                  onChange={(e) => setCarpetArea(e.target.value)}
                  placeholder="1450"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Area Measurement Unit</label>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                >
                  <option value="SQ_FT">Square Feet (sq.ft.)</option>
                  <option value="SQ_YD">Square Yards (sq.yd.)</option>
                  <option value="ACRE">Acres</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Furnishing Status</label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                >
                  <option value="UNFURNISHED">Unfurnished</option>
                  <option value="SEMI_FURNISHED">Semi Furnished</option>
                  <option value="FULLY_FURNISHED">Fully Furnished</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gallery Images Management */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Property Photos & Floor Plans</h2>
                <p className="text-[11px] text-slate-500">
                  Upload photos from your computer/phone or enter image URLs directly.
                </p>
              </div>
              <div className="flex items-center gap-2">
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
                  disabled={uploadingImages}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-60"
                >
                  {uploadingImages ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span>{uploadingImages ? 'Uploading...' : 'Upload Photos'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddImage}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add URL</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
                  {/* Thumbnail Preview */}
                  <div className="w-14 h-14 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                    {img.url ? (
                      <img
                        src={img.url}
                        alt="thumb"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as any).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-5/12">
                    <input
                      type="text"
                      placeholder="Image URL (https://... or /uploads/...)"
                      value={img.url}
                      onChange={(e) => handleImageChange(idx, 'url', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="w-full md:w-3/12">
                    <input
                      type="text"
                      placeholder="Alt Text (SEO)"
                      value={img.alt}
                      onChange={(e) => handleImageChange(idx, 'alt', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="w-full md:w-3/12">
                    <select
                      value={img.imageType}
                      onChange={(e) => handleImageChange(idx, 'imageType', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="GALLERY">Gallery Photo</option>
                      <option value="FLOOR_PLAN">Floor Plan</option>
                      <option value="MASTER_PLAN">Master Plan</option>
                      <option value="LOCATION_MAP">Location Map</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Listing Specific FAQs Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-red-600" />
                  <span>Property FAQs (Listing Page Accordion)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ye questions & answers property ke listing page par stylish accordion me dikhenge aur Google FAQ schema me add honge.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {faqs.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                <HelpCircle className="w-7 h-7 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Is property ke liye koi FAQ add nahi kiya gaya hai.</p>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  + Add First Question
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider bg-red-100/70 px-2 py-0.5 rounded">
                        FAQ #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                        title="Remove FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Question <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. What is the RERA registration number and construction status?"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Answer <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Detailed answer explaining RERA, payment plan, loan approval, possession date..."
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Controls (1 Col) */}
        <div className="space-y-6">
          {/* Classification & Location Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Category & Location
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Region <span className="text-red-500">*</span>
              </label>
              <select
                value={cityId}
                onChange={(e) => {
                  setCityId(e.target.value);
                  setLocalityId('');
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Locality / Sector</label>
              <select
                value={localityId}
                onChange={(e) => setLocalityId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              >
                <option value="">Select Sector / Locality</option>
                {filteredLocalities.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Sector 150, Noida-Greater Noida Expressway"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Godrej Palm Retreat"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">RERA Registration No</label>
              <input
                type="text"
                value={reraId}
                onChange={(e) => setReraId(e.target.value)}
                placeholder="e.g. UPRERAPRJ745618"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Visibility & Badges Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Publishing & Status
            </h2>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>Published on Website</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={featuredStatus}
                onChange={(e) => setFeaturedStatus(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>Featured on Homepage</span>
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Possession Status</label>
              <select
                value={possessionStatus}
                onChange={(e) => setPossessionStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              >
                <option value="READY_TO_MOVE">Ready to Move</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
                <option value="NEW_LAUNCH">New Launch</option>
              </select>
            </div>
          </div>

          {/* Advanced Technical SEO Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">SEO & SERP Preview</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Custom title tag for Google"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Meta Description</label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="150-160 characters summary for Google search snippet"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>

            {/* Google Search Snippet Preview Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Google Snippet Preview</div>
              <div className="text-xs text-blue-700 font-semibold truncate">
                {seoTitle || title || 'Property Title | Grand Realty NCR'}
              </div>
              <div className="text-[10px] text-emerald-700 font-mono">
                grandrealtyncr.com/property/{slug || 'property-slug'}
              </div>
              <div className="text-[11px] text-slate-600 line-clamp-2">
                {seoDescription || shortDescription || 'Verified luxury property in Delhi NCR with verified RERA documentation.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
