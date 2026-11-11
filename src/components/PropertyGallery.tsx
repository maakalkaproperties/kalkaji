'use client';

import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface GalleryImage {
  id?: string;
  url: string;
  alt: string;
  isFeatured?: boolean;
  imageType?: string;
}

interface PropertyGalleryProps {
  images: GalleryImage[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const galleryImages = images.length > 0 ? images : [
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      alt: title,
    },
  ];

  const currentImage = galleryImages[activeIndex] || galleryImages[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Showcase */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-900 rounded-2xl overflow-hidden cursor-pointer group shadow-md"
      >
        <img
          src={currentImage.url}
          alt={currentImage.alt || title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold">
          <Eye className="w-3.5 h-3.5" />
          <span>
            {activeIndex + 1} / {galleryImages.length}
          </span>
        </div>

        {/* Expand Icon */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4" />
        </div>

        {/* Prev / Next Controls */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md transition-all active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md transition-all active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[16/10] w-20 sm:w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                idx === activeIndex
                  ? 'border-red-600 scale-98 shadow-xs'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={img.alt || `Photo ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-white">
            <div className="text-xs sm:text-sm font-semibold truncate max-w-md">{title}</div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-white hover:text-amber-400 rounded-full"
              aria-label="Close full view"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-8">
            <img
              src={currentImage.url}
              alt={currentImage.alt || title}
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="text-center text-xs text-slate-400">
            Image {activeIndex + 1} of {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
