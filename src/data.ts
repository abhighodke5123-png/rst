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
    id: "spiti",
    name: "Spiti Valley",
    subTitle: "High Mountain Desert & Ancient Monasteries",
    desc: "An overland high-altitude expedition across rugged Himalayan passes, fossil villages, high monasteries, and starlit Chandratal Lake.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
    season: "May – Oct",
    duration: "8 Days / 7 Nights",
    price: 22999,
    originalPrice: 26999,
    attractions: ["Key Monastery", "Chandratal Lake", "Hikkim Post Office", "Kunzum Pass"],
    category: "Mountain",
    rating: 4.9,
    longDesc: "Cross roaring glacial streams and ascend through the mighty Kunzum Pass into the cold desert wonderland of Spiti. Walk through ancient mud-walled monasteries perched on cliffs, send postcards from the world's highest post office at Hikkim, and camp under millions of stars along the moon-shaped crescent of Chandratal.",
    highlights: ["Highest Post Office at Hikkim (4,400m)", "Key Monastery Morning Chants", "Chandratal Lake High-Altitude Camping", "Fossil Hunting in Langza"],
    itinerary: [
      { day: "Day 1", title: "Shimla to Kalpa via Kinnaur Valley", description: "Depart Shimla and wind through apple orchards of Kinnaur along the Sutlej river gorge. Overnight stay in Kalpa with sunset views of Kinner Kailash.", icons: ["map-pin", "mountain"] },
      { day: "Day 2", title: "Kalpa to Tabo via Nako Lake", description: "Cross into the rain-shadow desert. Stop by mystical Nako lake and reach the 1,000-year-old Tabo Monastery, known as the Ajanta of the Himalayas.", icons: ["compass", "sun"] },
      { day: "Day 3", title: "Tabo, Dhankar Fort & Kaza Arrival", description: "Explore Dhankar monastery perched precariously on a cliff ridge overlooking the Spiti-Pin confluence. Arrive at Kaza, the expedition base.", icons: ["camera", "mountain"] },
      { day: "Day 4", title: "High Altitude Villages: Hikkim, Komic, Langza", description: "Visit Hikkim (world's highest post office), Komic (highest village with motorable road), and Langza (giant Buddha statue facing snow summits).", icons: ["compass", "map-pin"] },
      { day: "Day 5", title: "Key Monastery & Kibber Wildlife Sanctuary", description: "Visit the iconic 11th-century Key Gompa. Continue to Kibber and the Chicham suspension bridge, soaring 13,500 ft above a deep gorge.", icons: ["camera", "mountain"] },
      { day: "Day 6", title: "Kaza to Chandratal Lake via Kunzum La", description: "Ascend Kunzum Pass (4,590m) to offer prayers at Kunzum Mata temple. Hike down to the emerald shores of Chandratal for glamping under the Milky Way.", icons: ["sunset", "compass"] },
      { day: "Day 7", title: "Chandratal to Manali via Atal Tunnel", description: "Navigate the rugged Batal-Chhatru river crossings and descend into the lush Kullu valley through the Atal Tunnel.", icons: ["bus", "mountain"] },
      { day: "Day 8", title: "Manali Departure", description: "Morning leisure in Old Manali cafes before boarding departure transfers with lifetime Himalayan memories.", icons: ["check", "bus"] }
    ],
    inclusions: ["7 Nights Homestay & High-Altitude Glamping", "Daily Breakfast & Traditional Dinners", "Expedition Spec 4x4 / Force Urbania Transfers", "Certified Mountain Captain & Oxygen Cylinders", "Inner Line Permits & Environmental Fees"],
    exclusions: ["Travel to/from Shimla/Manali", "Personal Gear & Lunches", "Emergency Medical Evacuations", "Tips & Gratitude"],
    faqs: [
      { id: "sp1", question: "How should I prepare for Acute Mountain Sickness (AMS)?", answer: "Our itinerary is carefully staged with incremental altitude gains via Kinnaur for optimal acclimatization. We carry medical oxygen kits, oximeters, and stay well hydrated." }
    ],
    pickupPoints: ["Shimla Old Bus Stand", "Chandigarh Airport", "Kalka Railway Station"],
    packingList: ["Thermal base layers (2-3 pairs)", "Down jacket (-10°C rated)", "Sturdy waterproof hiking boots", "UV sunglasses & high-SPF sunscreen", "Personal hydration flask & electrolytes"],
    cancellationPolicy: "Cancel 21 days before departure for a 100% credit refund. 50% refund between 10-20 days. Non-refundable within 10 days due to advance high-altitude permits."
  },
  {
    id: "ladakh",
    name: "Ladakh & Nubra",
    subTitle: "High Altitude Passes & Starlit Sand Dunes",
    desc: "The ultimate trans-Himalayan caravan: conquer Khardung La, ride double-humped camels in Nubra, and witness Pangong Tso's shifting azure hues.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
    season: "May – Sep",
    duration: "9 Days / 8 Nights",
    price: 27499,
    originalPrice: 31999,
    attractions: ["Pangong Tso", "Khardung La Pass", "Nubra Valley Hunder Dunes", "Thiksey Monastery"],
    category: "Mountain",
    rating: 4.9,
    longDesc: "From dramatic barren cliffs to surreal white sand dunes of Nubra Valley, this is the benchmark overland road adventure of India. Cross the legendary Khardung La, wake up to sunrise chants at Thiksey Gompa, and watch Pangong Tso shift through seven shades of turquoise.",
    highlights: ["Khardung La Pass Summit (5,359m)", "Pangong Tso Lakeside Camps", "Bactrian Camel Safari in Hunder", "Magnetic Hill Phenomenon"],
    itinerary: [
      { day: "Day 1", title: "Leh Arrival & Mandatory Acclimatization", description: "Land at Kushok Bakula Rimpochee Airport (3,500m). Full day of gentle rest and hydration at our boutique Leh hotel.", icons: ["map-pin", "coffee"] },
      { day: "Day 2", title: "Sham Valley & Confluence Tour", description: "Visit Hall of Fame, Magnetic Hill, and the dramatic confluence of the Indus and Zanskar rivers at Nimmu.", icons: ["compass", "mountain"] },
      { day: "Day 3", title: "Leh to Nubra Valley via Khardung La", description: "Ascend the legendary Khardung La Pass (5,359m). Descend into Nubra Valley to explore the giant Maitreya Buddha at Diskit and sunset dunes at Hunder.", icons: ["mountain", "sunset"] },
      { day: "Day 4", title: "Turtuk Border Village Excursion", description: "Drive along the Shyok river to Turtuk, the northernmost village of India with rich Balti culture, apricot orchards, and views of K2 ranges.", icons: ["camera", "compass"] },
      { day: "Day 5", title: "Nubra Valley to Pangong Tso via Shyok", description: "Travel through rugged riverbed roads directly to the world's highest saltwater lake, Pangong Tso (4,350m). Night glamping by the lakeshore.", icons: ["waves", "moon"] },
      { day: "Day 6", title: "Pangong Tso to Hanle Dark Sky Reserve", description: "Overland journey to Hanle, home to the Indian Astronomical Observatory and India's first designated Dark Sky Reserve.", icons: ["star", "mountain"] },
      { day: "Day 7", title: "Hanle to Leh via Chang La", description: "Cross the formidable Chang La pass (5,360m) and visit Thiksey monastery on our return into Leh valley.", icons: ["mountain", "bus"] },
      { day: "Day 8", title: "Leh Heritage Alleys & Celebration Dinner", description: "Explore Old Leh heritage streets, Leh Palace, and Shanti Stupa. Evening group farewell dinner around a warm fire.", icons: ["users", "utensils"] },
      { day: "Day 9", title: "Departure from Leh", description: "Airport drop-offs with unforgettable Himalayan memories.", icons: ["check", "plane"] }
    ],
    inclusions: ["8 Nights Premium Stays & Lakeside Glamping", "Breakfast & Dinners throughout", "Dedicated 4x4 / Force Urbania Vehicles", "Inner Line Permits & Wildlife Fees", "Oxygen Backup & Medical Oximeter Kit"],
    exclusions: ["Airfare to/from Leh", "Lunches & Personal Shopping", "Camel Rides / ATV Rentals in Nubra"],
    faqs: [
      { id: "ld1", question: "Is inner-line permit paperwork handled by Raasta?", answer: "Yes, all inner-line permits for Nubra, Pangong, and Hanle are processed by our team ahead of your arrival." }
    ],
    pickupPoints: ["Leh Kushok Bakula Airport (IXL)"],
    packingList: ["Windproof & waterproof outer jacket", "Warm fleece & thermals", "UV sunglasses (Category 3 or 4)", "Moisturizer & lip balm with SPF", "Sturdy walking shoes"],
    cancellationPolicy: "Full credit refund 20 days prior. 50% between 10-19 days. Non-refundable under 10 days."
  },
  {
    id: "meghalaya",
    name: "Meghalaya Highlands",
    subTitle: "Living Root Bridges & Emerald Cascades",
    desc: "Venture deep into the abode of clouds: trek to double-decker living root bridges, kayak crystal-clear Umngot river, and explore subterranean limestone caves.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=80",
    season: "Sep – May",
    duration: "6 Days / 5 Nights",
    price: 18499,
    originalPrice: 21999,
    attractions: ["Double Decker Root Bridge", "Dawki River Kayaking", "Krang Shuri Falls", "Nohkalikai Falls"],
    category: "Adventure",
    rating: 4.9,
    longDesc: "Trek through misty rainforest stairways into lush valleys where Khasi indigenous tribes have engineered bridges out of living fig tree roots for centuries. Swim in natural azure plunge pools beneath roaring waterfalls, cliff-jump at Dawki, and explore sacred groves teeming with biodiversity.",
    highlights: ["Nongriat Double Decker Living Root Bridge", "Crystal Clear Dawki River Boat Ride", "Krang Shuri Emerald Pool Swim", "Mawlynnong Cleanest Village Walk"],
    itinerary: [
      { day: "Day 1", title: "Guwahati to Shillong via Umiam Lake", description: "Pickup from Guwahati airport. Scenic drive to the Scotland of the East. Stop by Umiam Lake and settle into our boutique Shillong stay.", icons: ["map-pin", "coffee"] },
      { day: "Day 2", title: "Shillong to Cherrapunjee (Sohra)", description: "Visit Elephant Falls and drive towards Sohra. Witness Nohkalikai Falls (India's tallest plunge) and explore Mawsmai Limestone Cave.", icons: ["mountain", "camera"] },
      { day: "Day 3", title: "Trek to Nongriat Double Decker Root Bridge", description: "Descend 3,000 steps into the rainforest valley to cross ancient living root bridges and take a refreshing dip at Rainbow Falls natural pool.", icons: ["compass", "waves"] },
      { day: "Day 4", title: "Sohra to Mawlynnong & Dawki", description: "Visit Asia's cleanest village, Mawlynnong. Continue to the transparent waters of Dawki (Umngot River) along the Indo-Bangladesh border.", icons: ["sun", "waves"] },
      { day: "Day 5", title: "Krang Shuri Falls & Jowai Hills", description: "Hike to the breathtaking turquoise lagoon of Krang Shuri Falls. Return to Shillong for music cafes in Police Bazar.", icons: ["waves", "music"] },
      { day: "Day 6", title: "Shillong to Guwahati Departure", description: "Morning breakfast and transfer to Guwahati airport for return flights.", icons: ["check", "bus"] }
    ],
    inclusions: ["5 Nights Heritage Stays & Eco Cottages", "Daily Breakfast & Traditional Khasi Dinners", "All Transfers in AC Tempo / SUV", "Local Trek Guides & Village Entry Fees", "Boating Gear & Lifejackets in Dawki"],
    exclusions: ["Airfare to Guwahati", "Lunches & Personal Shopping", "Adventure Activity Add-ons"],
    faqs: [
      { id: "mg1", question: "How demanding is the Nongriat trek?", answer: "It involves descending and ascending roughly 3,000 stone steps. Moderate fitness is recommended, with frequent breaks along the forest trail." }
    ],
    pickupPoints: ["Guwahati Lokpriya Gopinath Bordoloi Airport (GAU)", "Guwahati Railway Station"],
    packingList: ["Trekking shoes with solid wet-rock grip", "Quick-dry synthetic clothing", "Light rain jacket / poncho", "Waterproof dry bag for gadgets", "Leech socks (for monsoonal hikes)"],
    cancellationPolicy: "100% credit refund up to 15 days before trip. 50% refund 7-14 days before."
  },
  {
    id: "goa",
    name: "Goa Coastal Heritage",
    subTitle: "Beach, Heritage & Sunsets",
    desc: "A perfect blend of coastal culture, secret white-sand lagoons, Portuguese heritage, and jaw-dropping cliffside sunsets.",
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
    name: "Gokarna & Karwar",
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
  },
  {
    id: "jaisalmer",
    name: "Jaisalmer & Thar Desert",
    subTitle: "Caravan Dunes & Golden Fort",
    desc: "A golden desert overland experience with camel caravans, desert luxury camping under starlit skies, and folk music around glowing bonfires.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=80",
    season: "Oct – Mar",
    duration: "4 Days / 3 Nights",
    price: 11999,
    originalPrice: 14499,
    attractions: ["Sam Sand Dunes", "Sonar Qila (Jaisalmer Fort)", "Kuldhara Ghost Village", "Patwon Ki Haveli"],
    category: "Adventure",
    rating: 4.8,
    longDesc: "Journey into the golden heart of Rajasthan. Walk the living lanes of the Sonar Qila, explore the mysterious abandoned village of Kuldhara, and head deep into the Thar desert for sunset camel treks, 4x4 dune bashing, and night camping under an unpolluted canopy of stars.",
    highlights: ["Sunset Dune Bashing in Sam", "Stargazing Desert Luxury Camp", "Sonar Qila Heritage Walk", "Traditional Manganiyar Folk Music Night"],
    itinerary: [
      { day: "Day 1", title: "Jaisalmer Arrival & Haveli Walk", description: "Meet in Jaisalmer, check in to our heritage Haveli hotel. Sunset walk at Gadisar Lake with view of sandstone temples.", icons: ["map-pin", "sunset"] },
      { day: "Day 2", title: "Sonar Qila & Kuldhara Ghost Village", description: "Explore the golden fortress of Jaisalmer, Jain temples, and Patwon ki Haveli. Afternoon excursion to the cursed ghost village of Kuldhara.", icons: ["compass", "camera"] },
      { day: "Day 3", title: "Thar Desert Safari & Bonfire Night", description: "Drive into the Sam Sand Dunes. Experience thrilling 4x4 dune bashing and a sunset camel caravan. Night luxury camp with Rajasthani folk dance and dinner.", icons: ["sun", "music"] },
      { day: "Day 4", title: "Desert Sunrise & Departure", description: "Wake up to desert sunrise tea over the dunes. Transfer back to Jaisalmer station or airport with rich desert memories.", icons: ["coffee", "check"] }
    ],
    inclusions: ["2 Nights Boutique Haveli & 1 Night Luxury Desert Camp", "All Breakfasts & 2 Traditional Rajasthani Dinners", "AC Transfers & 4x4 Dune Bashing", "Trip Captain & Local Historian Guides"],
    exclusions: ["Trains/Flights to Jaisalmer", "Lunches & Personal Shopping", "Quad Biking Add-ons"],
    faqs: [
      { id: "js1", question: "Is the desert camp comfortable in winter?", answer: "Yes! Our luxury Swiss tents come with plush bedding, attached private washrooms, and heated blankets for chilly desert nights." }
    ],
    pickupPoints: ["Jaisalmer Railway Station", "Jodhpur Airport (Optional Group Transfer)"],
    packingList: ["Warm jacket for desert nights", "Light cotton clothes for day", "Sunglasses & scarf for dust protection", "Moisturizer & power bank"],
    cancellationPolicy: "Full credit refund 15 days prior. 50% between 7-14 days. Non-refundable within 7 days."
  }
];

export const TRIPS: Trip[] = [
  {
    id: "trip-spiti-1",
    destinationId: "spiti",
    destinationName: "Spiti High Desert Autumn Expedition",
    dates: "14 – 21 Nov 2026",
    price: 22999,
    originalPrice: 26999,
    seatsTotal: 14,
    seatsAvailable: 4,
    description: "Navigate high Himalayan passes, send postcards from Hikkim, and camp under the Milky Way at Chandratal.",
    status: "Selling Fast",
    captainName: "Tenzin Norbu"
  },
  {
    id: "trip-ladakh-1",
    destinationId: "ladakh",
    destinationName: "Ladakh & Nubra Valley Overland",
    dates: "05 – 13 Dec 2026",
    price: 27499,
    originalPrice: 31999,
    seatsTotal: 14,
    seatsAvailable: 3,
    description: "Conquer Khardung La, explore white sand dunes at Hunder, and experience Pangong Tso's azure waters.",
    status: "Almost Full",
    captainName: "Rigzin Dorje"
  },
  {
    id: "trip-meghalaya-1",
    destinationId: "meghalaya",
    destinationName: "Meghalaya Living Roots & Cascades",
    dates: "18 – 24 Dec 2026",
    price: 18499,
    originalPrice: 21999,
    seatsTotal: 14,
    seatsAvailable: 6,
    description: "Trek to the double-decker root bridges, kayak the transparent Dawki river, and swim in Krang Shuri falls.",
    status: "Seats Open",
    captainName: "Dapbiang Rymbai"
  },
  {
    id: "trip-goa-1",
    destinationId: "goa",
    destinationName: "Goa Coastal Heritage & Sunset Escape",
    dates: "12 – 15 Jan 2027",
    price: 8999,
    originalPrice: 10999,
    seatsTotal: 15,
    seatsAvailable: 5,
    description: "Intimate coastal journey covering Fontainhas Latin quarters, secret South Goa beaches, and sunset clifftops.",
    status: "Selling Fast",
    captainName: "Derek D'Souza"
  },
  {
    id: "trip-gokarna-1",
    destinationId: "gokarna",
    destinationName: "Gokarna Five-Beach Cliff Trek",
    dates: "22 – 25 Jan 2027",
    price: 7999,
    originalPrice: 9999,
    seatsTotal: 15,
    seatsAvailable: 7,
    description: "Trek pristine ocean cliffs across five beaches, explore monolithic Yana Caves, and witness Mirjan Fort.",
    status: "Seats Open",
    captainName: "Aditya Hegde"
  },
  {
    id: "trip-jaisalmer-1",
    destinationId: "jaisalmer",
    destinationName: "Thar Desert Starlit Caravan",
    dates: "06 – 10 Feb 2027",
    price: 11999,
    originalPrice: 14499,
    seatsTotal: 14,
    seatsAvailable: 4,
    description: "4x4 dune bashing in Sam, sunset camel rides, and folk music bonfires under the vast desert sky.",
    status: "Selling Fast",
    captainName: "Manvendra Singh"
  }
];

export const PACKAGES: PackageTier[] = [
  {
    id: "explorer",
    name: "Explorer Caravan",
    desc: "Intimate weekend trails & coastal road loops",
    basePrice: 7999,
    features: [
      "Curated boutique stays & heritage homestays",
      "Dedicated AC Force Urbania / Traveler van",
      "Signature trail routes & curated viewpoints",
      "Certified RAASTA Trip Captain guidance",
      "All breakfasts & local welcome dinner",
      "Safety gear & route permits included"
    ]
  },
  {
    id: "adventure",
    name: "Overland Expedition",
    desc: "Multi-day high-altitude & desert journeys across India",
    basePrice: 18499,
    isMostLoved: true,
    features: [
      "Handpicked boutique resorts, glamping & heritage villas",
      "Expedition-spec 4x4s with seasoned mountain drivers",
      "All major culinary meals (authentic local cuisines)",
      "Certified local naturalists & high-altitude captains",
      "Full high-altitude oxygen backup & emergency protocols",
      "Included professional photographer & 4K highlight reels",
      "All inner-line, forest & sanctuary entry permits"
    ]
  },
  {
    id: "premium-expedition",
    name: "Private Bespoke Charter",
    desc: "Hyper-tailored private expeditions for families & microgroups",
    basePrice: 28999,
    features: [
      "Exclusive luxury glamping, heritage forts & estate homestays",
      "Private dedicated premium 4x4 cruiser (Thar / Fortuner / Isuzu)",
      "24/7 dedicated personal route concierge & trip manager",
      "Fully customized daily pace and unmapped off-road detours",
      "All adventure gear, kayak rentals & trek permits included",
      "Full cinema drone kit & private edited journey film"
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Aditya Roy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    destination: "Spiti Autumn Caravan",
    content: "The high-altitude overlanding with RAASTA was absolute bliss. Navigating Kunzum Pass and camping at Chandratal felt completely seamless under the expert guidance of their captains.",
    date: "October 2026"
  },
  {
    id: "rev-2",
    author: "Sneha Kapoor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    destination: "Gokarna Cliff Trail",
    content: "Waking up to the sound of waves at our secluded cliffside stay was unforgettable. Small group, zero touristy rush, and genuine conversations around the campfire.",
    date: "September 2026"
  },
  {
    id: "rev-3",
    author: "Kabir Mehta",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    destination: "Offbeat Goa Heritage",
    content: "RAASTA completely redefined Goa for me. We skipped commercial tourist traps and discovered secret South Goa lagoons and Fontainhas history. Absolute perfection!",
    date: "August 2026"
  },
  {
    id: "rev-4",
    author: "Ananya Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    destination: "Meghalaya Living Bridges",
    content: "The trek to Nongriat and swimming in Krang Shuri falls was otherworldly. As a solo female traveler, I felt completely safe, respected, and welcomed by the whole crew.",
    date: "October 2026"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-3",
    url: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80",
    title: "Om Beach Bonfire Night",
    destination: "Gokarna",
    category: "Beaches",
    date: "Sep 2026",
    likes: 312,
    photographer: "Siddharth S."
  },
  {
    id: "gal-2",
    url: "https://images.unsplash.com/photo-1614082242765-7c98db0f3df3?auto=format&fit=crop&w=1400&q=80",
    title: "Vespa Diaries in Fontainhas",
    destination: "Goa",
    category: "People",
    date: "Oct 2026",
    likes: 245,
    photographer: "Varun K."
  },
  {
    id: "gal-1",
    url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1400&q=80",
    title: "Kunzum Summit Sunrise",
    destination: "Spiti Valley",
    category: "Mountains",
    date: "Oct 2026",
    likes: 489,
    photographer: "Meenal G."
  },
  {
    id: "gal-4",
    url: "https://images.unsplash.com/photo-1504712548863-1f758290f57d?auto=format&fit=crop&w=1400&q=80",
    title: "Chasing Himalayan Clouds",
    destination: "Spiti Valley",
    category: "Roads",
    date: "Sep 2026",
    likes: 428,
    photographer: "Joydeep R."
  },
  {
    id: "gal-5",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    title: "Unmapped Karwar Cliff Trails",
    destination: "Gokarna",
    category: "Roads",
    date: "Aug 2026",
    likes: 198,
    photographer: "Siddharth S."
  },
  {
    id: "gal-6",
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80",
    title: "Overland Community on the Road",
    destination: "Goa",
    category: "People",
    date: "Oct 2026",
    likes: 374,
    photographer: "Pranav M."
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do RAASTA road trips work?",
    answer: "RAASTA is not a standard bus tour or sightseeing agency. We design intimate group overland expeditions. Each caravan has a strict microgroup cap of 12 to 15 travelers led by a certified RAASTA Trip Captain and veteran local drivers. We travel in high-quality vehicles, stop at unmapped local spots, stay in boutique heritage homestays, and bond over campfires and acoustic jams."
  },
  {
    id: "faq-2",
    question: "Do I have to drive my own vehicle?",
    answer: "No! All packages include full overland transport in comfortable high-clearance SUVs or force travelers with professional mountain drivers. If you want to bring your own 4x4 SUV and join as a self-drive caravan, we offer dedicated convoy lead slots with mechanical assistance."
  },
  {
    id: "faq-3",
    question: "Are these trips safe for solo female travelers?",
    answer: "Over 65% of our explorers join solo, a large majority of whom are women. Rigorous safety audits, certified route captains, vetted accommodations, and zero-tolerance harassment policies make RAASTA one of India's most trusted travel communities for solo adventurers."
  },
  {
    id: "faq-4",
    question: "What is your refund & cancellation policy?",
    answer: "If you cancel 15 days or more prior to departure, you receive a 100% refund as RAASTA travel credits that never expire. If you cancel within 7 to 14 days, a 50% refund is issued. Within 7 days, cancellations can be transferred to any friend or family member at zero re-booking fee."
  },
  {
    id: "faq-5",
    question: "How are high-altitude medical emergencies handled?",
    answer: "All our Himalayan expeditions carry portable medical oxygen cylinders, pulse oximeters, specialized mountain first-aid kits, and 24/7 satellite ops connectivity with nearby base hospitals. Captains are trained in Wilderness First Aid."
  }
];
