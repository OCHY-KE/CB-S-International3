export type Country = 'Kenya' | 'Tanzania' | 'Kenya & Tanzania' | 'Uganda & Rwanda';

export type SafariTier = 'Luxury Lodge' | 'Classic Mid-Range' | 'Budget Adventure' | 'Fly-In Safari' | 'Honeymoon' | 'Family';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'KES';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rateToUSD: number; // 1 USD in this currency
  format: (amountUSD: number) => string;
}

export interface DayPlan {
  day: number;
  title: string;
  location: string;
  description: string;
  accommodation: string;
  meals: string;
  activities: string[];
}

export interface SafariPackage {
  id: string;
  title: string;
  subtitle: string;
  country: Country;
  destinations: string[];
  durationDays: number;
  durationNights: number;
  priceUSD: number;
  tier: SafariTier;
  badge?: string;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  dailyItinerary: DayPlan[];
  groupType: 'Private 4x4 Jeep' | 'Small Group' | 'Fly-in Bush Plane';
  wildlifeFocus: string[];
  bestMonths: string;
  isTrending?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  country: 'Kenya' | 'Tanzania' | 'Uganda' | 'Rwanda';
  tagline: string;
  description: string;
  bestTimeToVisit: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  topWildlife: string[];
  idealDays: string;
  climate: string;
  coordinates: { lat: number; lng: number };
}

export interface WildlifeProfile {
  id: string;
  name: string;
  swahiliName: string;
  scientificName: string;
  category: 'The Big Five' | 'Predators' | 'Great Migration' | 'Safari Icons';
  sightingLikelihood: 'Very High' | 'High' | 'Moderate' | 'Rare';
  bestParks: string[];
  description: string;
  funFact: string;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  country: string;
  avatar: string;
  rating: number;
  date: string;
  safariTaken: string;
  title: string;
  comment: string;
  guideName?: string;
}

export interface CustomSafariQuoteRequest {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  destinations: string[];
  travelDates: string;
  durationDays: number;
  numberOfAdults: number;
  numberOfChildren: number;
  safariTier: SafariTier;
  specialInterests: string[];
  notes?: string;
  contactPreference: 'WhatsApp' | 'Email' | 'Phone Call';
}