import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const city = searchParams.get('city');

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { address: { contains: search } },
        { projectName: { contains: search } },
      ];
    }
    if (category) {
      where.category = { slug: category };
    }
    if (city) {
      where.city = { slug: city };
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        city: true,
        locality: true,
        builder: true,
        images: { orderBy: { displayOrder: 'asc' } },
        _count: { select: { leads: true, siteVisits: true } },
      },
    });

    return NextResponse.json({ properties });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Fetch properties error:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER']);
    const body = await req.json();

    const {
      title,
      slug: customSlug,
      description,
      shortDescription,
      price,
      priceDisplay,
      categoryId,
      cityId,
      localityId,
      builderId,
      projectName,
      purpose = 'SALE',
      propertyType,
      bedrooms,
      bathrooms,
      balconies,
      carpetArea,
      superArea,
      areaUnit = 'SQ_FT',
      furnishing = 'UNFURNISHED',
      possessionStatus = 'READY_TO_MOVE',
      possessionDate,
      reraId,
      address,
      pinCode,
      featuredStatus = false,
      published = true,
      seoTitle,
      seoDescription,
      images = [],
      faqs = [],
    } = body;

    if (!title || !price || !categoryId || !cityId || !address || !propertyType) {
      return NextResponse.json(
        { error: 'Title, price, category, city, address and property type are required.' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = (customSlug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.property.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Format priceDisplay if missing
    let formattedPriceDisplay = priceDisplay;
    if (!formattedPriceDisplay) {
      const numPrice = Number(price);
      if (numPrice >= 10000000) {
        formattedPriceDisplay = `₹ ${(numPrice / 10000000).toFixed(2)} Cr`;
      } else if (numPrice >= 100000) {
        formattedPriceDisplay = `₹ ${(numPrice / 100000).toFixed(2)} Lakh`;
      } else {
        formattedPriceDisplay = `₹ ${numPrice.toLocaleString('en-IN')}`;
      }
    }

    const newProperty = await prisma.property.create({
      data: {
        title: title.trim(),
        slug,
        description: description || title,
        shortDescription: shortDescription || null,
        price: Number(price),
        priceDisplay: formattedPriceDisplay,
        categoryId,
        cityId,
        localityId: localityId || null,
        builderId: builderId || null,
        projectName: projectName || null,
        purpose,
        propertyType,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        balconies: balconies ? Number(balconies) : null,
        carpetArea: carpetArea ? Number(carpetArea) : null,
        superArea: superArea ? Number(superArea) : null,
        areaUnit,
        furnishing,
        possessionStatus,
        possessionDate: possessionDate || null,
        reraId: reraId || null,
        address: address.trim(),
        pinCode: pinCode || null,
        featuredStatus: Boolean(featuredStatus),
        published: Boolean(published),
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || shortDescription || description?.slice(0, 155),
        faqs: (Array.isArray(faqs) ? faqs.filter((f: any) => f.question?.trim() && f.answer?.trim()) : []) as any,
        images: {
          create: images.map((img: any, idx: number) => ({
            url: img.url,
            alt: img.alt || title,
            isFeatured: idx === 0,
            displayOrder: idx + 1,
            imageType: img.imageType || 'GALLERY',
          })),
        },
      },
      include: { images: true, category: true, city: true },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'CREATE',
        entity: 'PROPERTY',
        entityId: newProperty.id,
        details: `Created property: ${newProperty.title} (${newProperty.slug})`,
      },
    });

    return NextResponse.json({ success: true, property: newProperty }, { status: 201 });
  } catch (error: any) {
    console.error('Property creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create property.' }, { status: 500 });
  }
}
