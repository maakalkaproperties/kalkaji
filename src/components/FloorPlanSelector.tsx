'use client';

import React, { useState } from 'react';
import { Layers, Maximize2, Bed, Bath, Download, MessageCircle, CheckCircle2 } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export interface UnitConfig {
  type: string; // e.g. "2 BHK", "3 BHK", "4 BHK", "Penthouse"
  title: string;
  superArea: string;
  carpetArea: string;
  price: string;
  pricePerSqft?: string;
  bathrooms: number;
  balconies: number;
  facing?: string;
  planImageUrl?: string;
}

interface FloorPlanSelectorProps {
  propertyTitle: string;
  configurations?: UnitConfig[];
  defaultPlans?: { url: string; caption?: string }[];
}

export default function FloorPlanSelector({
  propertyTitle,
  configurations,
  defaultPlans = [],
}: FloorPlanSelectorProps) {
  const agencyWhatsApp = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || '+919810000000';

  // Fallback default configurations if none provided
  const unitList: UnitConfig[] = configurations && configurations.length > 0
    ? configurations
    : [
        {
          type: '2 BHK',
          title: '2 BHK Luxury Apartment / Floor',
          superArea: '1,150 sq.ft',
          carpetArea: '920 sq.ft',
          price: '₹1.15 Cr - ₹1.45 Cr',
          pricePerSqft: '₹10,000 / sq.ft',
          bathrooms: 2,
          balconies: 2,
          facing: 'Park Facing / East',
          planImageUrl: defaultPlans[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        },
        {
          type: '3 BHK',
          title: '3 BHK Premium Builder Floor',
          superArea: '1,650 sq.ft',
          carpetArea: '1,320 sq.ft',
          price: '₹1.85 Cr - ₹2.25 Cr',
          pricePerSqft: '₹11,200 / sq.ft',
          bathrooms: 3,
          balconies: 3,
          facing: 'Road Facing / Corner',
          planImageUrl: defaultPlans[1]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        },
        {
          type: '4 BHK',
          title: '4 BHK Ultra Luxury Residence',
          superArea: '2,400 sq.ft',
          carpetArea: '1,950 sq.ft',
          price: '₹2.95 Cr - ₹3.45 Cr',
          pricePerSqft: '₹12,290 / sq.ft',
          bathrooms: 4,
          balconies: 4,
          facing: 'North-East Vastu Compliant',
          planImageUrl: defaultPlans[0]?.url || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        },
        {
          type: 'Penthouse',
          title: 'Duplex Penthouse with Private Terrace',
          superArea: '3,200 sq.ft',
          carpetArea: '2,600 sq.ft',
          price: '₹3.95 Cr - ₹4.50 Cr',
          pricePerSqft: '₹12,340 / sq.ft',
          bathrooms: 5,
          balconies: 4,
          facing: 'Panoramic Open View',
          planImageUrl: defaultPlans[1]?.url || 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
        },
      ];

  const [selectedType, setSelectedType] = useState<string>(unitList[0]?.type || '3 BHK');
  const activeUnit = unitList.find((u) => u.type === selectedType) || unitList[0];

  return (
    <section id="floor-plans" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
            99acres Style Unit Matrix
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-600" />
            <span>Floor Plans &amp; Configurations</span>
          </h2>
        </div>

        {/* Tab Buttons for Unit Types */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {unitList.map((unit) => (
            <button
              key={unit.type}
              type="button"
              onClick={() => setSelectedType(unit.type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedType === unit.type
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {unit.type}
            </button>
          ))}
        </div>
      </div>

      {/* Active Configuration Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left: Interactive Layout Specs (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {activeUnit.title}
            </h3>
            <div className="text-2xl font-black text-red-600">
              {activeUnit.price}
            </div>
            {activeUnit.pricePerSqft && (
              <span className="text-xs text-slate-500 font-semibold block">
                Price: {activeUnit.pricePerSqft}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Super Built-up Area</span>
              <span className="text-sm font-extrabold text-slate-900">{activeUnit.superArea}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Carpet Area</span>
              <span className="text-sm font-extrabold text-slate-900">{activeUnit.carpetArea}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Bathrooms</span>
              <span className="text-sm font-extrabold text-slate-900">{activeUnit.bathrooms} Baths</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Balconies</span>
              <span className="text-sm font-extrabold text-slate-900">{activeUnit.balconies} Balconies</span>
            </div>
          </div>

          {activeUnit.facing && (
            <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Facing: <strong className="text-slate-900">{activeUnit.facing}</strong></span>
            </div>
          )}

          <div className="pt-2">
            <a
              href={getWhatsAppLink(
                agencyWhatsApp,
                `Hello Maa Kalkaji Properties, please send me detailed floor plan & pricing for ${activeUnit.type} in "${propertyTitle}".`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Get {activeUnit.type} Plan on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right: Layout Blueprint Diagram Preview (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-4 text-center">
          <div className="aspect-[4/3] w-full bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-inner flex items-center justify-center p-3 relative group">
            {activeUnit.planImageUrl ? (
              <img
                src={activeUnit.planImageUrl}
                alt={`${activeUnit.type} Floor Plan`}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="text-slate-400 text-xs">Architectural Blueprint Preview</div>
            )}
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
              Schematic Floor Layout
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            *Dimensions and structural configurations subject to builder approvals &amp; RERA sanctions.
          </p>
        </div>
      </div>
    </section>
  );
}
