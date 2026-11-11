import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function mapIPCityToNCR(city: string, region: string): { name: string; slug: string } {
  const c = (city || '').toLowerCase();
  const r = (region || '').toLowerCase();

  if (c.includes('greater noida')) return { name: 'Greater Noida', slug: 'greater-noida' };
  if (c.includes('noida')) return { name: 'Noida', slug: 'noida' };
  if (c.includes('gurgaon') || c.includes('gurugram')) return { name: 'Gurugram', slug: 'gurugram' };
  if (c.includes('ghaziabad')) return { name: 'Ghaziabad', slug: 'ghaziabad' };
  if (c.includes('faridabad')) return { name: 'Faridabad', slug: 'faridabad' };
  if (c.includes('delhi') || r.includes('delhi')) return { name: 'Delhi', slug: 'delhi' };

  return { name: 'All Delhi NCR', slug: '' };
}

export async function GET(request: NextRequest) {
  try {
    // Extract client IP address from standard reverse-proxy headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : realIp || '';

    // If local/development IP (localhost or private range)
    const isLocal =
      !clientIp ||
      clientIp === '127.0.0.1' ||
      clientIp === '::1' ||
      clientIp.startsWith('192.168.') ||
      clientIp.startsWith('10.') ||
      clientIp.startsWith('172.16.');

    if (isLocal) {
      // Default to Delhi NCR for local development
      return NextResponse.json({
        success: true,
        isLocal: true,
        ip: clientIp || 'localhost',
        city: 'Delhi',
        region: 'Delhi NCR',
        country: 'India',
        ncrCity: 'All Delhi NCR',
        ncrSlug: '',
      });
    }

    // Call freeipapi.com (Free, no API key required, reliable)
    const ipRes = await fetch(`https://freeipapi.com/api/json/${clientIp}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 }, // Cache 24 hours per IP
    });

    if (!ipRes.ok) {
      throw new Error(`IP API returned status ${ipRes.status}`);
    }

    const ipData = await ipRes.json();
    const city = ipData.cityName || '';
    const region = ipData.regionName || '';
    const ncr = mapIPCityToNCR(city, region);

    return NextResponse.json({
      success: true,
      ip: clientIp,
      city,
      region,
      country: ipData.countryName || 'India',
      latitude: ipData.latitude,
      longitude: ipData.longitude,
      ncrCity: ncr.name,
      ncrSlug: ncr.slug,
    });
  } catch (error: any) {
    console.error('IP location error:', error);
    return NextResponse.json({
      success: false,
      ncrCity: 'All Delhi NCR',
      ncrSlug: '',
      fallback: true,
    });
  }
}
