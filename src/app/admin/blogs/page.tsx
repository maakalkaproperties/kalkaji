import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, PlusCircle, ExternalLink, Calendar, User, CheckCircle2 } from 'lucide-react';

export default async function AdminBlogsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Real Estate Guides & Blog Management</h1>
          <p className="text-xs text-slate-500">
            Publish educational content, RERA checklists, and Delhi NCR market trends.
          </p>
        </div>
      </div>

      {/* Mobile Blog Cards (< sm) */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {blogs.map((b) => (
          <div key={b.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                {b.category.replace(/_/g, ' ')}
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Published
              </span>
            </div>

            <div>
              <h3 className="font-bold text-xs text-slate-900">{b.title}</h3>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">/blog/{b.slug}</div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>{b.authorName}</span>
              <Link
                href={`/blog/${b.slug}`}
                target="_blank"
                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
              >
                <span>Read Live</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Blog Table (>= sm) */}
      <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Published Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Live View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900 max-w-sm">
                    <div>{b.title}</div>
                    <div className="text-[10px] font-mono text-slate-400">/blog/{b.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {b.category.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4">{b.authorName}</td>
                  <td className="p-4">
                    {new Date(b.publishedAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      Published
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      className="inline-flex p-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
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
