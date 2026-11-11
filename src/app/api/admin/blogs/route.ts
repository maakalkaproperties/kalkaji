import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ blogs });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch blogs.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR']);
    const body = await req.json();
    const { title, slug: customSlug, excerpt, content, featuredImageUrl, authorName, category, seoTitle, seoDescription, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    const baseSlug = (customSlug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const blog = await prisma.blog.create({
      data: {
        title: title.trim(),
        slug: baseSlug,
        excerpt: excerpt || title,
        content,
        featuredImageUrl: featuredImageUrl || null,
        authorName: authorName || user.name || 'Grand Realty NCR Desk',
        category: category || 'BUYER_GUIDE',
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt || title,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create blog.' }, { status: 500 });
  }
}
