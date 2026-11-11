# Grand Realty NCR — Premium Delhi NCR Real Estate Platform

A production-ready, high-speed, SEO-first real estate discovery, inventory management, and CRM platform engineered for Delhi NCR (Noida, Greater Noida, Greater Noida West, Gurugram, Delhi NCT, Ghaziabad, and Faridabad).

---

## 1. Tech Stack & Architecture

* **Frontend Framework**: Next.js 16 (App Router) with React 19 & TypeScript
* **Styling**: Tailwind CSS with custom design tokens adapted from luxury real estate UX
* **Icons**: Lucide React
* **Database & ORM**: Prisma ORM with normalized relational schema (SQLite for instant zero-dependency local execution; switchable to managed PostgreSQL in production)
* **Authentication**: Secure JWT sessions with HTTP-only cookies, bcrypt password hashing, and role-based access control (`SUPER_ADMIN`, `ADMIN`, `PROPERTY_MANAGER`, `SALES_EXECUTIVE`, `CONTENT_EDITOR`)
* **Technical SEO**: Dynamic XML sitemap (`/sitemap.xml`), `robots.txt`, JSON-LD Structured Data (`RealEstateAgent`, `SingleFamilyResidence`, `BreadcrumbList`, `Article`), Open Graph meta, and automated 301 redirects on slug modifications
* **Lead CRM & Pipeline**: Multi-stage lead management (`NEW` → `CONTACTED` → `QUALIFIED` → `SITE_VISIT_SCHEDULED` → `NEGOTIATION` → `CONVERTED` / `LOST`), site visit booking, timeline activity audit logs, and pre-filled WhatsApp click-to-chat integration

---

## 2. Project Directory Structure

```
delhi-ncr-real-estate/
├── prisma/
│   ├── schema.prisma       # Complete relational database models
│   └── seed.ts             # Realistic Delhi NCR demonstration seed data
├── src/
│   ├── app/
│   │   ├── (public pages)
│   │   │   ├── page.tsx                             # Premium Homepage
│   │   │   ├── residential-property/page.tsx        # Residential Category
│   │   │   ├── commercial-property/page.tsx         # Commercial Category
│   │   │   ├── plots-for-sale/page.tsx              # Plots Category
│   │   │   ├── farmhouse-for-sale/page.tsx          # Farmhouse Category
│   │   │   ├── property-in-[citySlug]/page.tsx      # City Landing Pages (Noida, Gurugram, etc.)
│   │   │   ├── property/[slug]/page.tsx             # Property Detail Page (Gallery, Specs, Leads)
│   │   │   ├── blog/ & blog/[slug]/page.tsx         # Real Estate Buyer Guides & RERA Checklists
│   │   │   ├── about/ & contact/page.tsx            # Corporate Advisory & Branch Contact
│   │   │   ├── privacy-policy/ & terms/page.tsx     # Legal & Regulatory Disclosures
│   │   │   ├── sitemap.ts                           # Dynamic XML Sitemap generator
│   │   │   └── robots.ts                            # Robots.txt configuration
│   │   ├── admin/                                   # Protected Admin Portal
│   │   │   ├── login/page.tsx                       # Admin & CRM Login
│   │   │   ├── page.tsx                             # Overview Dashboard & KPI Metrics
│   │   │   ├── properties/                          # Inventory CRUD & SERP Preview
│   │   │   ├── leads/page.tsx                       # Multi-stage Lead Pipeline CRM
│   │   │   ├── locations/page.tsx                   # City & Locality Coverage Desk
│   │   │   ├── blogs/page.tsx                       # Guide & Content Management
│   │   │   └── seo/page.tsx                         # SEO Health Audit & 301 Redirect Rules
│   │   └── api/
│   │       ├── leads/route.ts                       # Customer Enquiry Ingestion
│   │       ├── site-visits/route.ts                 # Site Visit Booking API
│   │       └── admin/                               # Auth, Properties, CRM, Locations, Overview APIs
│   ├── components/
│   │   ├── Header.tsx                               # Sticky header with location selector & fast search
│   │   ├── Footer.tsx                               # Regulatory disclosures, RERA notice, regional links
│   │   ├── PropertyCard.tsx                         # Responsive property card with RERA badge & WhatsApp CTA
│   │   ├── PropertyGallery.tsx                      # Lightbox gallery with keyboard and touch support
│   │   ├── PropertyListingView.tsx                  # Reusable listing page with search & multi-faceted filters
│   │   ├── SearchFilterBar.tsx                      # Category, City, BHK, Budget, Possession, & Sorting engine
│   │   ├── EnquiryForm.tsx & EnquiryModal.tsx       # Validated lead submission modal & forms
│   │   ├── MobileBottomBar.tsx                      # High-converting Call, WhatsApp, and Site Visit dock
│   │   ├── StructuredData.tsx                       # JSON-LD Schema generator
│   │   └── admin/                                   # Admin Nav, PropertyForm, LeadPipelineManager
│   └── lib/
│       ├── prisma.ts                                # Singleton Prisma Client
│       ├── auth.ts                                  # JWT sign, verify, and requireAuth helper
│       ├── utils.ts                                 # Indian price formatting (₹ Cr/Lakh), WhatsApp links
│       └── propertyQueries.ts                       # Server-side filtered query builder
├── .env.example                                     # Sanitized environment configuration
└── package.json
```

---

## 3. Quick Start & Local Development

### Prerequisites
* Node.js v18+ (tested on Node v24)
* npm

### Installation & Database Initialization
```bash
# 1. Navigate to project directory
cd delhi-ncr-real-estate

# 2. Install dependencies
npm install

# 3. Synchronize database schema (creates local dev.db)
npx prisma db push

# 4. Seed verified demonstration inventory & admin user
npx prisma db seed

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the live website.

---

## 4. Administrative Credentials (Demonstration Access)

* **Admin Portal URL**: `http://localhost:3000/admin`
* **Super Admin Email**: `admin@grandrealtyncr.com`
* **Password**: `Admin@NCR2026`
* **Sales Executive Email**: `sales@grandrealtyncr.com`
* **Password**: `Admin@NCR2026`

---

## 5. PostgreSQL Deployment Guide

For deploying to production environments (Vercel, Railway, Supabase, AWS RDS, Neon):
1. In `prisma/schema.prisma`, change datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` in your production environment variables:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/grandrealty_prod?schema=public"
   ```
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

---

## 6. Testing & Quality Assurance Summary

* **Production Build (`npm run build`)**: Succeeded with code 0 across all 37 static and server-rendered routes.
* **HTTP Status Code Verification**: Tested `GET /` (200), `GET /residential-property` (200), `GET /property/3-bhk-luxury-apartment-sector-150-noida` (200), `GET /sitemap.xml` (200).
* **Lead Ingestion API**: Tested `POST /api/leads` — successfully validated customer name, phone, generated unique Lead ID (`GR-2026-0004`), and logged timeline activity.
* **Admin Authentication API**: Tested `POST /api/admin/auth/login` — successfully verified bcrypt password hash and returned secure session cookies.
