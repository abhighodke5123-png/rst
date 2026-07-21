/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  itinerary?: { day: string; title: string; description: string; icons: string[] }[];
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
  dates: string;
  price: number;
  originalPrice?: number;
  seatsTotal: number;
  seatsAvailable: number;
  description: string;
  status: "Selling Fast" | "Filling Fast" | "Almost Full" | "Seats Open" | "Monsoon Special" | string;
  captainName?: string;
  isFlexibleDates?: boolean;
}

export interface PackageTier {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
  features: string[];
  isMostLoved?: boolean;
}

export interface Booking {
  id: string;
  tripId: string;
  tripName: string;
  travelerName: string;
  email: string;
  phone: string;
  numTravelers: number;
  tierSelected: string;
  addOns: {
    photographer: boolean;
    premiumStay: boolean;
    localGuide: boolean;
  };
  totalCost: number;
  bookingDate: string;
  status: "Confirmed" | "Pending Payment";
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  destination: string;
  content: string;
  date: string;
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

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
