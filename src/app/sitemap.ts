import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grandrealtyncr.com';
  const buildDate = new Date('2026-11-01T00:00:00Z');

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/residential-property`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/commercial-property`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/plots-for-sale`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/farmhouse-for-sale`,
      lastModified: buildDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  let propertyRoutes: MetadataRoute.Sitemap = [];
  let cityRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    // 2. Published Properties (Unique, indexable only)
    const properties = await prisma.property.findMany({
      where: { published: true, isIndexable: true },
      select: { slug: true, updatedAt: true },
    });

    propertyRoutes = properties.map((prop) => ({
      url: `${baseUrl}/property/${prop.slug}`,
      lastModified: prop.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    // 3. Approved Cities
    const cities = await prisma.city.findMany({
      select: { slug: true, updatedAt: true },
    });

    cityRoutes = cities.map((city) => ({
      url: `${baseUrl}/property-in-${city.slug}`,
      lastModified: city.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 4. Published Blogs
    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.75,
    }));
  } catch (err) {
    console.warn('Sitemap dynamic query deferred:', err);
  }

  return [...staticRoutes, ...propertyRoutes, ...cityRoutes, ...blogRoutes];
}
