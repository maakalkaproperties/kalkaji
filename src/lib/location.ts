export interface DetectedLocation {
  latitude?: number;
  longitude?: number;
  locality?: string;
  ncrCity: string;
  ncrSlug: string;
  displayName?: string;
  source: 'gps' | 'ip' | 'manual';
  timestamp: number;
}

const STORAGE_KEY = 'user_detected_location_v1';

/**
 * Get coordinates from browser HTML5 Geolocation API
 */
export function getBrowserCoordinates(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        let msg = 'Failed to retrieve location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser settings.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Reverse geocode lat/lng to City & Locality via our backend proxy (OpenStreetMap Nominatim)
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lng: number
): Promise<DetectedLocation> {
  const res = await fetch(`/api/location/reverse-geocode?lat=${lat}&lng=${lng}`);
  if (!res.ok) {
    throw new Error('Reverse geocoding failed');
  }
  const data = await res.json();
  const loc: DetectedLocation = {
    latitude: lat,
    longitude: lng,
    locality: data.locality || '',
    ncrCity: data.ncrCity || 'All Delhi NCR',
    ncrSlug: data.ncrSlug || '',
    displayName: data.displayName || '',
    source: 'gps',
    timestamp: Date.now(),
  };
  saveStoredLocation(loc);
  return loc;
}

/**
 * Passive IP-based location detection
 */
export async function detectLocationByIP(): Promise<DetectedLocation> {
  const res = await fetch('/api/location/detect-ip');
  if (!res.ok) {
    throw new Error('IP detection failed');
  }
  const data = await res.json();
  const loc: DetectedLocation = {
    latitude: data.latitude,
    longitude: data.longitude,
    locality: data.city || '',
    ncrCity: data.ncrCity || 'All Delhi NCR',
    ncrSlug: data.ncrSlug || '',
    displayName: `${data.city ? data.city + ', ' : ''}${data.region || 'Delhi NCR'}`,
    source: 'ip',
    timestamp: Date.now(),
  };
  return loc;
}

/**
 * Full GPS auto-track workflow:
 * 1. Requests user GPS
 * 2. Reverse geocodes with OpenStreetMap
 * 3. Saves to localStorage
 */
export async function autoTrackGPSLocation(): Promise<DetectedLocation> {
  const coords = await getBrowserCoordinates();
  return await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
}

/**
 * Get cached location from localStorage (valid for 24 hours)
 */
export function getStoredLocation(): DetectedLocation | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: DetectedLocation = JSON.parse(raw);
    const ONE_DAY = 24 * 60 * 60 * 1000;
    if (Date.now() - data.timestamp > ONE_DAY) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Save detected location to localStorage
 */
export function saveStoredLocation(loc: DetectedLocation): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch (e) {
    console.error('Failed to save location', e);
  }
}

/**
 * Calculate distance between two lat/lng coordinates in kilometers (Haversine formula)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
