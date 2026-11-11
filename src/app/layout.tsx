import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomBar from '@/components/MobileBottomBar';
import StructuredData from '@/components/StructuredData';

export const dynamic = 'force-dynamic';

function getMetadataBase(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000';
  const clean = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
  try {
    return new URL(clean);
  } catch {
    return new URL('http://localhost:3000');
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: 'Maa Kalkaji Properties | Premium Delhi NCR Real Estate Agency',
    template: '%s | Maa Kalkaji Properties',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  description:
    'Maa Kalkaji Properties - Delhi NCR premier real estate agency. Discover verified luxury residential apartments, Grade-A commercial office spaces, approved freehold plots, and luxury farmhouses across Noida, Gurugram, Greater Noida, and Delhi with RERA assurance.',
  keywords: [
    'Maa Kalkaji Properties',
    'Delhi NCR Real Estate',
    'Property in Noida',
    'Luxury Apartments Sector 150 Noida',
    'Commercial Office Golf Course Road Gurugram',
    'Freehold Plots Greater Noida',
    'Farmhouse in Chhatarpur Delhi',
    'UP RERA verified properties',
    'HRERA projects',
  ],
  authors: [{ name: 'Maa Kalkaji Properties' }],
  creator: 'Maa Kalkaji Properties',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Maa Kalkaji Properties',
    title: 'Maa Kalkaji Properties | Delhi NCR Premier Real Estate Advisory',
    description:
      'Verified luxury residential, commercial, plots, and farmhouses across Noida, Gurugram, Greater Noida, and Delhi.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Maa Kalkaji Properties - Luxury Real Estate in Delhi NCR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maa Kalkaji Properties | Premium Real Estate in Delhi NCR',
    description: 'Verified residential, commercial, plots, and farmhouses across Delhi NCR with RERA compliance.',
    images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <meta name="theme-color" content="#991b1b" />
        <StructuredData
          type="RealEstateAgent"
          data={{
            name: 'Grand Realty NCR',
            phone: process.env.NEXT_PUBLIC_AGENCY_PHONE || '+91 98100 00000',
            email: process.env.NEXT_PUBLIC_AGENCY_EMAIL || 'enquiry@grandrealtyncr.com',
          }}
        />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileBottomBar />
      </body>
    </html>
  );
}
