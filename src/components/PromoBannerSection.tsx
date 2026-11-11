'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PromoBannerItem {
  id: string;
  // Standard Dimensions:
  // Desktop: 1024 x 341 px (Aspect Ratio 3:1)
  // Mobile: 1024 x 682 px (Aspect Ratio 3:2)
  desktopImage: string;
  mobileImage: string;
  link: string;
  alt: string;
  title?: string | null;
}

// =========================================================================
// BANNER CONFIGURATION LIST:
// Aap naye banners yahan add kar sakte hain isi standard size mein:
// - Desktop Size: 1024 x 341 px
// - Mobile Size:  1024 x 682 px
// =========================================================================
const PROMO_BANNERS: PromoBannerItem[] = [
  {
    id: 'diwali-dhamaka-2026',
    desktopImage: '/banners/diwali-banner-desktop.png',
    mobileImage: '/banners/diwali-banner-mobile.jpg',
    link: '/residential-property',
    alt: 'Diwali Dhamaka - Apna Sapno Ka Ghar Ab Aur Bhi Kareeb | Special Property Offers',
    title: 'Diwali Property Dhamaka',
  },
];

interface PromoBannerSectionProps {
  banners?: PromoBannerItem[];
}

export default function PromoBannerSection({ banners = PROMO_BANNERS }: PromoBannerSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 6 seconds when more than 1 banner exists
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, banners.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <section className="w-full bg-slate-50/70 py-3 sm:py-5 border-b border-slate-200/80">
      <div className="mx-auto w-full px-3 sm:px-6 lg:px-8 max-w-[88rem]">
        {/* Banner Card Container matching BatteryMantra clean rounded border */}
        <div
          className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-slate-200/90 transition-all duration-300 bg-white"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Clickable Banner Link */}
          <Link
            href={currentBanner.link || '/residential-property'}
            className="block relative w-full select-none cursor-pointer overflow-hidden"
          >
            {/* 1. Desktop Banner (1024 x 341 - 3:1 Ratio) */}
            <div className="hidden sm:block w-full aspect-[3/1]">
              <img
                src={currentBanner.desktopImage}
                alt={currentBanner.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                loading="eager"
              />
            </div>

            {/* 2. Mobile Banner (1024 x 682 - 3:2 Ratio) */}
            <div className="block sm:hidden w-full aspect-[3/2]">
              <img
                src={currentBanner.mobileImage}
                alt={currentBanner.alt}
                className="w-full h-full object-cover active:scale-[0.99] transition-transform duration-200"
                loading="eager"
              />
            </div>
          </Link>

          {/* Navigation Arrows (visible when more than 1 banner) */}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Banner"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/30 transition-all active:scale-90 shadow-md opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Banner"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/30 transition-all active:scale-90 shadow-md opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    aria-label={`Slide ${idx + 1}`}
                    className={`transition-all rounded-full ${
                      idx === currentIndex
                        ? 'w-6 h-1.5 bg-red-500'
                        : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
