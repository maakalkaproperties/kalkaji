import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIndianPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) return 'Price on Request';
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹ ${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (price >= 100000) {
    const lakh = price / 100000;
    return `₹ ${lakh.toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  return `₹ ${price.toLocaleString('en-IN')}`;
}

export function formatArea(area: number | null | undefined, unit: string = 'SQ_FT'): string {
  if (!area) return 'Area on Request';
  const unitMap: Record<string, string> = {
    SQ_FT: 'sq.ft.',
    SQ_YD: 'sq.yd.',
    ACRE: 'Acres',
    HECTARE: 'Hectares',
  };
  return `${area.toLocaleString('en-IN')} ${unitMap[unit] || unit}`;
}

export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}
