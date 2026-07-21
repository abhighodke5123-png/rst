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
  },
  {
    id: "kerala",
    name: "Kerala",
    subTitle: "Backwaters & Hills",
    desc: "A mesmerizing journey through misty tea gardens, wildlife sanctuaries, and serene backwaters of 'God’s Own Country'.",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1400&q=80",
    season: "Sep – Mar",
    duration: "5 Days / 4 Nights",
    price: 14999,
    attractions: ["Munnar Tea Gardens", "Periyar Safari", "Alleppey Houseboat"],
    category: "Adventure",
    rating: 4.9,
    longDesc: "From the colonial charm of Fort Kochi to the emerald slopes of Munnar and the tranquil waterways of Alleppey, this trip showcases the diverse beauty of Kerala. Enjoy spice plantations, wildlife, and a unique overnight houseboat stay.",
    highlights: ["Fort Kochi Heritage Walk", "Eravikulam National Park", "Periyar Wildlife Safari", "Alleppey Houseboat Stay"],
    itinerary: [
      { day: "Day 1", title: "Kochi Heritage", description: "Fort Kochi walk, Chinese fishing nets, and Mattancherry Palace.", icons: ["map-pin", "camera"] },
      { day: "Day 2", title: "Munnar Hills", description: "Munnar tea gardens, Eravikulam National Park, and Mattupetty Dam.", icons: ["mountain", "sun"] },
      { day: "Day 3", title: "Wildlife & Culture", description: "Munnar to Thekkady. Visit spice plantations, Periyar wildlife safari, and enjoy a Kathakali show.", icons: ["compass", "ticket"] },
      { day: "Day 4", title: "Backwater Bliss", description: "Alleppey – overnight houseboat stay on the serene backwaters.", icons: ["anchor", "moon"] },
      { day: "Day 5", title: "Return", description: "Morning on the backwaters, return via Kochi for departure.", icons: ["bus", "home"] }
    ]
  },
  {
    id: "gokarna",
    name: "Gokarna",
    subTitle: "Beach Trek Combo",
    desc: "A rugged coastal trail crossing clifftops and quiet bays, merging serene sacred traditions with bohemian beachside living.",
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80",
    season: "Oct – Feb",
    duration: "3 Days / 2 Nights",
    price: 7499,
    attractions: ["Om Beach trek", "Half Moon Beach", "Yana Caves"],
    category: "Adventure",
    rating: 4.9,
    longDesc: "For those who find Goa too crowded, Gokarna offers a mystical refuge. Trek across five beautiful beaches, sleep under the canopy of starfields, and wake up to the sound of breaking waves.",
    highlights: ["Om & Kudle Beach Sunsets", "Beach Trek to Paradise Beach", "Gokarna Temple Visit", "Yana Caves Exploration"],
    itinerary: [
      { day: "Day 1", title: "Arrival & Sunset", description: "Explore Om Beach and Kudle Beach, ending with a stunning sunset point.", icons: ["map-pin", "sunset"] },
      { day: "Day 2", title: "Beach Trek", description: "Beach trek to Half Moon & Paradise Beach via the scenic cliff trail. Evening Gokarna temple visit.", icons: ["compass", "moon"] },
      { day: "Day 3", title: "Yana Caves & Departure", description: "Half-day trip to the mystical Yana Caves or a leisure beach morning, followed by departure.", icons: ["camera", "bus"] }
    ]
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    subTitle: "Heritage & Food",
    desc: "Dive into the city of Nizams, experiencing majestic palaces, ancient forts, and world-famous culinary delights.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=80",
    season: "Oct – Mar",
    duration: "3 Days / 2 Nights",
    price: 8499,
    attractions: ["Charminar", "Golconda Fort", "Ramoji Film City"],
    category: "Cultural",
    rating: 4.7,
    longDesc: "Experience the royal grandeur of Hyderabad. Walk through bustling bazaars, marvel at the architecture of Chowmahalla Palace, and indulge in the legendary local biryani trail.",
    highlights: ["Charminar & Laad Bazaar", "Golconda Sound & Light Show", "Local Biryani Trail", "Hussain Sagar Boat Ride"],
    itinerary: [
      { day: "Day 1", title: "Nizami Heritage", description: "Charminar, Laad Bazaar, Mecca Masjid, and Chowmahalla Palace.", icons: ["map-pin", "camera"] },
      { day: "Day 2", title: "Forts & Films", description: "Golconda Fort (sound & light show), Qutb Shahi Tombs, with an option for a Ramoji Film City full-day tour.", icons: ["ticket", "moon"] },
      { day: "Day 3", title: "Lakes & Biryani", description: "Hussain Sagar (Buddha statue boat ride), Birla Mandir, and the ultimate local biryani trail before departure.", icons: ["compass", "bus"] }
    ]
  },
  {
    id: "pune-forts",
    name: "Pune Forts Circuit",
    subTitle: "Flexible 1-Day Treks",
    desc: "Conquer the historic hill forts of the Maratha Empire with our flexible 1-day or weekend camping treks.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=80",
    season: "Jun – Feb",
    duration: "1 - 2 Days",
    price: 1999,
    attractions: ["Sinhagad Fort", "Rajgad Fort", "Torna Fort"],
    category: "Mountain",
    rating: 4.8,
    longDesc: "Ideal for beginners and seasoned trekkers alike. Bundle Sinhagad for a sunrise trek, tackle the moderate Lohagad-Visapur twin forts, or camp overnight at Shivaji's former capital, Rajgad.",
    highlights: ["Sinhagad Sunrise Trek", "Rajgad Overnight Camping", "Lohagad-Visapur Monsoon Waterfalls", "Torna Steep Climb"],
    itinerary: [
      { day: "Trek 1", title: "Sinhagad Fort", description: "Easy, popular, and great for beginners. Perfect for a quick sunrise trek.", icons: ["sun", "mountain"] },
      { day: "Trek 2", title: "Rajgad Fort", description: "Shivaji's former capital. Moderate-hard trek, excellent for monsoon trekking with an overnight camping option.", icons: ["moon", "mountain"] },
      { day: "Trek 3", title: "Torna Fort", description: "The toughest of the three. A steep climb recommended for experienced trekkers.", icons: ["compass", "mountain"] },
      { day: "Trek 4", title: "Lohagad-Visapur", description: "Twin forts with monsoon waterfalls en route. A moderate trek great for weekends.", icons: ["waves", "mountain"] },
      { day: "Trek 5", title: "Purandar Fort", description: "Moderate trek with immense historic significance and breathtaking views.", icons: ["camera", "mountain"] }
    ]
  }
];

export const TRIPS: Trip[] = [
  {
    id: "trip-goa-1",
    destinationId: "goa",
    destinationName: "Goa Beach & Party",
    dates: "12 – 15 July 2025",
    price: 8999,
    seatsTotal: 15,
    seatsAvailable: 4,
    description: "An intimate Monsoon escape covering old Goa's historic forts and hidden rain-washed rainforest networks.",
    status: "Selling Fast"
  },
  {
    id: "trip-kerala-1",
    destinationId: "kerala",
    destinationName: "Kerala Backwaters & Hills",
    dates: "20 – 24 August 2025",
    price: 14999,
    seatsTotal: 12,
    seatsAvailable: 5,
    description: "Experience the magic of Munnar's tea gardens and an overnight stay in an Alleppey houseboat.",
    status: "Filling Fast"
  },
  {
    id: "trip-gokarna-1",
    destinationId: "gokarna",
    destinationName: "Gokarna Beach Trek Combo",
    dates: "26 – 28 July 2025",
    price: 7499,
    seatsTotal: 15,
    seatsAvailable: 3,
    description: "Conquer the famous cliff trail and watch beautiful sunsets over Om Beach and Kudle Beach.",
    status: "Almost Full"
  },
  {
    id: "trip-hyd-1",
    destinationId: "hyderabad",
    destinationName: "Hyderabad Heritage & Food",
    dates: "10 – 12 September 2025",
    price: 8499,
    seatsTotal: 20,
    seatsAvailable: 10,
    description: "Dive into the city of Nizams with majestic palaces and the ultimate biryani trail.",
    status: "Seats Open"
  },
  {
    id: "trip-pune-1",
    destinationId: "pune-forts",
    destinationName: "Pune Forts: Rajgad Camping",
    dates: "02 – 03 August 2025",
    price: 2499,
    seatsTotal: 25,
    seatsAvailable: 8,
    description: "Shivaji's former capital. Moderate-hard trek with an incredible overnight camping experience.",
    status: "Monsoon Special"
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
