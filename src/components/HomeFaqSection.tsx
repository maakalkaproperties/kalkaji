'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import StructuredData from '@/components/StructuredData';
import { getWhatsAppLink } from '@/lib/utils';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  displayOrder: number;
}

interface HomeFaqSectionProps {
  faqs: FaqItem[];
  agencyPhone?: string;
  agencyWhatsApp?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  ALL: 'All Questions',
  BUYING: 'Buying Guide',
  RERA: 'RERA & Legal',
  HOME_LOANS: 'Home Loans',
  INVESTMENT: 'Investment ROI',
  GENERAL: 'General & Visits',
};

export default function HomeFaqSection({
  faqs = [],
  agencyPhone = '+91 98100 00000',
  agencyWhatsApp = '+919810000000',
}: HomeFaqSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const filteredFaqs =
    selectedCategory === 'ALL'
      ? faqs
      : faqs.filter((f) => (f.category || 'GENERAL') === selectedCategory);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const faqSchemaData = {
    faqs: faqs.map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <StructuredData type="FAQPage" data={faqSchemaData} />

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Everything you need to know about buying, RERA compliance, home loans, and property investment across Delhi NCR.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
            const count = key === 'ALL' ? faqs.length : faqs.filter((f) => (f.category || 'GENERAL') === key).length;
            if (key !== 'ALL' && count === 0) return null;
            const isActive = selectedCategory === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300 hover:text-red-600'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
              No questions found in this category.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? 'border-red-200 bg-white shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                          isOpen
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 bg-red-50 text-red-600' : 'text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1 pl-13">
                      <p className="whitespace-pre-line pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
              Dedicated Advisory Team
            </span>
            <h3 className="text-lg sm:text-xl font-black">
              Still have questions about a property or locality?
            </h3>
            <p className="text-xs text-red-100 max-w-lg leading-relaxed">
              Our verified property consultants are available 7 days a week to guide you with honest advice, title verification, and zero brokerage.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={getWhatsAppLink(agencyWhatsApp, 'Hello Maa Kalkaji Properties, I have a query regarding real estate in Delhi NCR.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={`tel:${agencyPhone.replace(/\s+/g, '')}`}
              className="px-4 py-2.5 bg-white text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call Advisor</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
