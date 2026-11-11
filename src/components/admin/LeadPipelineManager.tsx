'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  ExternalLink,
  Edit2,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

const STAGES = [
  { id: 'ALL', label: 'All Leads' },
  { id: 'NEW', label: 'New Enquiries', color: 'bg-amber-100 text-amber-800' },
  { id: 'CONTACTED', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  { id: 'QUALIFIED', label: 'Qualified', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'SITE_VISIT_SCHEDULED', label: 'Site Visit Scheduled', color: 'bg-purple-100 text-purple-800' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { id: 'CONVERTED', label: 'Converted', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'LOST', label: 'Lost', color: 'bg-slate-100 text-slate-700' },
];

export default function LeadPipelineManager({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [activeStage, setActiveStage] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [newNote, setNewNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // Filter leads
  const filteredLeads = leads.filter((l) => {
    const matchesStage = activeStage === 'ALL' || l.status === activeStage;
    const matchesSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.email && l.email.toLowerCase().includes(search.toLowerCase())) ||
      l.leadNumber.toLowerCase().includes(search.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) {
      console.error('Failed to update lead status:', e);
    }
  };

  const handleAddNote = async (leadId: string) => {
    if (!newNote.trim()) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newActivityNote: newNote.trim() }),
      });

      if (res.ok) {
        setNewNote('');
        // Refresh lead details
        const leadRes = await fetch(`/api/admin/leads/${leadId}`);
        const data = await leadRes.json();
        if (data.lead) {
          setSelectedLead(data.lead);
          setLeads((prev) => prev.map((l) => (l.id === leadId ? data.lead : l)));
        }
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, phone, or Lead ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total: <span className="text-slate-900 font-bold">{filteredLeads.length}</span> leads matching
        </div>
      </div>

      {/* Stage Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {STAGES.map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setActiveStage(st.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeStage === st.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Main Pipeline Layout: Table/List + Selected Lead Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List / Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Mobile Leads Card View (< sm) */}
          <div className="divide-y divide-slate-100 sm:hidden">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 space-y-2.5 transition-colors cursor-pointer ${
                  selectedLead?.id === lead.id ? 'bg-red-50/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{lead.name}</div>
                    <div className="text-[11px] text-slate-500">{lead.phone}</div>
                    <div className="text-[10px] font-mono text-slate-400">{lead.leadNumber}</div>
                  </div>
                  <select
                    value={lead.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                    className="py-1 px-2 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-800"
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="SITE_VISIT_SCHEDULED">Visit Scheduled</option>
                    <option value="NEGOTIATION">Negotiation</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="LOST">Lost</option>
                  </select>
                </div>

                {lead.property && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg truncate">
                    Interested in: <strong>{lead.property.title}</strong>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400">{lead.leadSource}</span>
                  <button
                    type="button"
                    className="text-red-600 font-bold flex items-center gap-0.5 text-xs"
                  >
                    <span>View Notes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= sm) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Lead Details</th>
                  <th className="p-3.5">Interested Property</th>
                  <th className="p-3.5">Source</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`cursor-pointer transition-colors hover:bg-amber-50/50 ${
                      selectedLead?.id === lead.id ? 'bg-amber-50/80 font-medium' : ''
                    }`}
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{lead.name}</div>
                      <div className="text-[11px] text-slate-500">{lead.phone}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{lead.leadNumber}</div>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      {lead.property ? (
                        <div className="truncate text-slate-800 font-semibold">{lead.property.title}</div>
                      ) : (
                        <span className="text-slate-400 italic">General Enquiry</span>
                      )}
                      {lead.budget && (
                        <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Budget: {lead.budget}</div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">
                        {lead.leadSource}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                        className="py-1 px-2 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="SITE_VISIT_SCHEDULED">Site Visit Scheduled</option>
                        <option value="NEGOTIATION">Negotiation</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="LOST">Lost</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Lead Inspector Drawer / Sidebar (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {selectedLead ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-bold">
                    {selectedLead.leadNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(selectedLead.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">{selectedLead.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href={`tel:${selectedLead.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{selectedLead.phone}</span>
                  </a>
                  <a
                    href={getWhatsAppLink(
                      selectedLead.phone,
                      `Hello ${selectedLead.name}, this is from Grand Realty NCR regarding your property enquiry.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Requirement Details */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                  Enquiry Specifics
                </div>
                {selectedLead.property && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 block uppercase">Property of Interest</span>
                    <Link
                      href={`/property/${selectedLead.property.slug}`}
                      target="_blank"
                      className="font-bold text-slate-900 hover:text-amber-700 flex items-center gap-1"
                    >
                      <span className="truncate">{selectedLead.property.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </Link>
                  </div>
                )}
                {selectedLead.message && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block uppercase">Client Message</span>
                    <p className="text-slate-700 leading-relaxed italic">{selectedLead.message}</p>
                  </div>
                )}
                {selectedLead.notes && (
                  <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-amber-900">
                    <span className="text-[10px] text-amber-700 block uppercase font-bold">Notes</span>
                    <p>{selectedLead.notes}</p>
                  </div>
                )}
              </div>

              {/* Add Activity Note */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">Log Follow-up Note</label>
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record customer discussion, scheduled visit notes, or objection handling..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  disabled={updating || !newNote.trim()}
                  onClick={() => handleAddNote(selectedLead.id)}
                  className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {updating ? 'Saving Note...' : 'Add Note to Lead Timeline'}
                </button>
              </div>

              {/* Lead Timeline / Activities */}
              {selectedLead.activities?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                    Activity History
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                    {selectedLead.activities.map((act: any) => (
                      <div key={act.id} className="text-[11px] p-2 bg-slate-50 rounded-lg space-y-0.5">
                        <div className="font-semibold text-slate-800">{act.details}</div>
                        <div className="text-[9px] text-slate-400">
                          {new Date(act.createdAt).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-300" />
              <div className="text-xs font-semibold">Select a lead to inspect details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
