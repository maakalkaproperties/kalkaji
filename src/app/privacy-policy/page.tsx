import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Grand Realty NCR',
  description: 'Grand Realty NCR data privacy and personal lead information handling practices.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
      <div className="prose prose-slate text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
        <p>
          At Grand Realty NCR, we respect the privacy of our website visitors and clients. This Privacy Policy outlines our procedures regarding the collection, use, and protection of information provided via our online enquiry forms, WhatsApp interactions, and direct calls.
        </p>
        <h2 className="text-base font-bold text-slate-900 pt-2">1. Information We Collect</h2>
        <p>
          We only collect personal information that is voluntarily provided by you when submitting property enquiry forms, requesting site visits, or connecting through WhatsApp. This includes your name, contact telephone number, email address, preferred property category, and budget specifications.
        </p>
        <h2 className="text-base font-bold text-slate-900 pt-2">2. Use of Information</h2>
        <p>
          Information submitted to Grand Realty NCR is strictly used to:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Facilitate direct consultations and site visits with our verified property specialists.</li>
          <li>Transmit requested property brochures, price sheets, and RERA registration documentation.</li>
          <li>Address customer support enquiries and loan eligibility questions.</li>
        </ul>
        <h2 className="text-base font-bold text-slate-900 pt-2">3. Non-Disclosure & Security</h2>
        <p>
          We never sell, rent, or trade your personal contact details to external marketing entities or third-party call centers. All enquiry records are stored within secure, encrypted database environments protected by role-based administrative access controls.
        </p>
      </div>
    </div>
  );
}
