'use client';

import React from 'react';
import { X } from 'lucide-react';
import EnquiryForm from './EnquiryForm';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: string;
  propertyTitle?: string;
  cityId?: string;
  categoryId?: string;
  title?: string;
  leadSource?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  cityId,
  categoryId,
  title = 'Request Property Consultation / Callback',
  leadSource = 'POPUP_MODAL',
}: EnquiryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-md">
            Direct Agency Connect
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-2">{title}</h3>
          {propertyTitle && (
            <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">Ref: {propertyTitle}</p>
          )}
        </div>

        <EnquiryForm
          propertyId={propertyId}
          propertyTitle={propertyTitle}
          cityId={cityId}
          categoryId={categoryId}
          leadSource={leadSource}
          onSuccess={onClose}
        />
      </div>
    </div>
  );
}
