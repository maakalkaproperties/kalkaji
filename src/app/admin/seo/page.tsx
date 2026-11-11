import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  FileCode,
} from 'lucide-react';

export default async function AdminSeoPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const [properties, redirects, cities, blogs] = await Promise.all([
    prisma.property.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        seoTitle: true,
        seoDescription: true,
        published: true,
        isIndexable: true,
      },
    }),
    prisma.redirect.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.city.findMany({ select: { id: true, name: true, slug: true, seoTitle: true } }),
    prisma.blog.findMany({ select: { id: true, title: true, slug: true, seoTitle: true } }),
  ]);

  // Check completeness
  const missingMeta = properties.filter((p) => !p.seoTitle || !p.seoDescription);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Advanced Technical SEO & SERP Center</h1>
          <p className="text-xs text-slate-500">
            Monitor indexation, XML sitemaps, 301 redirect history, and search snippet readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/sitemap.xml"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>View XML Sitemap</span>
          </Link>
          <Link
            href="/robots.txt"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>View robots.txt</span>
          </Link>
        </div>
      </div>

      {/* SEO Health Audit Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Indexable URLs in Sitemap</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {properties.filter((p) => p.published && p.isIndexable).length + cities.length + blogs.length + 8}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Clean, canonical URLs only</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Metadata Health Check</span>
            <Search className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {properties.length - missingMeta.length} / {properties.length}
          </div>
          <div className="text-[11px] text-slate-500">Properties with customized SEO snippets</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active 301 Permanent Redirects</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{redirects.length}</div>
          <div className="text-[11px] text-slate-500">Automated slug change protection</div>
        </div>
      </div>

      {/* 301 Redirect Rules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-600" />
            <span>Automatic 301 Redirect History</span>
          </h2>
          <span className="text-xs text-slate-500">Prevents 404 broken links when property slugs change</span>
        </div>

        {redirects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Source URL (Old)</th>
                  <th className="p-3">Redirect Target (New)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Logged Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {redirects.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 text-red-700">{r.sourcePath}</td>
                    <td className="p-3 text-emerald-700 font-bold">{r.targetPath}</td>
                    <td className="p-3 font-bold text-slate-800">{r.statusCode} Permanent</td>
                    <td className="p-3 text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500 italic">
            No URL redirects recorded yet. When you modify an existing property slug in the editor, a 301 permanent redirect will be automatically generated here.
          </div>
        )}
      </div>

      {/* Property SERP Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Property Meta Titles & SERP Snippet Completeness
        </h2>

        {/* Mobile View (< sm) */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {properties.map((p) => (
            <div key={p.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 truncate max-w-[200px]">{p.title}</div>
                {p.published && p.isIndexable ? (
                  <span className="text-emerald-700 font-bold text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded">
                    Indexed
                  </span>
                ) : (
                  <span className="text-slate-400 font-bold text-[9px] bg-slate-200 px-1.5 py-0.5 rounded">
                    Draft
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-600 line-clamp-1">
                Title: <strong>{p.seoTitle || 'Default'}</strong>
              </div>
              <div className="pt-1.5 border-t border-slate-200 flex items-center justify-end">
                <Link
                  href={`/admin/properties/${p.id}`}
                  className="text-xs font-bold text-red-600 hover:text-red-700"
                >
                  Edit SEO Settings →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Property</th>
                <th className="p-3">SEO Title</th>
                <th className="p-3">Meta Description</th>
                <th className="p-3">Sitemap Inclusion</th>
                <th className="p-3 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">{p.title}</td>
                  <td className="p-3 max-w-xs truncate text-slate-700">
                    {p.seoTitle || <span className="text-amber-600 italic">Using Default</span>}
                  </td>
                  <td className="p-3 max-w-xs truncate text-slate-500">
                    {p.seoDescription || <span className="text-amber-600 italic">Using Default</span>}
                  </td>
                  <td className="p-3">
                    {p.published && p.isIndexable ? (
                      <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                        Indexed
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                        Noindex / Draft
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/properties/${p.id}`}
                      className="text-amber-700 font-bold hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
