import React from 'react';
import type { Metadata } from 'next';
import EnquiryForm from '@/components/EnquiryForm';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ShieldCheck,
  Car,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact Us | Maa Kalkaji Properties - Delhi NCR Property Advisory',
  description:
    'Contact Maa Kalkaji Properties for verified property enquiries, free AC cab site visits, and RERA due diligence across Noida, Gurugram, Greater Noida, and Delhi NCR.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  const agencyPhone = process.env.NEXT_PUBLIC_AGENCY_PHONE || '+91 98100 00000';
  const agencyWhatsApp = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || '+919810000000';
  const agencyEmail = process.env.NEXT_PUBLIC_AGENCY_EMAIL || 'enquiry@maakalkajiproperties.com';
  const agencyAddress =
    process.env.NEXT_PUBLIC_AGENCY_ADDRESS || 'Tower B, Sector 62, Noida, Uttar Pradesh 201309';

  return (
    <div className="bg-white">
      {/* 1. HERO HEADER */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-white py-10 sm:py-16 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Priority Property Advisory Desk</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Contact <span className="text-red-600">Maa Kalkaji Properties</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Have questions about residential apartments, commercial investments, or expressway plots? Reach out to our senior sector advisors or schedule a free doorstep site visit today.
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTACT DETAILS & FORM */}
      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Contact Info & Benefits (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Central Office Card */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl" />

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md">
                    <img
                      src="/logo.png"
                      alt="Maa Kalkaji Properties"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white leading-tight">
                      Maa Kalkaji Properties
                    </h2>
                    <span className="text-[11px] text-red-400 font-semibold uppercase tracking-wider">
                      Central Advisory Desk
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Corporate Office</span>
                      <span className="text-slate-300 leading-relaxed">{agencyAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">Direct Phone</span>
                      <a
                        href={`tel:${agencyPhone.replace(/\s+/g, '')}`}
                        className="hover:text-red-400 font-semibold"
                      >
                        {agencyPhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">Email Enquiries</span>
                      <a href={`mailto:${agencyEmail}`} className="hover:text-red-400">
                        {agencyEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">Advisory Hours</span>
                      <span>Monday – Sunday: 9:00 AM to 8:00 PM (IST)</span>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Action */}
                <div className="pt-4 border-t border-slate-800">
                  <a
                    href={getWhatsAppLink(agencyWhatsApp, 'Hello Maa Kalkaji Properties, I would like to schedule a property consultation.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant WhatsApp Consultation</span>
                  </a>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Site Visit &amp; Advisory Guarantees
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Free Doorstep AC Cab Pickup across Delhi NCR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% RERA Verified Legal Title Clearance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Zero Brokerage on Direct Builder Bookings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact & Consultation Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
              <div className="mb-6 space-y-1">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2.5 py-0.5 rounded-full">
                  Quick Callback
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Request a Callback or Site Visit
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in your details below and our sector specialist will contact you within 30 minutes.
                </p>
              </div>

              <EnquiryForm leadSource="CONTACT_PAGE" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
