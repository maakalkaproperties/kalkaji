import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export default function Footer() {
  const agencyPhone = process.env.NEXT_PUBLIC_AGENCY_PHONE || '+91 98100 00000';
  const agencyWhatsApp = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || '+919810000000';
  const agencyEmail = process.env.NEXT_PUBLIC_AGENCY_EMAIL || 'enquiry@grandrealtyncr.com';
  const agencyAddress = process.env.NEXT_PUBLIC_AGENCY_ADDRESS || 'Tower B, Sector 62, Noida, Uttar Pradesh 201309';

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-24 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Quick Connect Bar (BatteryMantra Red Accent) */}
        <div className="bg-slate-900 rounded-2xl p-5 sm:p-7 mb-10 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Looking to Buy, Sell, or Invest in Delhi NCR Real Estate?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Connect with verified property advisors for RERA compliance checks and guided site visits.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={getWhatsAppLink(agencyWhatsApp, 'Hello Grand Realty NCR, I would like to consult with an advisor.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={`tel:${agencyPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-sm active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>{agencyPhone}</span>
            </a>
          </div>
        </div>

        {/* 4-Column Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
                <img
                  src="/logo.png"
                  alt="Maa Kalkaji Properties"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Maa Kalkaji <span className="text-red-500">Properties</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Maa Kalkaji Properties is an independent real estate advisory firm specializing in verified luxury residential, Grade-A commercial spaces, plots, and farmhouses across Delhi NCR.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>{agencyAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{agencyPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{agencyEmail}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Property Categories</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/residential-property" className="hover:text-red-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Residential Properties</span>
                </Link>
              </li>
              <li>
                <Link href="/commercial-property" className="hover:text-red-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Commercial Offices & Shops</span>
                </Link>
              </li>
              <li>
                <Link href="/plots-for-sale" className="hover:text-red-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Plots for Sale (NCR)</span>
                </Link>
              </li>
              <li>
                <Link href="/farmhouse-for-sale" className="hover:text-red-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Luxury Farmhouses</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Delhi NCR Hubs</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/property-in-noida" className="hover:text-red-400 transition-colors">
                  Property in Noida
                </Link>
              </li>
              <li>
                <Link href="/property-in-gurugram" className="hover:text-red-400 transition-colors">
                  Property in Gurugram
                </Link>
              </li>
              <li>
                <Link href="/property-in-greater-noida" className="hover:text-red-400 transition-colors">
                  Property in Greater Noida
                </Link>
              </li>
              <li>
                <Link href="/property-in-greater-noida-west" className="hover:text-red-400 transition-colors">
                  Greater Noida West (Ext)
                </Link>
              </li>
              <li>
                <Link href="/property-in-delhi" className="hover:text-red-400 transition-colors">
                  Property in Delhi NCT
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Agency & Legal</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/blog" className="hover:text-red-400 transition-colors">
                  Real Estate Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-red-400 transition-colors">
                  About Our Advisory
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-red-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-red-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-red-400 transition-colors text-red-500 font-semibold">
                  Staff Login (Admin)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclosure */}
        <div className="border-t border-slate-800 pt-5 pb-5 text-[11px] text-slate-500 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-1 text-slate-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>RERA Compliance & Regulatory Disclaimer</span>
          </div>
          <p>
            Maa Kalkaji Properties is an independent real estate advisory and channel brokerage firm operating across Delhi NCR. All projects advertised are subject to state RERA regulations (UP RERA, Haryana RERA, and Delhi RERA).
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 Maa Kalkaji Properties. All rights reserved.</p>
          <p>Engineered for Speed, Reliability & RERA Transparency.</p>
        </div>
      </div>
    </footer>
  );
}
