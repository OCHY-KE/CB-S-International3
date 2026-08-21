// Centralized SEO configuration and metadata dictionary for CBSI
export const SITE_CONFIG = {
  siteName: 'Conference Bookings & Safaris International',
  shortName: 'CB S International',
  siteUrl: typeof window !== 'undefined' ? window.location.origin : 'https://cbs-international.com',
  defaultTitle: 'Conference Bookings & Safaris International | Luxury Safaris & MICE Travel',
  titleTemplate: '%s | CB S International',
  defaultDescription: 'Experience premier East Africa wildlife safaris, 4K visual expeditions, luxury lodge retreats, and seamless international corporate conference logistics with CB S International.',
  defaultKeywords: 'Kenya safaris, East Africa tours, Maasai Mara 4K video, Serengeti migration, Amboseli Kilimanjaro, MICE travel Nairobi, luxury tented camps, corporate conference bookings, African wildlife photography',
  defaultImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
  twitterHandle: '@CBS_Safaris',
  contactEmail: 'info@cbs-international.com',
  telephone: '+254 700 000000',
  address: {
    streetAddress: 'Kenyatta Avenue, CBD',
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    postalCode: '00100',
    addressCountry: 'KE'
  }
}

// Route-specific metadata mapping
export const ROUTE_SEO = {
  '/': {
    title: 'Luxury East Africa Safaris & Corporate Conferences',
    description: 'Bespoke wildlife safaris across Kenya & Tanzania, corporate conference planning, luxury lodge bookings, and 4K African safari expeditions.',
    keywords: 'East Africa safaris, Maasai Mara tours, Serengeti wildlife, Nairobi conference organizers, corporate travel Africa',
    ogType: 'website',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200'
  },
  '/about': {
    title: 'About Us | Premier Safari Expeditions & MICE Logistics',
    description: 'Learn about CB S International: our heritage in Kenya, mission to preserve wildlife, luxury safari craftsmanship, and global MICE conference management.',
    keywords: 'about CBSI, Kenya tour operator, safari guides, African travel agency heritage, conservation tourism',
    ogType: 'article',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200'
  },
  '/gallery': {
    title: 'Visual Safari Odyssey & 4K Video Gallery',
    description: 'Immerse yourself in our curated gallery of high-resolution African wildlife photography and 4K safari expedition video clips across the Mara, Serengeti, and Amboseli.',
    keywords: 'safari photo gallery, 4K wildlife videos, lion sightings, great migration clips, African savannah photography, luxury lodge gallery',
    ogType: 'website',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1200'
  },
  '/contact': {
    title: 'Contact Our Nairobi Expedition Office & Safari Concierge',
    description: 'Connect with CB S International. Inquire about bespoke luxury safaris, private air charters, corporate summit logistics, and 24/7 bush dispatch.',
    keywords: 'contact CBSI, Nairobi safari office, bespoke safari booking Kenya, safari consultation, corporate MICE travel Africa',
    ogType: 'website',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200'
  },
  '/login': {
    title: 'Client Portal Login | Access Saved Safaris & Itineraries',
    description: 'Sign in to your CB S International client account to view personalized safari itineraries, booking statuses, and conference arrangements.',
    keywords: 'safari login, client portal, booking access, CBSI user account',
    ogType: 'website',
    noIndex: false
  },
  '/create-account': {
    title: 'Create Account | Join the CBSI Explorer Club',
    description: 'Create an account to save custom safari itineraries, bookmark favorite wildlife sightings, and receive exclusive safari & conference packages.',
    keywords: 'register safari account, explorer club, safari booking signup',
    ogType: 'website',
    noIndex: false
  },
  '/profile': {
    title: 'My Explorer Profile & Saved Expeditions',
    description: 'Manage your profile information, view booked safari packages, and customize travel preferences with CB S International.',
    keywords: 'client profile, safari preferences, booking manager',
    ogType: 'profile',
    noIndex: true
  },
  '/admin-login': {
    title: 'Executive Admin Login | CBSI Operations Hub',
    description: 'Secure management portal for CB S International staff, safari leads, and conference coordinators.',
    ogType: 'website',
    noIndex: true
  },
  '/admin-dashboard': {
    title: 'Management Dashboard & Safari Operations Console',
    description: 'Executive admin panel for managing safari packages, delegate registrations, and media publications.',
    ogType: 'website',
    noIndex: true
  },
  '/admin-gallery': {
    title: 'Admin Gallery Studio | 4K Video & Imagery Publisher',
    description: 'Publish and curate high-resolution wildlife captures and 4K safari footage for the public gallery.',
    ogType: 'website',
    noIndex: true
  }
}

// Generate JSON-LD Organization Schema
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_CONFIG.siteName,
    alternateName: SITE_CONFIG.shortName,
    url: SITE_CONFIG.siteUrl,
    logo: 'https://res.cloudinary.com/cioghqt5/image/upload/v1786973128/cbsi1.ico',
    image: SITE_CONFIG.defaultImage,
    description: SITE_CONFIG.defaultDescription,
    telephone: SITE_CONFIG.telephone,
    email: SITE_CONFIG.contactEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.286389,
      longitude: 36.817223
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59'
    },
    sameAs: [
      'https://facebook.com',
      'https://instagram.com',
      'https://twitter.com'
    ],
    priceRange: '$$$$'
  }
}

// Generate JSON-LD Breadcrumbs Schema
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.path ? `${SITE_CONFIG.siteUrl}${item.path}` : undefined
    }))
  }
}