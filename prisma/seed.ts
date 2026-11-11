import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Grand Realty NCR Database...');

  // 1. Admin User
  const passwordHash = await bcrypt.hash('Admin@NCR2026', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@grandrealtyncr.com' },
    update: {
      name: 'Vikas',
    },
    create: {
      name: 'Vikas',
      email: 'admin@grandrealtyncr.com',
      passwordHash,
      role: 'SUPER_ADMIN',
      phone: '+91 98100 12345',
      isActive: true,
    },
  });

  const propertyManager = await prisma.user.upsert({
    where: { email: 'sales@grandrealtyncr.com' },
    update: {},
    create: {
      name: 'Rohit Sharma',
      email: 'sales@grandrealtyncr.com',
      passwordHash,
      role: 'SALES_EXECUTIVE',
      phone: '+91 98100 54321',
      isActive: true,
    },
  });

  // 2. Primary Categories
  const categoriesData = [
    {
      name: 'Residential',
      slug: 'residential-property',
      description: 'Luxury apartments, penthouses, villas, and independent floors across prime Delhi NCR sectors.',
      displayOrder: 1,
    },
    {
      name: 'Commercial',
      slug: 'commercial-property',
      description: 'Grade-A office suites, retail high-street shops, and IT/ITES business towers with high rental yield.',
      displayOrder: 2,
    },
    {
      name: 'Plots',
      slug: 'plots-for-sale',
      description: 'Authority-approved freehold residential and commercial plots in fast-appreciating growth corridors.',
      displayOrder: 3,
    },
    {
      name: 'Farmhouse',
      slug: 'farmhouse-for-sale',
      description: 'Exclusive luxury farmhouse estates and sprawling green retreats in South Delhi and peripheral NCR.',
      displayOrder: 4,
    },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // 3. Cities
  const citiesData = [
    {
      name: 'Noida',
      slug: 'noida',
      state: 'Uttar Pradesh',
      tagline: 'Planned infrastructure, wide expressways, and green corridors',
      description: 'Noida offers some of the best planned sectors in India with world-class road networks, metro connectivity, and prominent business hubs along Noida Expressway.',
      isFeatured: true,
      displayOrder: 1,
      seoTitle: 'Property in Noida | Luxury Apartments, Plots & Commercial',
      seoDescription: 'Explore verified luxury properties in Noida. Compare verified 2/3/4 BHK apartments, office spaces, and villa plots across Sector 150, 128, and Expressway.',
    },
    {
      name: 'Gurugram',
      slug: 'gurugram',
      state: 'Haryana',
      tagline: 'Millennium City: India’s corporate epicenter & luxury living',
      description: 'Gurugram is the financial and tech capital of North India, home to Fortune 500 headquarters, signature golf courses, and ultra-luxury high-rises.',
      isFeatured: true,
      displayOrder: 2,
      seoTitle: 'Property in Gurugram | Luxury High-Rises & Commercial Hubs',
      seoDescription: 'Find premium real estate in Gurugram on Golf Course Road, Dwarka Expressway, and Southern Peripheral Road with verified RERA credentials.',
    },
    {
      name: 'Greater Noida',
      slug: 'greater-noida',
      state: 'Uttar Pradesh',
      tagline: 'Green paradise with unmatched educational and sports infra',
      description: 'Greater Noida is distinguished by wide tree-lined boulevards, integrated education hubs, and seamless connectivity to the upcoming Noida International Airport at Jewar.',
      isFeatured: true,
      displayOrder: 3,
      seoTitle: 'Property in Greater Noida | Plots, Villas & High-Rises',
      seoDescription: 'Invest in Greater Noida properties near Pari Chowk and Knowledge Park with upcoming Jewar Airport connectivity.',
    },
    {
      name: 'Greater Noida West',
      slug: 'greater-noida-west',
      state: 'Uttar Pradesh',
      tagline: 'NCR’s most active residential corridor & value appreciation',
      description: 'Formerly known as Noida Extension, this vibrant corridor provides superior value-for-money, modern high-rise gated communities, and booming retail high streets.',
      isFeatured: true,
      displayOrder: 4,
      seoTitle: 'Property in Greater Noida West (Noida Ext) | Ready Flats & Shops',
      seoDescription: 'Affordable luxury 2/3 BHK flats and commercial retail shops in Greater Noida West with rapid metro extension.',
    },
    {
      name: 'Delhi',
      slug: 'delhi',
      state: 'Delhi NCT',
      tagline: 'The historic capital of power, prestige, and prime addresses',
      description: 'Prime South Delhi enclaves and peripheral green belts host India’s most prestigious residential addresses and luxury farmhouse sanctuaries.',
      isFeatured: true,
      displayOrder: 5,
      seoTitle: 'Luxury Property in Delhi | South Delhi Floors & Farmhouses',
      seoDescription: 'Discover exclusive builder floors in South Delhi and expansive green farmhouses in Chhatarpur and Sultanpur.',
    },
    {
      name: 'Ghaziabad',
      slug: 'ghaziabad',
      state: 'Uttar Pradesh',
      tagline: 'Established connectivity, rapid transit, and bustling markets',
      description: 'Ghaziabad provides established urban infrastructure with the Delhi-Meerut Expressway and Namo Bharat Rapid Transit.',
      isFeatured: false,
      displayOrder: 6,
      seoTitle: 'Property in Ghaziabad | Indirapuram & Raj Nagar Extension',
      seoDescription: 'Buy ready-to-move apartments and commercial shops in Indirapuram and Vaishali, Ghaziabad.',
    },
    {
      name: 'Faridabad',
      slug: 'faridabad',
      state: 'Haryana',
      tagline: 'Industrial powerhouse with modern Neharpar master plan',
      description: 'Faridabad features large master-planned sectors in Greater Faridabad with direct metro link to South Delhi and Central Delhi.',
      isFeatured: false,
      displayOrder: 7,
      seoTitle: 'Property in Faridabad | Greater Faridabad Neharpar Projects',
      seoDescription: 'Search residential apartments and commercial properties in Neharpar, Greater Faridabad.',
    },
  ];

  const cities: Record<string, any> = {};
  for (const c of citiesData) {
    cities[c.slug] = await prisma.city.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  // 4. Localities
  const localitiesData = [
    { citySlug: 'noida', name: 'Sector 150', slug: 'sector-150', pincode: '201310', description: 'Sports City sector with 80% green cover and direct expressway entry.' },
    { citySlug: 'noida', name: 'Sector 128', slug: 'sector-128', pincode: '201304', description: 'Golf course township and luxury river-facing residences.' },
    { citySlug: 'noida', name: 'Sector 62', slug: 'sector-62', pincode: '201309', description: 'Central commercial and IT business district.' },
    { citySlug: 'gurugram', name: 'Golf Course Extension Road', slug: 'golf-course-ext-road', pincode: '122018', description: 'Gurugram’s most prestigious luxury residential corridor.' },
    { citySlug: 'gurugram', name: 'Dwarka Expressway', slug: 'dwarka-expressway', pincode: '122006', description: '16-lane access-controlled expressway with rapid connectivity to IGI Airport.' },
    { citySlug: 'greater-noida', name: 'Pari Chowk', slug: 'pari-chowk', pincode: '201308', description: 'Historic center of Greater Noida with round-the-clock transit.' },
    { citySlug: 'greater-noida-west', name: 'Techzone 4', slug: 'techzone-4', pincode: '201306', description: 'Thriving IT and high-street commercial hub in Greater Noida West.' },
    { citySlug: 'delhi', name: 'Chhatarpur Farm Belt', slug: 'chhatarpur', pincode: '110074', description: 'Sprawling green farmland enclave for luxury retreats and estates.' },
    { citySlug: 'delhi', name: 'Greater Kailash', slug: 'greater-kailash', pincode: '110048', description: 'Premier South Delhi residential colony with high-end lifestyle amenities.' },
  ];

  const localities: Record<string, any> = {};
  for (const loc of localitiesData) {
    const city = cities[loc.citySlug];
    if (city) {
      localities[`${loc.citySlug}_${loc.slug}`] = await prisma.locality.upsert({
        where: {
          cityId_slug: {
            cityId: city.id,
            slug: loc.slug,
          },
        },
        update: { name: loc.name, pincode: loc.pincode, description: loc.description },
        create: {
          cityId: city.id,
          name: loc.name,
          slug: loc.slug,
          pincode: loc.pincode,
          description: loc.description,
        },
      });
    }
  }

  // 5. Builders
  const buildersData = [
    { name: 'Max Estates', slug: 'max-estates', description: 'Pioneers in sustainable, biophilic Grade-A commercial and ultra-luxury residential developments.' },
    { name: 'Godrej Properties', slug: 'godrej-properties', description: 'Decades of trust, cutting-edge architectural design, and pan-NCR presence.' },
    { name: 'DLF Luxury', slug: 'dlf-luxury', description: 'India’s benchmark real estate developer responsible for transforming Gurugram’s skyline.' },
    { name: 'ATS Infrastructure', slug: 'ats-infrastructure', description: 'Renowned for Greek-Mediterranean architecture and timely craftsmanship.' },
  ];

  const builders: Record<string, any> = {};
  for (const b of buildersData) {
    builders[b.slug] = await prisma.builder.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }

  // 6. Amenities
  const amenitiesList = [
    { name: '24/7 Gated Security', slug: 'gated-security', icon: 'ShieldCheck', category: 'SAFETY' },
    { name: '100% Power Backup', slug: 'power-backup', icon: 'Zap', category: 'CONVENIENCE' },
    { name: 'Swimming Pool & Sun Deck', slug: 'swimming-pool', icon: 'Waves', category: 'LEISURE' },
    { name: 'Clubhouse & Lounge', slug: 'clubhouse', icon: 'Building2', category: 'LEISURE' },
    { name: 'High-Speed Elevators', slug: 'elevators', icon: 'ArrowUpDown', category: 'CONVENIENCE' },
    { name: 'Dedicated EV Charging', slug: 'ev-charging', icon: 'BatteryCharging', category: 'ENVIRONMENT' },
    { name: 'Multipurpose Sports Courts', slug: 'sports-courts', icon: 'Trophy', category: 'LEISURE' },
    { name: 'Covered Basement Parking', slug: 'covered-parking', icon: 'Car', category: 'CONVENIENCE' },
    { name: 'Metro Station Proximity', slug: 'metro-proximity', icon: 'Train', category: 'CONVENIENCE' },
    { name: 'Rainwater Harvesting', slug: 'rainwater-harvesting', icon: 'Droplets', category: 'ENVIRONMENT' },
  ];

  const amenities: Record<string, any> = {};
  for (const a of amenitiesList) {
    amenities[a.slug] = await prisma.amenity.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    });
  }

  // 7. Seed Properties (Realistically structured demonstration inventory)
  const propertiesData = [
    {
      title: '3 BHK Luxury Park-Facing Apartment in Sector 150 Noida',
      slug: '3-bhk-luxury-apartment-sector-150-noida',
      categorySlug: 'residential-property',
      citySlug: 'noida',
      localitySlug: 'sector-150',
      builderSlug: 'godrej-properties',
      projectName: 'Godrej Palm Retreat',
      purpose: 'SALE',
      propertyType: 'APARTMENT',
      price: 18500000,
      priceDisplay: '₹ 1.85 Cr',
      bedrooms: 3,
      bathrooms: 3,
      balconies: 3,
      carpetArea: 1450,
      superArea: 1950,
      areaUnit: 'SQ_FT',
      furnishing: 'SEMI_FURNISHED',
      possessionStatus: 'READY_TO_MOVE',
      possessionDate: 'Ready to Move',
      reraId: 'UPRERAPRJ745618',
      verifiedStatus: true,
      featuredStatus: true,
      availabilityStatus: 'AVAILABLE',
      address: 'Tower Sapphire, Sector 150, Noida-Greater Noida Expressway, Noida',
      pinCode: '201310',
      shortDescription: 'Spacious 3-BHK home with wraparound balconies overlooking 40 acres of thematic gardens in Noida’s greenest sector.',
      description: 'Experience resort-style living at this premium 3 BHK apartment situated in Sector 150 Noida. Featuring Italian marble flooring in living areas, VRV air conditioning, expansive balconies with serene green vistas, and modular kitchen with premium built-in fittings. Sector 150 is low-density with over 80% green cover, sports arenas, and signal-free connectivity to Delhi via the Noida-Greater Noida Expressway and Yamuna Expressway.',
      seoTitle: '3 BHK Luxury Apartment in Sector 150 Noida | Godrej Palm Retreat',
      seoDescription: 'Verified 3 BHK apartment for sale in Sector 150 Noida. 1,950 sq ft super area, park facing, ready to move with RERA registration.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          alt: 'Modern living room with floor to ceiling windows in Sector 150 Noida',
          isFeatured: true,
          displayOrder: 1,
          imageType: 'GALLERY',
        },
        {
          url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
          alt: 'Master bedroom suite with balcony view',
          isFeatured: false,
          displayOrder: 2,
          imageType: 'GALLERY',
        },
        {
          url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          alt: 'Designer kitchen with quartz island',
          isFeatured: false,
          displayOrder: 3,
          imageType: 'GALLERY',
        },
        {
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          alt: 'Architectural floor plan schematic',
          isFeatured: false,
          displayOrder: 4,
          imageType: 'FLOOR_PLAN',
        },
      ],
      amenitySlugs: ['gated-security', 'power-backup', 'swimming-pool', 'clubhouse', 'elevators', 'ev-charging', 'covered-parking'],
    },
    {
      title: 'Grade-A Commercial Office Space on Golf Course Ext Road Gurugram',
      slug: 'grade-a-office-space-golf-course-extension-gurugram',
      categorySlug: 'commercial-property',
      citySlug: 'gurugram',
      localitySlug: 'golf-course-ext-road',
      builderSlug: 'max-estates',
      projectName: 'Max Square Gurugram',
      purpose: 'SALE',
      propertyType: 'OFFICE_SPACE',
      price: 36000000,
      priceDisplay: '₹ 3.60 Cr',
      bedrooms: null,
      bathrooms: 2,
      balconies: null,
      carpetArea: 1800,
      superArea: 2400,
      areaUnit: 'SQ_FT',
      furnishing: 'FULLY_FURNISHED',
      possessionStatus: 'READY_TO_MOVE',
      possessionDate: 'Immediate',
      reraId: 'RC/REP/HARERA/GGM/612/344/2026',
      verifiedStatus: true,
      featuredStatus: true,
      availabilityStatus: 'AVAILABLE',
      address: 'Tower 2, Golf Course Extension Road, Sector 65, Gurugram',
      pinCode: '122018',
      shortDescription: 'High rental yield corporate office floor with LEED Platinum green rating and Grade-A MNC tenant occupancy.',
      description: 'An exceptional investment asset situated on Gurugram’s prime corporate strip. This fully-fitted Grade-A office unit is designed for multinational firms, boasting double-glazed low-E curtain wall facades, dedicated AHUs, advanced BMS automation, high-speed destination elevators, and an expected gross rental yield of 8.2% per annum.',
      seoTitle: 'Commercial Office Space Golf Course Ext Road Gurugram | Grade-A Investment',
      seoDescription: 'Buy high-yield Grade-A commercial office space on Golf Course Extension Road Gurugram. 2,400 sq.ft. with premium amenities and RERA compliance.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          alt: 'Contemporary glass corporate office interior with panoramic views',
          isFeatured: true,
          displayOrder: 1,
          imageType: 'GALLERY',
        },
        {
          url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
          alt: 'Executive board room with video conferencing',
          isFeatured: false,
          displayOrder: 2,
          imageType: 'GALLERY',
        },
      ],
      amenitySlugs: ['gated-security', 'power-backup', 'elevators', 'ev-charging', 'covered-parking', 'metro-proximity'],
    },
    {
      title: 'Freehold Residential Villa Plot near Pari Chowk Greater Noida',
      slug: 'freehold-villa-plot-pari-chowk-greater-noida',
      categorySlug: 'plots-for-sale',
      citySlug: 'greater-noida',
      localitySlug: 'pari-chowk',
      builderSlug: 'ats-infrastructure',
      projectName: 'Green Meadow Enclave',
      purpose: 'SALE',
      propertyType: 'RESIDENTIAL_PLOT',
      price: 12500000,
      priceDisplay: '₹ 1.25 Cr',
      bedrooms: null,
      bathrooms: null,
      balconies: null,
      carpetArea: 250,
      superArea: 250,
      areaUnit: 'SQ_YD',
      furnishing: 'UNFURNISHED',
      possessionStatus: 'READY_TO_MOVE',
      possessionDate: 'Immediate Registry',
      reraId: 'UPRERAPRJ892100',
      verifiedStatus: true,
      featuredStatus: true,
      availabilityStatus: 'AVAILABLE',
      address: 'Pocket C, Near Pari Chowk Metro Station, Greater Noida',
      pinCode: '201308',
      shortDescription: 'Authority-approved 250 sq.yd freehold plot with wide 18-meter front road, underground cabling, and immediate registry.',
      description: 'Rare opportunity to purchase an authority-approved freehold villa plot in a tranquil gated community moments from Pari Chowk. Enjoy wide tree-lined avenues, underground utility lines, 24/7 security, lush parks, and instant access to the Noida-Greater Noida Expressway and Eastern Peripheral Expressway.',
      seoTitle: 'Freehold Villa Plot for Sale near Pari Chowk Greater Noida | Authority Approved',
      seoDescription: '250 Sq Yd residential plot for sale near Pari Chowk, Greater Noida. Gated enclave, clear titles, immediate registry, and loan approved.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
          alt: 'Lush green residential plot with paved roads and streetlights',
          isFeatured: true,
          displayOrder: 1,
          imageType: 'GALLERY',
        },
        {
          url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
          alt: 'Master layout plan of the plotted development',
          isFeatured: false,
          displayOrder: 2,
          imageType: 'MASTER_PLAN',
        },
      ],
      amenitySlugs: ['gated-security', 'power-backup', 'metro-proximity', 'rainwater-harvesting'],
    },
    {
      title: 'Sprawling 1-Acre Luxury Farmhouse Estate in Chhatarpur Delhi',
      slug: 'luxury-farmhouse-estate-chhatarpur-delhi',
      categorySlug: 'farmhouse-for-sale',
      citySlug: 'delhi',
      localitySlug: 'chhatarpur',
      builderSlug: 'dlf-luxury',
      projectName: 'Aravalli Greens Sanctuary',
      purpose: 'SALE',
      propertyType: 'LUXURY_FARMHOUSE',
      price: 240000000,
      priceDisplay: '₹ 24.00 Cr',
      bedrooms: 5,
      bathrooms: 6,
      balconies: 4,
      carpetArea: 8500,
      superArea: 1,
      areaUnit: 'ACRE',
      furnishing: 'FULLY_FURNISHED',
      possessionStatus: 'READY_TO_MOVE',
      possessionDate: 'Ready for Occupancy',
      reraId: 'N/A (Farmhouse Land)',
      verifiedStatus: true,
      featuredStatus: true,
      availabilityStatus: 'AVAILABLE',
      address: 'Silver Oak Avenue, Chhatarpur Green Belt, South Delhi',
      pinCode: '110074',
      shortDescription: 'Opulent 1-acre private estate with swimming pool, landscaped lawn, private gazebo, and bespoke Italian interiors.',
      description: 'Nestled in the prestigious farmhouse sanctuary of Chhatarpur, South Delhi, this 1-acre gated estate represents the pinnacle of privacy and grandeur. Featuring a 8,500 sq ft neoclassical villa, 5 palatial ensuite bedrooms, temperature-controlled private lap pool, staff quarters for 6, tennis court, fruit orchards, and biometric boundary security.',
      seoTitle: '1 Acre Luxury Farmhouse for Sale in Chhatarpur Delhi | Grand Realty NCR',
      seoDescription: 'Exclusive 1-acre farmhouse in Chhatarpur, South Delhi. Private pool, manicured gardens, 5 BHK luxury villa, clear freehold mutation.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          alt: 'Grand neoclassical villa surrounded by expansive emerald lawns',
          isFeatured: true,
          displayOrder: 1,
          imageType: 'GALLERY',
        },
        {
          url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          alt: 'Private pool deck and illuminated outdoor cabana at twilight',
          isFeatured: false,
          displayOrder: 2,
          imageType: 'GALLERY',
        },
      ],
      amenitySlugs: ['gated-security', 'power-backup', 'swimming-pool', 'clubhouse', 'ev-charging', 'covered-parking', 'sports-courts'],
    },
    {
      title: '4 BHK Ultra-Luxury Sky Residence on Dwarka Expressway Gurugram',
      slug: '4-bhk-ultra-luxury-sky-residence-dwarka-expressway-gurugram',
      categorySlug: 'residential-property',
      citySlug: 'gurugram',
      localitySlug: 'dwarka-expressway',
      builderSlug: 'dlf-luxury',
      projectName: 'DLF The Crest Horizon',
      purpose: 'SALE',
      propertyType: 'PENTHOUSE',
      price: 42000000,
      priceDisplay: '₹ 4.20 Cr',
      bedrooms: 4,
      bathrooms: 5,
      balconies: 4,
      carpetArea: 2800,
      superArea: 3650,
      areaUnit: 'SQ_FT',
      furnishing: 'SEMI_FURNISHED',
      possessionStatus: 'NEW_LAUNCH',
      possessionDate: 'Dec 2027',
      reraId: 'RC/REP/HARERA/GGM/788/2026',
      verifiedStatus: true,
      featuredStatus: false,
      availabilityStatus: 'AVAILABLE',
      address: 'Sector 106, Dwarka Expressway, Gurugram',
      pinCode: '122006',
      shortDescription: 'Signature high-rise condominium featuring double-height balconies, private elevator foyer, and 50,000 sq ft clubhouse.',
      description: 'A masterpiece of contemporary architecture on the thriving 16-lane Dwarka Expressway. Designed by internationally acclaimed architects, this 4 BHK sky suite offers 11 ft clear ceiling heights, floor-to-ceiling soundproof acoustic glazing, automated climate control, and rapid 15-minute access to Terminal 3, IGI Airport.',
      seoTitle: '4 BHK Luxury Penthouse on Dwarka Expressway Gurugram | DLF',
      seoDescription: 'Book verified 4 BHK penthouse on Dwarka Expressway, Gurugram. 3,650 sq ft, high ceiling, private elevator, RERA certified.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          alt: 'High-rise luxury apartment tower with modern glass balconies',
          isFeatured: true,
          displayOrder: 1,
          imageType: 'GALLERY',
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
          alt: 'Spacious interior with contemporary minimalist furnishings',
          isFeatured: false,
          displayOrder: 2,
          imageType: 'GALLERY',
        },
      ],
      amenitySlugs: ['gated-security', 'power-backup', 'swimming-pool', 'clubhouse', 'elevators', 'covered-parking'],
    },
    {
      title: 'High-Footfall Double Height Retail Shop in Techzone 4 Greater Noida West',
      slug: 'retail-shop-techzone-4-greater-noida-west',
      categorySlug: 'commercial-property',
      citySlug: 'greater-noida-west',
      localitySlug: 'techzone-4',
      builderSlug: 'ats-infrastructure',
      projectName: 'ATS Kinghood Drive',
      purpose: 'SALE',
      propertyType: 'RETAIL_SHOP',
      price: 6800000,
      priceDisplay: '₹ 68.00 Lakh',
      bedrooms: null,
      bathrooms: 1,
      balconies: null,
      carpetArea: 320,
      superArea: 550,
      areaUnit: 'SQ_FT',
      furnishing: 'UNFURNISHED',
      possessionStatus: 'READY_TO_MOVE',
      possessionDate: 'Immediate',
      reraId: 'UPRERAPRJ11987',
      verifiedStatus: true,
      featuredStatus: false,
      availabilityStatus: 'AVAILABLE',
      address: 'Ground Floor, High Street Plaza, Techzone 4, Greater Noida West',
      pinCode: '201306',
      shortDescription: 'Ground-floor double-height retail shop catering to over 30,000 residential families in the immediate catchment.',
      description: 'Strategic retail shop located right on the 130-meter wide expressway in Techzone 4, Greater Noida West. With a 14 ft double-height ceiling allowing mezzanine construction, massive glass frontage, dedicated escalators, and strong anchor brand neighbors, this property provides excellent rental returns for smart commercial investors.',
      seoTitle: 'Commercial Retail Shop for Sale in Techzone 4 Greater Noida West',
      seoDescription: 'High-return ground floor retail shop in Techzone 4 Noida Extension. Double height, high catchment, RERA approved.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
          alt: 'Vibrant modern retail boulevard with storefronts and landscaped pedestrian pathways',
          isFeatured: true,
          displayOrder: 1,
          imageType: 'GALLERY',
        },
      ],
      amenitySlugs: ['gated-security', 'power-backup', 'elevators', 'ev-charging', 'covered-parking'],
    },
  ];

  for (const prop of propertiesData) {
    const category = categories[prop.categorySlug];
    const city = cities[prop.citySlug];
    const locality = localities[`${prop.citySlug}_${prop.localitySlug}`];
    const builder = builders[prop.builderSlug];

    const property = await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {},
      create: {
        title: prop.title,
        slug: prop.slug,
        description: prop.description,
        shortDescription: prop.shortDescription,
        price: prop.price,
        priceDisplay: prop.priceDisplay,
        categoryId: category.id,
        purpose: prop.purpose,
        propertyType: prop.propertyType,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        balconies: prop.balconies,
        carpetArea: prop.carpetArea,
        superArea: prop.superArea,
        areaUnit: prop.areaUnit,
        furnishing: prop.furnishing,
        possessionStatus: prop.possessionStatus,
        possessionDate: prop.possessionDate,
        reraId: prop.reraId,
        verifiedStatus: prop.verifiedStatus,
        featuredStatus: prop.featuredStatus,
        availabilityStatus: prop.availabilityStatus,
        address: prop.address,
        localityId: locality?.id,
        cityId: city.id,
        pinCode: prop.pinCode,
        builderId: builder?.id,
        projectName: prop.projectName,
        seoTitle: prop.seoTitle,
        seoDescription: prop.seoDescription,
        published: true,
        isIndexable: true,
      },
    });

    // Images
    for (const img of prop.images) {
      await prisma.propertyImage.create({
        data: {
          propertyId: property.id,
          url: img.url,
          alt: img.alt,
          isFeatured: img.isFeatured,
          displayOrder: img.displayOrder,
          imageType: img.imageType,
        },
      });
    }

    // Amenities
    for (const aSlug of prop.amenitySlugs) {
      const amenity = amenities[aSlug];
      if (amenity) {
        await prisma.propertyAmenity.upsert({
          where: {
            propertyId_amenityId: {
              propertyId: property.id,
              amenityId: amenity.id,
            },
          },
          update: {},
          create: {
            propertyId: property.id,
            amenityId: amenity.id,
          },
        });
      }
    }
  }

  // 8. Sample Demonstration CRM Leads
  const sampleLeads = [
    {
      leadNumber: 'GR-2026-0001',
      name: 'Aditya Oberoi',
      phone: '+91 98711 22334',
      email: 'aditya.oberoi@example.com',
      propertySlug: '3-bhk-luxury-apartment-sector-150-noida',
      preferredArea: 'Sector 150 Noida',
      budget: '₹ 1.8 Cr - ₹ 2.2 Cr',
      message: 'Looking for a ready-to-move 3 BHK park-facing unit for family relocation.',
      leadSource: 'PROPERTY_ENQUIRY',
      landingPage: '/property/3-bhk-luxury-apartment-sector-150-noida',
      status: 'QUALIFIED',
      notes: 'Client works in MNC Noida Sec 135. Pre-approved home loan from HDFC.',
    },
    {
      leadNumber: 'GR-2026-0002',
      name: 'Meera Chawla',
      phone: '+91 98112 33445',
      email: 'meera.chawla@example.com',
      propertySlug: 'grade-a-office-space-golf-course-extension-gurugram',
      preferredArea: 'Golf Course Extension Road',
      budget: '₹ 3.5 Cr - ₹ 4.0 Cr',
      message: 'Interested in commercial investment with pre-leased MNC tenant.',
      leadSource: 'WHATSAPP',
      landingPage: '/property/grade-a-office-space-golf-course-extension-gurugram',
      status: 'SITE_VISIT_SCHEDULED',
      notes: 'Site visit confirmed for this Saturday at 11:30 AM.',
    },
    {
      leadNumber: 'GR-2026-0003',
      name: 'Dr. Harsh Vardhan',
      phone: '+91 99998 88776',
      email: 'harsh.v@example.com',
      propertySlug: 'freehold-villa-plot-pari-chowk-greater-noida',
      preferredArea: 'Greater Noida',
      budget: '₹ 1.2 Cr',
      message: 'Need clarity on authority transfer charges and bank loan clearance.',
      leadSource: 'CALLBACK_REQUEST',
      landingPage: '/plots-for-sale',
      status: 'NEW',
      notes: 'Requested callback after 6:00 PM.',
    },
  ];

  for (const l of sampleLeads) {
    const prop = await prisma.property.findUnique({ where: { slug: l.propertySlug } });
    await prisma.lead.upsert({
      where: { leadNumber: l.leadNumber },
      update: {},
      create: {
        leadNumber: l.leadNumber,
        name: l.name,
        phone: l.phone,
        email: l.email,
        propertyId: prop?.id,
        categoryId: prop?.categoryId,
        cityId: prop?.cityId,
        preferredArea: l.preferredArea,
        budget: l.budget,
        message: l.message,
        leadSource: l.leadSource,
        landingPage: l.landingPage,
        assignedUserId: propertyManager.id,
        status: l.status,
        notes: l.notes,
      },
    });
  }

  // 9. Educational Real Estate Blogs
  const blogsData = [
    {
      title: 'Delhi NCR RERA Guide: How to Verify Builder Clearances Before Buying',
      slug: 'delhi-ncr-rera-guide-builder-clearances',
      excerpt: 'Step-by-step checklist to search UP RERA and HRERA portals, verify escrow compliance, and prevent title risks.',
      content: `Purchasing real estate in the Delhi NCR region requires thorough due diligence. Since the implementation of the Real Estate (Regulation and Development) Act, buyers possess robust statutory protections, provided they verify project filings carefully.\n\n### 1. Understanding UP RERA and Haryana RERA (HRERA)\nEach state in Delhi NCR maintains its own statutory portal:\n- Uttar Pradesh: [up-rera.in](https://up-rera.in)\n- Haryana (Gurugram): [haryanarera.gov.in](https://haryanarera.gov.in)\n- Delhi NCT: [rera.delhi.gov.in](https://rera.delhi.gov.in)\n\n### 2. What to Verify on the RERA Certificate\nEvery published project must hold a valid registration number. Verify:\n- Sanctioned Building Plans vs. Marketed Floor Plans\n- Scheduled Completion Date & Quarterly Progress Reports (QPR)\n- Dedicated 70% Project Escrow Account Details\n- Encumbrance Certificate & Bank Mortgage Disclosures\n\nAt Grand Realty NCR, every property we list undergoes legal clearance to guarantee 100% peace of mind for our clients.`,
      featuredImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Real estate contract documents and architectural blueprints',
      authorName: 'NCR Real Estate Legal Cell',
      category: 'LEGAL_ADVICE',
      seoTitle: 'RERA Verification Guide for Delhi NCR Properties | Grand Realty NCR',
      seoDescription: 'Comprehensive guide to checking UP RERA and HRERA compliance before purchasing flats, plots, or commercial spaces in Delhi NCR.',
    },
    {
      title: 'Dwarka Expressway vs Noida Expressway: 2026 Comprehensive Investment Analysis',
      slug: 'dwarka-expressway-vs-noida-expressway-investment-analysis',
      excerpt: 'Comparing capital appreciation, rental yield, transit infrastructure, and livability across NCR’s two flagship corridors.',
      content: `As Delhi NCR’s infrastructure modernizes, property investors and end-users frequently debate whether to choose the established Noida-Greater Noida Expressway or the newly operational Dwarka Expressway in Gurugram.\n\n### Key Highlights\n1. **Connectivity**: Dwarka Expressway provides rapid transit to IGI Airport (T3) within 15-20 minutes. Noida Expressway connects directly to Central Delhi and the upcoming Jewar International Airport.\n2. **Livability**: Sector 150 and Sector 128 Noida boast exceptional green cover (over 70%), while Gurugram sectors provide proximity to Fortune 500 corporate offices on Golf Course Road.\n3. **Rental Yields**: Commercial office spaces on Golf Course Ext Rd yield 7.5% - 8.5%, while residential apartments in Noida provide 3.5% - 4.2% steady yields.\n\nContact our senior advisors for personalized portfolio recommendations tailored to your budget and capital appreciation targets.`,
      featuredImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Modern highway expressway with high-rise financial skyline',
      authorName: 'Vikas, Managing Partner',
      category: 'MARKET_TRENDS',
      seoTitle: 'Dwarka Expressway vs Noida Expressway: Real Estate Investment Comparison',
      seoDescription: 'Detailed comparison of property prices, rental yields, and upcoming infrastructure between Noida Expressway and Dwarka Expressway Gurugram.',
    },
  ];

  for (const b of blogsData) {
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        content: b.content,
        featuredImageUrl: b.featuredImageUrl,
        imageAlt: b.imageAlt,
        authorName: b.authorName,
        category: b.category,
        seoTitle: b.seoTitle,
        seoDescription: b.seoDescription,
        isPublished: true,
      },
    });
  }

  // 10. Verified Client Testimonials
  const testimonials = [
    {
      clientName: 'Sanjay & Sunita Singhal',
      clientRole: 'Homebuyers, Sector 150 Noida',
      rating: 5,
      quote: 'Grand Realty NCR helped us navigate RERA clearances and negotiated the best price on our 3 BHK in Sector 150. Transparent, knowledgeable, and zero hidden surprises.',
      propertyLocation: 'Noida',
    },
    {
      clientName: 'Rajeev Singhania',
      clientRole: 'Commercial Investor, Gurugram',
      rating: 5,
      quote: 'Their insights into Grade-A office leases on Golf Course Extension Road were spot-on. We achieved an 8.2% gross rental return with zero vacancy downtime.',
      propertyLocation: 'Gurugram',
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: t,
    });
  }

  // 11. Promotional Banners
  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    await prisma.banner.create({
      data: {
        title: 'Diwali Property Dhamaka',
        desktopImage: '/banners/diwali-banner-desktop.png',
        mobileImage: '/banners/diwali-banner-mobile.jpg',
        link: '/residential-property',
        alt: 'Diwali Dhamaka - Apna Sapno Ka Ghar Ab Aur Bhi Kareeb | Special Property Offers',
        isActive: true,
        displayOrder: 1,
      },
    });
  }

  console.log('Maa Kalkaji Properties Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
