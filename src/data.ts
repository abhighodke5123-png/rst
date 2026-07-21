/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Destination, Trip, PackageTier, Review, GalleryItem, FAQItem } from "./types";
// @ts-expect-error - Vite handles asset imports dynamically
import goaImg from "./assets/images/regenerated_image_1784640113613.jpg";
// @ts-expect-error - Vite handles asset imports dynamically
import gokarnaImg from "./assets/images/regenerated_image_1784640115451.jpg";

export const DESTINATIONS: Destination[] = [
  {
    id: "goa",
    name: "Goa",
    subTitle: "Beach, Heritage & Sunsets",
    desc: "A perfect blend of high-energy coastal nightlife, quiet white-sand lagoons, Portuguese heritage, and jaw-dropping cliffside sunsets.",
    image: goaImg,
    season: "Oct – Mar",
    duration: "4 Days / 3 Nights",
    price: 8999,
    originalPrice: 10999,
    attractions: ["Cabo de Rama Fort", "Cola Beach Lagoon", "Panjim Latin Quarter", "Basilica of Bom Jesus"],
    category: "Beach",
    rating: 4.8,
    longDesc: "Experience the ultimate coastal journey. This curated itinerary sweeps through old Latin alleys and secret white-sand coverlets. From high-altitude sunset cliffs to calm backwaters, discover both the quiet soul and the electric pulse of Goa. Witness the finest sundown points on clifftops and enjoy authentic Goan curries with new friends.",
    highlights: ["Scenic Sunset at Vagator", "Cabo de Rama Cliff Sunset", "Cola Beach Sweetwater Lagoon", "Panjim Latin Quarter Walk"],
    itinerary: [
      { day: "Day 1", title: "Arrival, Fort Aguada & Vagator Sunset", description: "Meet your crew and check in to our boutique stay. Discover the massive ramparts of Fort Aguada. Later, gather at the iconic Vagator Beach cliffside sunset viewpoint, overlooking the Arabian Sea as the sky turns deep crimson.", icons: ["map-pin", "sunset"] },
      { day: "Day 2", title: "Baga & Candolim Water Adventures", description: "High-adrenaline water sports at Candolim Beach. Explore the historic Chapora Fort (famous Dil Chahta Hai spot). Spend the evening at Tito's Lane or Anjuna's bustling seaside shacks.", icons: ["waves", "music"] },
      { day: "Day 3", title: "South Goa: Secret Lagoons & Cabo de Rama Sunset", description: "Journey into serene South Goa. Explore the magical Cola Beach sweet-water lagoon flanked by coconut palms. Relax on the golden crescent of Palolem Beach. End your day at Cabo de Rama Fort clifftop, capturing Goa's most legendary sunset.", icons: ["compass", "sun"] },
      { day: "Day 4", title: "Latin Quarter Heritage & Old Goa Church Walk", description: "Walk through the pastel-painted lanes of Panjim Latin Quarter (Fontainhas). Pay homage at the Basilica of Bom Jesus. Head to departure points with a heart full of coastal memories.", icons: ["camera", "bus"] }
    ],
    inclusions: ["3 Nights Boutique Stay", "All Breakfasts & 2 Special Dinners", "Internal Transfers (AC Tempo Traveller)", "Trip Captain"],
    exclusions: ["Flights / Trains to Goa", "Lunches", "Personal Expenses", "Water Sports Fees"],
    faqs: [
      { id: "g1", question: "Is this trip suitable for solo travelers?", answer: "Absolutely! Over 60% of our travelers join solo. It's the best way to meet new friends." }
    ],
    pickupPoints: ["Goa Airport (Dabolim)", "Madgaon Railway Station", "Panjim Bus Stand"],
    packingList: ["Comfortable beachwear", "Sunscreen & Sunglasses", "One party outfit", "Flip-flops and walking shoes", "Reusable water bottle"],
    cancellationPolicy: "Cancel 15 days before the trip for a 100% refund. 50% refund if cancelled 7-14 days before. No refund within 7 days of departure."
  },
  {
    id: "gokarna",
    name: "Gokarna",
    subTitle: "Pristine Beaches & Cliff Trek",
    desc: "A mesmerizing and soulful coastal getaway of golden sands, scenic cliff walks connecting five untouched beaches, and tranquil nights under starfields.",
    image: gokarnaImg,
    season: "Oct – Mar",
    duration: "3 Days / 2 Nights",
    price: 7999,
    originalPrice: 9999,
    attractions: ["Om Beach", "Kudle Beach Sunset", "Yana Caves", "Mirjan Fort"],
    category: "Adventure",
    rating: 4.9,
    longDesc: "Escape the commercial rush to the sacred shores of Gokarna. Our customized itinerary connects clifftops, serene lagoons, and rich history. Walk the famous five-beach trek along ocean-facing cliffs, relax at boutique beach hostels, and swim in calm ocean waters. Finish by exploring the majestic black karst monoliths of Yana and the emerald-covered walls of Mirjan Fort.",
    highlights: ["Om Beach clifftop sunset", "Five-Beach Cliffside Trek", "Mystical Karst Rock Yana Caves", "Moss-covered ruins of Mirjan Fort"],
    itinerary: [
      { day: "Day 1", title: "Arrival, Kudle Beach & Clifftop Sunset", description: "Check in to beachside stays at Kudle. Settle in and walk over to Om Beach (shaped naturally like the sacred OM symbol). Watch a quiet, breathtaking sunset from a secret clifftop viewpoint.", icons: ["map-pin", "sunset"] },
      { day: "Day 2", title: "Five-Beach Trek & Bioluminescence Hunt", description: "Embark on our signature beach-to-beach cliff trek: Kudle Beach to Om, Half Moon, Paradise, and Hell's Half Acre. Enjoy beach activities and search for magical glowing bioluminescence waves after dark.", icons: ["compass", "sun"] },
      { day: "Day 3", title: "Yana Caves & Mirjan Fort Exploration", description: "Trek through lush Western Ghats forests to the high-rising volcanic karst rock monoliths of Yana. Next, explore and photograph the stunning green-tinted ruins of Mirjan Fort. Depart with unforgettable memories.", icons: ["camera", "bus"] }
    ],
    inclusions: ["2 Nights Beachside Resort/Boutique Stay", "Daily Breakfasts", "Local AC Transport & Sightseeing", "Experienced Trek Lead & Captain", "Five-Beach Guided Trekking Permits"],
    exclusions: ["Flights/Trains to Hubli or Gokarna", "Lunches & Dinners", "Water sport activities", "Personal Expenses"],
    faqs: [
      { id: "gk1", question: "How difficult is the Five-Beach Trek?", answer: "It is an easy-to-moderate trek covering rocky paths and sandy shores. Basic fitness is absolutely fine!" }
    ],
    pickupPoints: ["Gokarna Road Railway Station", "Hubli Airport", "Gokarna Main Bus Stand"],
    packingList: ["Light breathable trekking clothes", "Trekking/sturdy sports shoes", "Quick-dry towel", "Waterproof pouch for phones", "Hat & eco-friendly sun protection"],
    cancellationPolicy: "Cancel 15 days before the trip for a 100% refund. 50% refund if cancelled 7-14 days before. No refund within 7 days of departure."
  }
];

export const TRIPS: Trip[] = [
  {
    id: "trip-goa-1",
    destinationId: "goa",
    destinationName: "Goa Beach & Party Escape",
    dates: "12 – 15 July 2025",
    price: 8999,
    originalPrice: 10999,
    seatsTotal: 15,
    seatsAvailable: 4,
    description: "An intimate Monsoon escape covering old Goa's historic forts, secret South Goa beaches, and rain-washed coastal views.",
    status: "Selling Fast"
  },
  {
    id: "trip-gokarna-1",
    destinationId: "gokarna",
    destinationName: "Gokarna Beach Trek Combo",
    dates: "19 – 21 July 2025",
    price: 7999,
    originalPrice: 9999,
    seatsTotal: 15,
    seatsAvailable: 8,
    description: "Trek pristine beaches, explore the mystical monoliths of Yana Caves, and capture the green ruins of Mirjan Fort.",
    status: "Almost Full"
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
