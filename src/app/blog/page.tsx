import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import StructuredData from '@/components/StructuredData';
import { Home, ChevronRight, BookOpen, ArrowRight, Calendar, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Delhi NCR Real Estate Guides & Market Analysis | Grand Realty NCR',
  description:
    'Comprehensive buyer checklists, UP RERA verification guidelines, Dwarka vs Noida expressway comparative analyses, and real estate legal insights.',
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogListingPage() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <StructuredData type="BreadcrumbList" data={{ items: breadcrumbItems }} />

      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Real Estate Guides & Articles</span>
      </nav>

      <div className="space-y-2 max-w-2xl">
        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-md">
          Market Intelligence & Advice
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Delhi NCR Real Estate Guides & Insights
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          In-depth buyer guides, regulatory due diligence, UP RERA and HRERA compliance checklists, and growth corridor evaluations written by experienced property advisors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            {blog.featuredImageUrl && (
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  src={blog.featuredImageUrl}
                  alt={blog.imageAlt || blog.title}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                  {blog.category.replace(/_/g, ' ')}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug hover:text-amber-700 transition-colors">
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{blog.authorName}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(blog.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </span>
                </div>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <span>Read Full</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
