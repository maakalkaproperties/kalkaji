import CityPropertyPage, { generateMetadata as baseMetadata } from '../locations/[citySlug]/page';

export async function generateMetadata() {
  return baseMetadata({ params: Promise.resolve({ citySlug: 'faridabad' }) });
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return CityPropertyPage({
    params: Promise.resolve({ citySlug: 'faridabad' }),
    searchParams,
  });
}
