import prisma from './prisma';

export interface PropertyFilterParams {
  categorySlug?: string;
  citySlug?: string;
  localitySlug?: string;
  purpose?: string;
  search?: string;
  bhk?: string;
  minPrice?: string;
  maxPrice?: string;
  possession?: string;
  sort?: string;
}

export async function getFilteredProperties(filters: PropertyFilterParams) {
  const where: any = {
    published: true,
  };

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }

  if (filters.citySlug) {
    where.city = { slug: filters.citySlug };
  }

  if (filters.localitySlug) {
    where.locality = { slug: filters.localitySlug };
  }

  if (filters.purpose && filters.purpose !== 'ALL') {
    where.purpose = filters.purpose;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { address: { contains: filters.search } },
      { projectName: { contains: filters.search } },
      { locality: { name: { contains: filters.search } } },
      { city: { name: { contains: filters.search } } },
    ];
  }

  if (filters.bhk) {
    const bhkNum = parseInt(filters.bhk, 10);
    if (bhkNum >= 5) {
      where.bedrooms = { gte: 5 };
    } else {
      where.bedrooms = bhkNum;
    }
  }

  if (filters.minPrice) {
    where.price = { ...(where.price || {}), gte: parseFloat(filters.minPrice) };
  }

  if (filters.maxPrice) {
    where.price = { ...(where.price || {}), lte: parseFloat(filters.maxPrice) };
  }

  if (filters.possession) {
    where.possessionStatus = filters.possession;
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (filters.sort === 'price_asc') {
    orderBy = { price: 'asc' };
  } else if (filters.sort === 'price_desc') {
    orderBy = { price: 'desc' };
  } else if (filters.sort === 'area_desc') {
    orderBy = { superArea: 'desc' };
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy,
    include: {
      category: true,
      city: true,
      locality: true,
      builder: true,
      images: { orderBy: { displayOrder: 'asc' } },
    },
  });

  return properties;
}
