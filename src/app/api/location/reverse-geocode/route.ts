import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Delhi NCR known city and locality mappings
function mapToNCRCity(address: Record<string, string>): { name: string; slug: string } {
  const city = (address.city || address.town || address.county || address.state_district || '').toLowerCase();
  const state = (address.state || '').toLowerCase();
  const suburb = (address.suburb || address.neighbourhood || address.road || '').toLowerCase();

  // Greater Noida check first (before Noida)
  if (
    city.includes('greater noida') ||
    suburb.includes('greater noida') ||
    suburb.includes('pari chowk') ||
    suburb.includes('yamuna expressway')
  ) {
    return { name: 'Greater Noida', slug: 'greater-noida' };
  }

  // Greater Noida West / Noida Extension
  if (
    suburb.includes('noida extension') ||
    suburb.includes('gaur city') ||
    suburb.includes('greater noida west')
  ) {
    return { name: 'Greater Noida West', slug: 'greater-noida-west' };
  }

  // Noida / Gautam Buddha Nagar
  if (city.includes('noida') || city.includes('gautam buddha') || suburb.includes('noida')) {
    return { name: 'Noida', slug: 'noida' };
  }

  // Gurugram / Gurgaon
  if (
    city.includes('gurgaon') ||
    city.includes('gurugram') ||
    suburb.includes('gurgaon') ||
    suburb.includes('gurugram')
  ) {
    return { name: 'Gurugram', slug: 'gurugram' };
  }

  // Ghaziabad
  if (city.includes('ghaziabad') || suburb.includes('indirapuram') || suburb.includes('vaishali')) {
    return { name: 'Ghaziabad', slug: 'ghaziabad' };
  }

  // Faridabad
  if (city.includes('faridabad') || suburb.includes('ballabhgarh')) {
    return { name: 'Faridabad', slug: 'faridabad' };
  }

  // Delhi / New Delhi
  if (state.includes('delhi') || city.includes('delhi')) {
    return { name: 'Delhi', slug: 'delhi' };
  }

  // Fallback to general Delhi NCR
  return { name: 'All Delhi NCR', slug: '' };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and Longitude query parameters are required' },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // 1. If Google Maps API Key is configured, use Google Geocoding
    if (googleApiKey) {
      try {
        const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`;
        const gRes = await fetch(googleUrl, { next: { revalidate: 3600 } });
        const gData = await gRes.json();

        if (gData.status === 'OK' && gData.results && gData.results.length > 0) {
          const first = gData.results[0];
          const addressComponents: any[] = first.address_components || [];

          let locality = '';
          let city = '';
          let state = '';
          let postalCode = '';

          for (const comp of addressComponents) {
            const types = comp.types || [];
            if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
              locality = comp.long_name;
            } else if (types.includes('locality')) {
              city = comp.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = comp.long_name;
            } else if (types.includes('postal_code')) {
              postalCode = comp.long_name;
            }
          }

          const ncrCity = mapToNCRCity({
            city,
            state,
            suburb: locality,
          });

          return NextResponse.json({
            success: true,
            provider: 'google',
            latitude,
            longitude,
            displayName: first.formatted_address || '',
            locality: locality || city,
            rawCity: city,
            state,
            postcode: postalCode,
            ncrCity: ncrCity.name,
            ncrSlug: ncrCity.slug,
          });
        }
      } catch (gErr) {
        console.warn('Google geocode failed, falling back to OpenStreetMap Nominatim:', gErr);
      }
    }

    // 2. Default & 100% Free Provider: OpenStreetMap Nominatim
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'MaaKalkajiProperties/1.0 (info@maakalkajiproperties.com)',
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Nominatim responded with status ${res.status}`);
    }

    const data = await res.json();
    const address = data.address || {};

    const locality =
      address.suburb ||
      address.neighbourhood ||
      address.residential ||
      address.road ||
      address.quarter ||
      '';

    const rawCity = address.city || address.town || address.village || address.state_district || '';
    const state = address.state || '';
    const postcode = address.postcode || '';

    // Smart NCR City mapper
    const ncrCity = mapToNCRCity(address);

    return NextResponse.json({
      success: true,
      provider: 'openstreetmap',
      latitude,
      longitude,
      displayName: data.display_name || '',
      locality: locality || rawCity,
      rawCity,
      state,
      postcode,
      ncrCity: ncrCity.name,
      ncrSlug: ncrCity.slug,
    });
  } catch (error: any) {
    console.error('Reverse geocode error:', error);
    return NextResponse.json(
      { error: 'Failed to reverse geocode location', details: error.message },
      { status: 500 }
    );
  }
}
