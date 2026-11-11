import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import StructuredData from '@/components/StructuredData';
import EnquiryForm from '@/components/EnquiryForm';
import { Home, ChevronRight, Calendar, User, ArrowLeft, ShieldCheck, Share2 } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog) {
    return { title: 'Article Not Found' };
  }

  return {
    title: blog.seoTitle || `${blog.title} | Grand Realty NCR`,
    description: blog.seoDescription || blog.excerpt,
    alternates: {
      canonical: blog.canonicalUrl || `/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      url: `/blog/${blog.slug}`,
      images: blog.featuredImageUrl ? [{ url: blog.featuredImageUrl }] : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog || !blog.isPublished) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: blog.title, url: `/blog/${blog.slug}` },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <StructuredData type="BreadcrumbList" data={{ items: breadcrumbItems }} />
      <StructuredData type="Article" data={blog} />

      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/blog" className="hover:text-slate-900 transition-colors">
          Blog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 truncate max-w-xs">{blog.title}</span>
      </nav>

      <div className="space-y-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
          {blog.category.replace(/_/g, ' ')}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <User className="w-3.5 h-3.5 text-amber-600" />
            <span>{blog.authorName}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Real Estate Content</span>
          </div>
        </div>
      </div>

      {blog.featuredImageUrl && (
        <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md">
          <img
            src={blog.featuredImageUrl}
            alt={blog.imageAlt || blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content Body */}
      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
        {blog.content}
      </div>

      {/* Bottom Advisory Consultation Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 mt-8">
        <h3 className="text-lg font-bold text-white">Have Questions About This Topic?</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Our senior real estate advisors and legal cell can provide tailored guidance regarding project RERA status, circle rates, and registry documents across Delhi NCR.
        </p>
        <EnquiryForm leadSource={`BLOG_POST_${blog.slug}`} className="bg-white/10 p-4 rounded-xl" />
      </div>

      <div className="pt-4 border-t border-slate-200">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>
    </article>
  );
}
