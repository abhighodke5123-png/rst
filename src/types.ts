/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Destination {
  id: string;
  name: string;
  subTitle: string;
  desc: string;
  image: string;
  season: string;
  duration: string;
  price: number;
  originalPrice?: number;
  attractions: string[];
  category: "Beach" | "Mountain" | "Adventure" | "Cultural";
  rating: number;
  longDesc: string;
  highlights: string[];
  collectionDefault?: "explore" | "select";
  itinerary?: { day: string; title: string; description: string; icons?: string[] }[];
  inclusions?: string[];
  exclusions?: string[];
  faqs?: FAQItem[];
  pickupPoints?: string[];
  packingList?: string[];
  cancellationPolicy?: string;
}

export interface Trip {
  id: string;
  destinationId: string;
  destinationName: string;
  collection: "explore" | "select";
  dates: string;
  price: number;
  originalPrice?: number;
  duration: string;
  seatsTotal: number;
  seatsAvailable: number;
  description: string;
  overview?: string;
  heroImage?: string;
  status: "Selling Fast" | "Filling Fast" | "Almost Full" | "Seats Open" | "Monsoon Special" | string;
  captainName?: string;
  isFlexibleDates?: boolean;
  itinerary?: { day: string; title: string; description: string; icons?: string[] }[];
  transportDetails?: string;
  accommodationDetails?: string;
  mealsDetails?: string;
  inclusions?: string[];
  exclusions?: string[];
  galleryImages?: string[];
  cancellationPolicy?: string;
  faqs?: FAQItem[];
  category: "Mountain" | "Adventure" | "Beach" | "Cultural" | "Weekend";
  published?: boolean;
}

export interface PackageTier {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
  features: string[];
  isMostLoved?: boolean;
}

export type EnquiryStatus = "New" | "Contacted" | "Quotation Sent" | "Confirmed" | "Cancelled" | "Closed";

export interface Enquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  destination: string;
  tripId?: string;
  departureDate: string;
  numTravelers: number;
  collectionPreference: "explore" | "select" | "flexible";
  additionalRequirements?: string;
  status: EnquiryStatus;
  createdAt: string | number;
  assignedTo?: string;
  internalNotes?: string;
  followUpDate?: string;
  communicationHistory?: { date: string; note: string; author: string }[];
}

export interface Booking {
  id: string;
  enquiryId?: string;
  tripId: string;
  tripName: string;
  travelerName: string;
  email: string;
  phone: string;
  numTravelers: number;
  tierSelected: string;
  addOns?: {
    photographer?: boolean;
    premiumStay?: boolean;
    localGuide?: boolean;
  };
  totalCost: number;
  bookingDate: string;
  status: "Confirmed" | "Pending Verification" | "Cancelled";
  confirmedAt?: string | number;
  confirmedBy?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  destination: string;
  content: string;
  date: string;
  tripCollection?: "explore" | "select";
  verifiedTraveler?: boolean;
  createdAt?: any;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  destination: string;
  category: "Beaches" | "Mountains" | "Roads" | "People";
  date: string;
  likes: number;
  photographer: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  experience: string;
  specialtyRoutes: string[];
}
