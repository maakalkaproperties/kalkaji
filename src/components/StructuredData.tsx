import React from 'react';

interface StructuredDataProps {
  type: 'RealEstateAgent' | 'BreadcrumbList' | 'Property' | 'Article' | 'FAQPage';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let schema: any = null;

  if (type === 'RealEstateAgent') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: data.name || 'Grand Realty NCR',
      image: data.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      description: 'Delhi NCR Premier Real Estate Advisory for Luxury Residential, Commercial, Plots, and Farmhouses.',
      telephone: data.phone || '+91 98100 00000',
      email: data.email || 'enquiry@grandrealtyncr.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Tower B, Sector 62',
        addressLocality: 'Noida',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201309',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 28.628,
        longitude: 77.3649,
      },
      areaServed: [
        'Noida',
        'Greater Noida',
        'Greater Noida West',
        'Gurugram',
        'Delhi',
        'Ghaziabad',
        'Faridabad',
      ],
      priceRange: '₹₹₹',
    };
  } else if (type === 'BreadcrumbList') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.items.map((item: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  } else if (type === 'Property') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'SingleFamilyResidence',
      name: data.title,
      description: data.description,
      image: data.images?.map((img: any) => img.url),
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address,
        addressLocality: data.city?.name,
        addressRegion: 'Delhi NCR',
        postalCode: data.pinCode,
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.latitude || 28.6139,
        longitude: data.longitude || 77.209,
      },
      numberOfRooms: data.bedrooms || undefined,
      numberOfBathroomsTotal: data.bathrooms || undefined,
      floorSize: data.superArea
        ? {
            '@type': 'QuantitativeValue',
            value: data.superArea,
            unitCode: 'FTK',
          }
        : undefined,
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01T00:00:00Z',
      },
    };
  } else if (type === 'Article') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.excerpt,
      image: data.featuredImageUrl,
      author: {
        '@type': 'Person',
        name: data.authorName || 'Grand Realty NCR',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Grand Realty NCR',
        logo: {
          '@type': 'ImageObject',
          url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80',
        },
      },
      datePublished: data.publishedAt || data.createdAt,
      dateModified: data.updatedAt,
    };
  } else if (type === 'FAQPage') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (data.faqs || []).map((faq: any) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
