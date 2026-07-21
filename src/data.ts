/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Destination, Trip, PackageTier, Review, GalleryItem, FAQItem } from "./types";

export const DESTINATIONS: Destination[] = [
  {
    id: "goa",
    name: "Goa",
    subTitle: "Beach & Party",
    desc: "A sun-soaked coastal haven offering pristine sandy shorelines, legendary late-night gatherings, and vibrant water adventures designed for the free-spirited.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80",
    season: "Oct – Mar",
    duration: "4 Days / 3 Nights",
    price: 8999,
    originalPrice: 10999,
    attractions: ["Anjuna flea market", "Chapora Fort", "Old Goa churches"],
    category: "Beach",
    rating: 4.8,
    longDesc: "Experience the unique blend of Portuguese ancestry and Indian coastal culture. From hidden white-sand coverlets in South Goa to the electronic music pulses of North Goa, this curated highway triggers a deep release. We explore old Latin quarters, cruise through winding backwater roads flanked by coconut palms, and dine on authentic coconut fish curries.",
    highlights: ["Tito's Lane Nightlife", "Water sports at Candolim", "Panjim Latin Quarter", "Basilica of Bom Jesus"],
    itinerary: [
      { day: "Day 1", title: "North Goa", description: "Baga, Calangute, Fort Aguada, and a spectacular sunset at Vagator.", icons: ["map-pin", "sunset"] },
      { day: "Day 2", title: "Water Sports & Markets", description: "Water sports at Candolim, Anjuna flea market, Chapora Fort, and Tito's Lane nightlife.", icons: ["waves", "music"] },
      { day: "Day 3", title: "South Goa", description: "Explore Palolem, Cola Beach, and Butterfly Beach for a quieter, serene vibe.", icons: ["compass", "sun"] },
      { day: "Day 4", title: "Old Goa & Departure", description: "Old Goa churches (Basilica of Bom Jesus), Panjim Latin Quarter, and departure.", icons: ["camera", "bus"] }
    ],
    inclusions: ["3 Nights Boutique Stay", "All Breakfasts & 2 Special Dinners", "Internal Transfers (AC Tempo Traveller)", "Trip Captain"],
    exclusions: ["Flights / Trains to Goa", "Lunches", "Personal Expenses", "Water Sports Fees"],
    faqs: [
      { id: "g1", question: "Is this trip suitable for solo travelers?", answer: "Absolutely! Over 60% of our travelers join solo. It's the best way to meet new friends." }
    ],
    pickupPoints: ["Goa Airport (Dabolim)", "Madgaon Railway Station", "Panjim Bus Stand"],
    packingList: ["Comfortable beachwear", "Sunscreen & Sunglasses", "One party outfit", "Flip-flops and walking shoes", "Reusable water bottle"],
    cancellationPolicy: "Cancel 15 days before the trip for a 100% refund. 50% refund if cancelled 7-14 days before. No refund within 7 days of departure."
  }
];

export const TRIPS: Trip[] = [
  {
    id: "trip-goa-1",
    destinationId: "goa",
    destinationName: "Goa Beach & Party",
    dates: "12 – 15 July 2025",
    price: 8999,
    originalPrice: 10999,
    seatsTotal: 15,
    seatsAvailable: 4,
    description: "An intimate Monsoon escape covering old Goa's historic forts and hidden rain-washed rainforest networks.",
    status: "Selling Fast"
  }
];

export const PACKAGES: PackageTier[] = [
  {
    id: "explorer",
    name: "Explorer",
    desc: "Weekend escapes & city trails",
    basePrice: 4999,
    features: [
      "Shared hostel or comfortable home accommodations",
      "Spacious group traveler traveler vans",
      "Handcrafted trail itineraries",
      "Experienced Trip Captain guidance",
      "Breakfast and light snacks included"
    ]
  },
  {
    id: "adventure",
    name: "Adventure",
    desc: "Multi-day adventures across India",
    basePrice: 9999,
    isMostLoved: true,
    features: [
      "Premium boutique stays & private pool villas",
      "Dedicated, comfortable SUVs with pro drivers",
      "All major culinary meals included (Local flavors)",
      "Certified local mountaineers & specialty guides",
      "Included professional photographer / videographer setup",
      "All entry permits and parking fees covered"
    ]
  },
  {
    id: "premium-expedition",
    name: "Premium Expedition",
    desc: "Once-in-a-lifetime journeys",
    basePrice: 14999,
    features: [
      "Luxury glamping, heritage forts & estate homestays",
      "Private premium 4x4 or high-end cruiser",
      "On-call personal travel concierge",
      "Hyper-customized itinerary mapping",
      "All excursions, equipment & gear rental included",
      "High-resolution professional media kit (drons, reels)"
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Rohan Advani",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    destination: "Spiti Valley",
    content: "Spiti with RAASTA is unlike any other journey. The level of care, the expert captaincy, and the music nights at Kaza campsite created bonds for life. Recommending this to every serious overlander!",
    date: "June 2025"
  },
  {
    id: "rev-2",
    author: "Malini Sen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    destination: "Gokarna",
    content: "The half-moon beach cliff walk on Gokarna backpacker trail was gorgeous. But the highlight has to be witnessing bioluminescence in the pitch-dark ocean water. Literally felt like Magic!",
    date: "May 2025"
  },
  {
    id: "rev-3",
    author: "Devendra Verma",
    avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=150",
    rating: 4,
    destination: "Goa",
    content: "Thought I had seen Goa inside out, but RAASTA showed me the true heart. The Fontainhas Heritage Walk was filled with quirky history, and the secret beach barbeque was stellar.",
    date: "April 2025"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-3",
    url: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80",
    title: "Om Beach Bonfire Night",
    destination: "Gokarna",
    category: "Beaches",
    date: "May 19, 2025",
    likes: 271,
    photographer: "Siddharth S."
  },
  {
    id: "gal-2",
    url: "https://images.unsplash.com/photo-1614082242765-7c98db0f3df3?auto=format&fit=crop&w=1400&q=80",
    title: "Vespa Diaries",
    destination: "Goa",
    category: "People",
    date: "July 2, 2025",
    likes: 189,
    photographer: "Varun K."
  },
  {
    id: "gal-1",
    url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1400&q=80",
    title: "Mountain Pass Summit",
    destination: "Spiti Valley",
    category: "Mountains",
    date: "June 15, 2025",
    likes: 342,
    photographer: "Meenal G."
  },
  {
    id: "gal-4",
    url: "https://images.unsplash.com/photo-1504712548863-1f758290f57d?auto=format&fit=crop&w=1400&q=80",
    title: "Chasing Clouds",
    destination: "Spiti Valley",
    category: "Roads",
    date: "June 18, 2025",
    likes: 412,
    photographer: "Joydeep R."
  },
  {
    id: "gal-5",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    title: "Unmapped Trails",
    destination: "Gokarna",
    category: "Roads",
    date: "May 22, 2025",
    likes: 156,
    photographer: "Siddharth S."
  },
  {
    id: "gal-6",
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80",
    title: "Community on the Road",
    destination: "Goa",
    category: "People",
    date: "July 3, 2025",
    likes: 298,
    photographer: "Pranav M."
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do RAASTA road trips work?",
    answer: "RAASTA is not a standard sightseeing agency. We design intimate group road-expeditions. Each group consists of 10 to 15 travel souls led by an experienced RAASTA Trip Captain. We travel in high-quality vehicles, stop at curated local stops, stay at boutique accommodations, and form a tight-knit family over music jams and campfires."
  },
  {
    id: "faq-2",
    question: "Do I have to drive my own vehicle?",
    answer: "No! All packages include transport. Depending on your choice and path, you can sit back in comfortably chauffeured high-quality traveler vans or rugged 4x4 vehicles. However, if you would love to bring your own high-clearance SUV or premium ride, select 'Self-Drive Caravan' packages via our inquiry lines."
  },
  {
    id: "faq-3",
    question: "Are these trips safe for solo female travelers?",
    answer: "Over 65% of our explorers join solo, a major component of whom are female travelers. Inclusivity, rigorous safety audits, and positive local support networks are core pillars of are operation. All rooms have secure layouts,-and our captains are trained in safety protocols and emergency management."
  },
  {
    id: "faq-4",
    question: "What is your cancellation buffer policy?",
    answer: "If you cancel 15 days or more prior to departure, you receive a full refund as RAASTA travel credits which never expire. If you cancel within 7 to 14 days, a 50% refund is issued. Within 7 days, cancellations do not qualify for refund but can be transferred to a friend or relative with no extra charges."
  }
];
