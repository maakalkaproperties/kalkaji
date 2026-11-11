import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Grand Realty NCR',
  description: 'Terms of service and legal disclaimer for Grand Realty NCR.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Terms & Conditions</h1>
      <div className="prose prose-slate text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
        <p>
          Welcome to Grand Realty NCR. By accessing and using this website, you agree to comply with and be bound by the following terms, conditions, and disclaimers.
        </p>
        <h2 className="text-base font-bold text-slate-900 pt-2">1. Nature of Real Estate Information</h2>
        <p>
          Grand Realty NCR operates as an independent advisory and channel brokerage firm. The property visualisations, project specifications, floor plan illustrations, and price approximations displayed on this website are provided for informational and demonstrative purposes. All real estate projects advertised are subject to approval and registration under relevant state regulatory authorities (UP RERA, Haryana RERA, and Delhi RERA).
        </p>
        <h2 className="text-base font-bold text-slate-900 pt-2">2. Independent Verification</h2>
        <p>
          Prospective buyers and investors are urged to conduct independent due diligence and verify project registrations, sanctions, and bank approvals directly with government RERA portals and authorized developer representatives prior to executing financial commitments.
        </p>
        <h2 className="text-base font-bold text-slate-900 pt-2">3. Intellectual Property</h2>
        <p>
          All proprietary articles, market research guides, brand assets, and website layout configurations belong to Grand Realty NCR and are protected by applicable intellectual property statutes.
        </p>
      </div>
    </div>
  );
}
