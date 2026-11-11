import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        category: true,
        city: true,
        locality: true,
        builder: true,
        images: { orderBy: { displayOrder: 'asc' } },
        amenities: { include: { amenity: true } },
      },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch property details.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER']);
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    const {
      title,
      slug: newSlug,
      description,
      shortDescription,
      price,
      priceDisplay,
      categoryId,
      cityId,
      localityId,
      builderId,
      projectName,
      purpose,
      propertyType,
      bedrooms,
      bathrooms,
      balconies,
      carpetArea,
      superArea,
      areaUnit,
      furnishing,
      possessionStatus,
      possessionDate,
      reraId,
      address,
      pinCode,
      featuredStatus,
      published,
      availabilityStatus,
      seoTitle,
      seoDescription,
      images,
      faqs,
    } = body;

    // Handle slug change and 301 SEO redirect tracking
    let targetSlug = existing.slug;
    if (newSlug && newSlug !== existing.slug) {
      const sanitizedSlug = newSlug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check collision
      const slugConflict = await prisma.property.findFirst({
        where: { slug: sanitizedSlug, NOT: { id } },
      });

      if (!slugConflict) {
        targetSlug = sanitizedSlug;
        // Create 301 redirect mapping
        await prisma.redirect.upsert({
          where: { sourcePath: `/property/${existing.slug}` },
          update: { targetPath: `/property/${targetSlug}`, statusCode: 301 },
          create: {
            sourcePath: `/property/${existing.slug}`,
            targetPath: `/property/${targetSlug}`,
            statusCode: 301,
          },
        });
      }
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        slug: targetSlug,
        description: description !== undefined ? description : existing.description,
        shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
        price: price !== undefined ? Number(price) : existing.price,
        priceDisplay: priceDisplay || existing.priceDisplay,
        categoryId: categoryId || existing.categoryId,
        cityId: cityId || existing.cityId,
        localityId: localityId !== undefined ? localityId : existing.localityId,
        builderId: builderId !== undefined ? builderId : existing.builderId,
        projectName: projectName !== undefined ? projectName : existing.projectName,
        purpose: purpose || existing.purpose,
        propertyType: propertyType || existing.propertyType,
        bedrooms: bedrooms !== undefined ? (bedrooms ? Number(bedrooms) : null) : existing.bedrooms,
        bathrooms: bathrooms !== undefined ? (bathrooms ? Number(bathrooms) : null) : existing.bathrooms,
        balconies: balconies !== undefined ? (balconies ? Number(balconies) : null) : existing.balconies,
        carpetArea: carpetArea !== undefined ? (carpetArea ? Number(carpetArea) : null) : existing.carpetArea,
        superArea: superArea !== undefined ? (superArea ? Number(superArea) : null) : existing.superArea,
        areaUnit: areaUnit || existing.areaUnit,
        furnishing: furnishing || existing.furnishing,
        possessionStatus: possessionStatus || existing.possessionStatus,
        possessionDate: possessionDate !== undefined ? possessionDate : existing.possessionDate,
        reraId: reraId !== undefined ? reraId : existing.reraId,
        address: address !== undefined ? address : existing.address,
        pinCode: pinCode !== undefined ? pinCode : existing.pinCode,
        featuredStatus: featuredStatus !== undefined ? Boolean(featuredStatus) : existing.featuredStatus,
        published: published !== undefined ? Boolean(published) : existing.published,
        availabilityStatus: availabilityStatus || existing.availabilityStatus,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existing.seoDescription,
        faqs: (faqs !== undefined ? (Array.isArray(faqs) ? faqs.filter((f: any) => f.question?.trim() && f.answer?.trim()) : []) : existing.faqs) as any,
      },
    });

    // Update images if provided
    if (Array.isArray(images)) {
      await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
      for (let i = 0; i < images.length; i++) {
        await prisma.propertyImage.create({
          data: {
            propertyId: id,
            url: images[i].url,
            alt: images[i].alt || updated.title,
            caption: images[i].caption || null,
            isFeatured: i === 0,
            displayOrder: i + 1,
            imageType: images[i].imageType || 'GALLERY',
          },
        });
      }
    }

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE',
        entity: 'PROPERTY',
        entityId: id,
        details: `Updated property: ${updated.title}`,
      },
    });

    return NextResponse.json({ success: true, property: updated });
  } catch (error: any) {
    console.error('Property update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update property.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    // Unpublish or remove
    await prisma.property.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'DELETE',
        entity: 'PROPERTY',
        entityId: id,
        details: `Deleted property: ${property.title} (${property.slug})`,
      },
    });

    return NextResponse.json({ success: true, message: 'Property deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete property.' }, { status: 500 });
  }
}
