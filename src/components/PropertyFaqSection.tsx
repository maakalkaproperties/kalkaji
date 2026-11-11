'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';
import StructuredData from '@/components/StructuredData';

interface FaqItem {
  question: string;
  answer: string;
}

interface PropertyFaqSectionProps {
  faqs?: FaqItem[] | null;
  propertyTitle: string;
  projectName?: string | null;
  reraId?: string | null;
  possessionStatus?: string | null;
}

export default function PropertyFaqSection({
  faqs,
  propertyTitle,
  projectName,
  reraId,
  possessionStatus,
}: PropertyFaqSectionProps) {
  const name = projectName || propertyTitle;

  // Build combined FAQ list: user-defined FAQs first, followed by standard fallback if empty
  const defaultFaqs: FaqItem[] = [
    {
      question: `What is the official RERA registration number of ${name}?`,
      answer: reraId
        ? `${name} is registered under RERA with license number ${reraId}. All construction milestones, escrow accounts, and title approvals comply with regulatory norms.`
        : `${name} is verified for legal title clearance, sanctioned layout plans, and RERA registration compliance. Contact our verified desk for the official dossier.`,
    },
    {
      question: `Which banks have approved home loans for ${name}?`,
      answer: `Leading nationalized and private banks including State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank, and Bank of Baroda have approved ${name} for home loans up to 80-85% of property value with competitive interest rates.`,
    },
    {
      question: `What is the current possession status and timeline?`,
      answer: possessionStatus
        ? `The current possession status is ${possessionStatus.replace(/_/g, ' ')}. Handover schedules are guaranteed as per builder-buyer agreement and RERA filings.`
        : `Ready to move & under-construction phases are available with immediate handover certificates for completed towers.`,
    },
    {
      question: `Is there any brokerage charged by Maa Kalkaji Properties for booking this property?`,
      answer: `No! We charge 100% ZERO brokerage on fresh builder allotments and primary transactions for ${name}. You get direct builder pricing plus our dedicated advisory support at no extra cost.`,
    },
    {
      question: `How can I arrange a guided site visit for ${name}?`,
      answer: `You can click the "WhatsApp" or "Book Visit" button to schedule a private walkthrough. We offer complimentary doorstep AC cab pickup and drop for you and your family across Delhi NCR.`,
    },
  ];

  const items: FaqItem[] = Array.isArray(faqs) && faqs.length > 0 ? faqs : defaultFaqs;

  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqSchemaData = {
    faqs: items.map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
  };

  return (
    <section id="faqs" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <StructuredData type="FAQPage" data={faqSchemaData} />

      <div className="space-y-1 border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
            Frequently Asked Questions
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 mt-1">
            <HelpCircle className="w-5 h-5 text-red-600" />
            <span>FAQs about {name}</span>
          </h2>
          <p className="text-xs text-slate-500">
            Answers to common questions about legal verification, bank approvals, possession, and pricing.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {items.length} Questions Answered
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? 'border-red-200 bg-red-50/20 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                      isOpen
                        ? 'bg-red-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    Q{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {item.question}
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 bg-red-100 text-red-600' : 'text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-red-100/60 mt-1 pl-13">
                  <p className="whitespace-pre-line pt-2">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
        <span>
          Have another question about this property? Click on the <strong>&ldquo;WhatsApp&rdquo;</strong> button on the right to talk directly to the dedicated project manager.
        </span>
      </div>
    </section>
  );
}
