import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Car,
  FileCheck2,
  HeartHandshake,
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About Us | Maa Kalkaji Properties - Delhi NCR Premier Real Estate Agency',
  description:
    'Learn about Maa Kalkaji Properties, an independent real estate advisory firm dedicated to transparent, RERA-verified property discovery across Noida, Gurugram, Greater Noida, and Delhi NCR.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const agencyPhone = process.env.NEXT_PUBLIC_AGENCY_PHONE || '+91 98100 00000';
  const agencyWhatsApp = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || '+919810000000';

  const milestones = [
    { number: '1,500+', label: 'Happy Families Settled', desc: 'Across luxury flats, villas & plots' },
    { number: '150+', label: 'RERA Verified Projects', desc: 'Pre-screened title & sanction checks' },
    { number: '₹500 Cr+', label: 'Property Transacted', desc: 'Residential & commercial volume' },
    { number: '100%', label: 'Transparency & Trust', desc: 'Zero hidden fees & direct builder pricing' },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% RERA Diligence',
      desc: 'We independently cross-verify RERA registration, master layout plans, escrow account status, and environmental clearances before publishing any project.',
    },
    {
      icon: Award,
      title: 'Direct Builder Pricing',
      desc: 'Transparent pricing with developer agreements. Zero hidden markups and maximum festive booking benefits for our buyers.',
    },
    {
      icon: Car,
      title: 'Free AC Cab Site Visits',
      desc: 'Doorstep pickup and drop service across Delhi, Noida, and Gurugram with a dedicated micro-market property specialist.',
    },
    {
      icon: FileCheck2,
      title: 'Complete Registry & Loan Support',
      desc: 'Full assistance with bank home loans (SBI, HDFC, ICICI), legal documentation, title verification, and registry execution.',
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-white py-12 sm:py-20 border-b border-slate-200/80 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-red-100/40 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-24 w-96 h-96 bg-red-50/50 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Independent Real Estate Advisory · Delhi NCR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              About <span className="text-red-600">Maa Kalkaji Properties</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
              Founded on the pillars of spiritual trust, institutional integrity, and fiduciary commitment, Maa Kalkaji Properties is your premier advisory for verified residential apartments, commercial towers, freehold plots, and luxury farmhouses across Delhi NCR.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>Connect with Our Advisors</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={getWhatsAppLink(agencyWhatsApp, 'Hello Maa Kalkaji Properties, I would like to know more about your services.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Directly</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & MILESTONES */}
      <section className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-red-300 hover:shadow-md transition-all text-center sm:text-left"
              >
                <div className="text-2xl sm:text-4xl font-black text-red-600 mb-1">
                  {m.number}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {m.label}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR STORY & MISSION */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Brand Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-slate-950 text-white p-7 sm:p-10 shadow-2xl overflow-hidden border border-slate-800">
                <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 bg-red-600/30 rounded-full blur-3xl" />
                
                <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md mb-6">
                  <img
                    src="/logo.png"
                    alt="Maa Kalkaji Properties"
                    className="w-full h-full object-contain"
                  />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
                  Our Mission
                </span>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-3 mb-4 leading-tight">
                  Transforming NCR Property Buying into a Pure, Transparent Experience
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  Named with reverence to Maa Kalkaji, our agency operates with unshakeable moral integrity. We refuse to advertise non-compliant projects, fake discounts, or unverified claims.
                </p>

                <div className="pt-4 border-t border-slate-800 flex items-center gap-4 text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> 100% Legal Clearances
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-red-400">
                    <HeartHandshake className="w-4 h-4" /> Fiduciary Loyalty
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Detailed Description */}
            <div className="lg:col-span-7 space-y-5 text-slate-700 text-sm sm:text-base leading-relaxed">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                Who We Are
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Your Trusted Real Estate Partner Across Noida, Gurugram &amp; Delhi
              </h2>

              <p>
                The Delhi NCR real estate ecosystem is often overwhelming, with endless broker calls, hidden charges, and misleading project delivery promises. <strong>Maa Kalkaji Properties</strong> was formed to solve exactly this problem.
              </p>

              <p>
                Our specialized advisory teams assist serious buyers, family investors, and corporate professionals in discovering verified residential complexes (2, 3, 4 BHK and luxury penthouses), high-street retail shops, pre-leased Grade-A offices, freehold plots along the Yamuna Expressway &amp; Jewar Airport, and sprawling South Delhi farmhouses.
              </p>

              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Zero Spam &amp; Guaranteed Privacy:</strong> Your phone number and enquiry details are kept confidential. You will only speak with a dedicated senior relationship manager.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">End-to-End Handholding:</strong> From shortlisting floor plans and chauffeured site visits to price negotiation, home loan sanction, and registry handover.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE OPERATING PILLARS */}
      <section className="py-12 sm:py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-100/60 px-2.5 py-0.5 rounded-full">
              Our Core Promises
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Buyers &amp; Investors Choose Us
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              We stand apart through factual data, verified property documentation, and zero brokerage on builder units.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-red-400 hover:shadow-lg transition-all duration-200 space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-3xl font-black text-white">
              Ready to Explore Verified Delhi NCR Properties?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Schedule your free AC cab site visit or discuss verified inventory with our senior property consultants.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              Contact Us Today
            </Link>
            <a
              href={`tel:${agencyPhone.replace(/\s+/g, '')}`}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs sm:text-sm font-bold backdrop-blur-md transition-all active:scale-95"
            >
              Call {agencyPhone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
