'use client';

import React, { useState, useEffect } from 'react';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'floor-plans', label: 'Floor Plans' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'connectivity', label: 'Connectivity & Location' },
  { id: 'emi-calculator', label: 'EMI Calculator' },
  { id: 'developer', label: 'Developer' },
  { id: 'faqs', label: 'FAQs' },
];

export default function PropertyAnchorNav() {
  const [activeTab, setActiveTab] = useState('overview');

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200 shadow-xs py-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => scrollToSection(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
