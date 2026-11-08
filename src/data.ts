/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Destination, Trip, PackageTier, Review, GalleryItem, FAQItem, TeamMember } from "./types";
import goaImg from "./assets/images/regenerated_image_1784640113613.jpg";
import gokarnaImg from "./assets/images/regenerated_image_1784640115451.jpg";

export const DESTINATIONS: Destination[] = [
  {
    id: "spiti",
    name: "Spiti Valley",
    subTitle: "Cold Desert Caravans & Ancient Monasteries",
    desc: "An overland expedition through ancient mud monasteries, fossil villages, high mountain passes, and starlit Chandratal Lake.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
    season: "May – Oct",
    duration: "8 Days / 7 Nights",
    price: 22999,
    originalPrice: 26999,
    attractions: ["Key Monastery", "Chandratal Lake", "Hikkim Post Office", "Kunzum Pass"],
    category: "Mountain",
    collectionDefault: "select",
    rating: 4.9,
    longDesc: "Ascend through the mighty Kunzum Pass into the high-altitude trans-Himalayan wonderland of Spiti. Walk through ancient mud-walled monasteries perched on razor cliffs, send postcards from the world's highest post office at Hikkim, and camp under millions of stars on the banks of Chandratal.",
    highlights: ["Postcard dispatch from Hikkim (4,400m)", "Key Monastery morning prayer rituals", "Chandratal Lake campsite under the Milky Way", "Fossil searching in Langza village"],
    itinerary: [
      { day: "Day 1", title: "Shimla to Kalpa via Kinnaur Valley", description: "Ascend from Shimla along the dramatic Sutlej River gorge. Check in at Kalpa with sunset views over the sacred Kinner Kailash peak.", icons: ["map-pin", "mountain"] },
      { day: "Day 2", title: "Kalpa to Tabo via Nako Lake", description: "Cross into the arid rain-shadow zone. Explore mystical Nako lake and the 1,000-year-old Tabo Monastery, renowned as the Ajanta of the Himalayas.", icons: ["compass", "sun"] },
      { day: "Day 3", title: "Tabo to Dhankar & Kaza", description: "Explore the dramatic cliff-top Dhankar Fort and monastery overlooking the Pin-Spiti confluence before arriving in Kaza base.", icons: ["camera", "mountain"] },
      { day: "Day 4", title: "High Altitude Villages: Hikkim, Komic, Langza", description: "Send postcards from Hikkim, stand by the giant Buddha statue at Langza, and visit Komic, one of the world's highest motorable villages.", icons: ["compass", "map-pin"] },
      { day: "Day 5", title: "Key Monastery & Chicham Suspension Bridge", description: "Visit the iconic 11th-century Key Gompa. Cross the breathtaking Chicham Bridge soaring 13,500 ft above a vertiginous gorge.", icons: ["camera", "mountain"] },
      { day: "Day 6", title: "Kaza to Chandratal via Kunzum Pass", description: "Cross Kunzum Pass (4,590m). Short hike to the turquoise waters of Chandratal (Moon Lake) for lakeside glamping.", icons: ["sunset", "compass"] },
      { day: "Day 7", title: "Chandratal to Manali via Atal Tunnel", description: "Drive through the rugged Batal and Rohtang valley, transitioning through the Atal Tunnel into lush Manali pine forests.", icons: ["bus", "mountain"] },
      { day: "Day 8", title: "Manali Departure", description: "Slow morning in Old Manali cafes before boarding onward journey transfers.", icons: ["check", "bus"] }
    ],
    inclusions: ["7 Nights Homestay & High-Altitude Glamping", "Breakfast and Traditional Dinners", "Force Urbania / 4x4 Expedition Vehicle", "Certified Mountain Lead & Oxygen Setup", "Inner Line Permits & Sanctuary Tolls"],
    exclusions: ["Transit to/from Shimla/Manali", "Lunches & Personal Shopping", "Emergency Evacuations", "Gratuities"],
    faqs: [
      { id: "sp1", question: "How does the itinerary handle acclimatization?", answer: "We climb gradually through Kinnaur over two days rather than rushing via Manali. Our vehicles carry portable medical oxygen and pulse oximeters." }
    ],
    pickupPoints: ["Shimla Old Bus Stand", "Chandigarh Airport", "Kalka Railway Station"],
    packingList: ["Thermal innerwear (2-3 sets)", "Down jacket (-10°C rated)", "Waterproof hiking shoes", "UV Category 3 sunglasses", "Electrolytes & personal flask"],
    cancellationPolicy: "100% credit refund up to 21 days before departure. 50% between 10-20 days. Non-refundable under 10 days due to advance permits."
  },
  {
    id: "gokarna",
    name: "Gokarna & Karwar",
    subTitle: "Cliffside Trails, Secluded Bays & Caves",
    desc: "A soulful coastal trek across golden cliffs, five untouched beaches, monolithic Yana caves, and bioluminescent surf.",
    image: gokarnaImg,
    season: "Oct – Mar",
    duration: "3 Days / 2 Nights",
    price: 7999,
    originalPrice: 9999,
    attractions: ["Om Beach", "Kudle Beach Sunset", "Yana Caves", "Mirjan Fort"],
    category: "Beach",
    collectionDefault: "explore",
    rating: 4.9,
    longDesc: "Escape commercial beaches for the sacred cliffside coastline of Gokarna. Walk the legendary five-beach trail from Kudle to Paradise, swim in secluded lagoons, and hike through the Western Ghats to the ancient black karst monoliths of Yana.",
    highlights: ["Sunset cliff walk above Om Beach", "Five-Beach coastal trek connecting remote bays", "Yana karst rock monolith forest hike", "Moss-covered ruins of Mirjan Fort"],
    itinerary: [
      { day: "Day 1", title: "Arrival, Kudle Beach & Clifftop Sunset", description: "Check in to coastal eco-stays at Kudle. Walk along Om Beach and watch a crimson sunset from a secluded clifftop vantage.", icons: ["map-pin", "sunset"] },
      { day: "Day 2", title: "Five-Beach Trek & Campfire Jam", description: "Signature guided trail: Kudle to Om, Half Moon, and Paradise Beach. Evening acoustic session and stargazing by the shoreline.", icons: ["compass", "sun"] },
      { day: "Day 3", title: "Yana Caves & Mirjan Fort", description: "Trek into lush Western Ghats forests to explore towering volcanic karst monoliths. Visit Mirjan Fort before departure transfers.", icons: ["camera", "bus"] }
    ],
    inclusions: ["2 Nights Boutique Beach Stays", "Daily Breakfasts", "Local AC Transport & Transfers", "Experienced Trek Lead & Captain", "Trek Permits & Safety Support"],
    exclusions: ["Train/Flight to Hubli or Gokarna", "Lunches & Dinners", "Water Sports", "Personal Expenses"],
    faqs: [
      { id: "gk1", question: "Is this trek suitable for beginners?", answer: "Yes! The five-beach cliff trail is an easy-to-moderate coastal walk suitable for all fitness levels." }
    ],
    pickupPoints: ["Gokarna Road Railway Station", "Hubli Airport", "Gokarna Main Bus Stand"],
    packingList: ["Breathable cotton / linen clothes", "Sturdy walking / trail shoes", "Eco-friendly sunscreen & hat", "Quick-dry microfibre towel", "Waterproof pouch for gadgets"],
    cancellationPolicy: "100% refund as travel credits up to 15 days before departure. 50% between 7-14 days. Transferable to friends at zero fee."
  },
  {
    id: "meghalaya",
    name: "Meghalaya Highlands",
    subTitle: "Living Root Bridges & Emerald Cascades",
    desc: "Trek into lush rainforest valleys, cross indigenous living root bridges, and kayak the crystal clear waters of Dawki.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=80",
    season: "Sep – May",
    duration: "6 Days / 5 Nights",
    price: 18499,
    originalPrice: 21999,
    attractions: ["Double Decker Root Bridge", "Dawki River Kayaking", "Krang Shuri Falls", "Nohkalikai Falls"],
    category: "Adventure",
    collectionDefault: "select",
    rating: 4.9,
    longDesc: "Descend ancient stone stairways through misty rainforests where the Khasi people guide fig tree roots across roaring streams. Swim in natural turquoise plunge pools beneath Krang Shuri, kayak the glass-clear Umngot River, and explore subterranean limestone caves.",
    highlights: ["Nongriat Double Decker Living Root Bridge trek", "Crystal clear boat ride on Umngot River in Dawki", "Swimming in turquoise waters of Krang Shuri", "Nohkalikai Falls panoramic overlook"],
    itinerary: [
      { day: "Day 1", title: "Guwahati to Shillong via Umiam Lake", description: "Meet in Guwahati and drive up to Shillong with a scenic pause at Umiam Lake. Evening cafe culture in Police Bazar.", icons: ["map-pin", "coffee"] },
      { day: "Day 2", title: "Shillong to Cherrapunjee (Sohra)", description: "Visit Elephant Falls and drive towards Sohra. Overlook Nohkalikai Falls and explore Mawsmai limestone caves.", icons: ["mountain", "camera"] },
      { day: "Day 3", title: "Trek to Nongriat Living Root Bridge", description: "Hike down the 3,000 stone steps into the deep rainforest valley to cross ancient living root bridges and dip in Rainbow Falls.", icons: ["compass", "waves"] },
      { day: "Day 4", title: "Sohra to Mawlynnong & Dawki", description: "Visit Mawlynnong, celebrated for community cleanliness, and camp along the transparent waters of Dawki on the border.", icons: ["sun", "waves"] },
      { day: "Day 5", title: "Krang Shuri Cascades & Jowai", description: "Hike to the emerald pool of Krang Shuri Falls for a swim before returning to Shillong for celebration dinner.", icons: ["waves", "music"] },
      { day: "Day 6", title: "Shillong to Guwahati Departure", description: "Morning breakfast and transfer to Guwahati Airport with unforgettable Northeast memories.", icons: ["check", "bus"] }
    ],
    inclusions: ["5 Nights Heritage Stays & Eco Cottages", "Daily Breakfasts & 3 Dinners", "All Internal Transfers in AC Vehicle", "Local Khasi Guides & Entry Permits", "Boating Gear & Lifejackets"],
    exclusions: ["Airfare to Guwahati", "Lunches & Personal Shopping", "Adventure Add-ons"],
    faqs: [
      { id: "mg1", question: "How physically demanding is the root bridge trek?", answer: "It involves descending and climbing approximately 3,000 steps. Anyone with moderate fitness can complete it comfortably with pauses." }
    ],
    pickupPoints: ["Guwahati Airport (GAU)", "Guwahati Railway Station"],
    packingList: ["Trekking shoes with strong wet grip", "Lightweight rain poncho", "Quick-dry shorts and tees", "Dry bag for electronics", "Natural insect repellent"],
    cancellationPolicy: "100% credit refund up to 15 days before departure. 50% between 7-14 days."
  },
  {
    id: "goa",
    name: "Goa Coastal Heritage",
    subTitle: "Old Quarters, Secret Coves & Clifftop Sunsets",
    desc: "An authentic coastal road experience: pastel Latin alleys of Fontainhas, secluded South Goa lagoons, and uncrowded cliffside sunsets.",
    image: goaImg,
    season: "Oct – Mar",
    duration: "4 Days / 3 Nights",
    price: 8999,
    originalPrice: 10999,
    attractions: ["Cabo de Rama Fort", "Cola Beach Lagoon", "Panjim Latin Quarter", "Basilica of Bom Jesus"],
    category: "Beach",
    collectionDefault: "explore",
    rating: 4.8,
    longDesc: "Experience Goa beyond the commercial noise. Wander through pastel-painted Portuguese lanes in Fontainhas, kayak quiet backwater mangroves, discover freshwater lagoons surrounded by coconut palms at Cola Beach, and watch golden sunsets from Cabo de Rama cliffs.",
    highlights: ["Sunset from Cabo de Rama Fort ruins", "Kayaking through secret Cola Beach lagoon", "Walking architecture tour of Fontainhas", "Heritage spice plantation lunch"],
    itinerary: [
      { day: "Day 1", title: "Arrival, Vagator Clifftops & Welcome Dinner", description: "Check in to our boutique stay. Head to Vagator's quiet cliffline for sunset over the Arabian Sea, followed by Goan coastal dinner.", icons: ["map-pin", "sunset"] },
      { day: "Day 2", title: "Historic Chapora & Northern Beach Trails", description: "Visit the historic ramparts of Chapora Fort. Spend a relaxing afternoon in quiet coastal cafes with sunset jams.", icons: ["waves", "music"] },
      { day: "Day 3", title: "South Goa: Secret Lagoons & Cabo de Rama", description: "Journey into serene South Goa. Explore Cola Beach sweet-water lagoon and watch an unforgettable sunset from Cabo de Rama.", icons: ["compass", "sun"] },
      { day: "Day 4", title: "Fontainhas Heritage Walk & Departure", description: "Walk through the historic Latin Quarter of Panjim, photographing colorful tiled balconies and colonial heritage.", icons: ["camera", "bus"] }
    ],
    inclusions: ["3 Nights Boutique Stay", "Daily Breakfasts & 2 Dinners", "AC Internal Transfers", "Experienced RAASTA Captain", "Heritage Walks & Entry Fees"],
    exclusions: ["Transit to/from Goa", "Lunches", "Water Sports", "Personal Expenses"],
    faqs: [
      { id: "g1", question: "Is this suitable for solo travelers?", answer: "Over 65% of our travelers join solo! Our micro-groups are warm, welcoming, and perfect for making genuine friends." }
    ],
    pickupPoints: ["Goa Dabolim Airport (GOI)", "Madgaon Railway Station", "MOPA Airport (GOX)"],
    packingList: ["Comfortable beach and casual wear", "Walking shoes & sandals", "Sunscreen & sunglasses", "Swimwear", "Reusable water bottle"],
    cancellationPolicy: "100% refund as travel credits up to 15 days before departure. 50% between 7-14 days."
  },
  {
    id: "ladakh",
    name: "Ladakh & Nubra",
    subTitle: "Trans-Himalayan Passes & Starlit Sand Dunes",
    desc: "Cross Khardung La, explore the white sand dunes of Nubra Valley on double-humped camels, and camp beside Pangong Tso.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
    season: "May – Sep",
    duration: "9 Days / 8 Nights",
    price: 27499,
    originalPrice: 31999,
    attractions: ["Pangong Tso", "Khardung La Pass", "Nubra Valley Hunder Dunes", "Thiksey Monastery"],
    category: "Mountain",
    collectionDefault: "select",
    rating: 4.9,
    longDesc: "The benchmark overland adventure of the trans-Himalayas. Cross the legendary Khardung La Pass (5,359m), watch sunrise chants echo through Thiksey Monastery, ride Bactrian camels across high-altitude sand dunes, and gaze at the Milky Way from the shores of Pangong Tso.",
    highlights: ["Summiting Khardung La Pass (5,359m)", "Glamping beside azure Pangong Tso lake", "Double-humped camel safari in Hunder Dunes", "Thiksey Gompa sunrise prayer ceremony"],
    itinerary: [
      { day: "Day 1", title: "Leh Arrival & Rest Acclimatization", description: "Arrive at Leh Airport (3,500m). Full day of gentle rest and hydration at our boutique hotel.", icons: ["map-pin", "coffee"] },
      { day: "Day 2", title: "Sham Valley & Indus-Zanskar Confluence", description: "Gentle excursion to Magnetic Hill, Hall of Fame, and the dramatic Indus-Zanskar river confluence at Nimmu.", icons: ["compass", "mountain"] },
      { day: "Day 3", title: "Leh to Nubra Valley via Khardung La", description: "Cross Khardung La Pass (5,359m) into the Nubra Valley. Sunset dunes walk at Hunder.", icons: ["mountain", "sunset"] },
      { day: "Day 4", title: "Turtuk Balti Heritage Village", description: "Day trip along the Shyok River to Turtuk, exploring apricot orchards and Balti heritage houses.", icons: ["camera", "compass"] },
      { day: "Day 5", title: "Nubra Valley to Pangong Tso via Shyok", description: "Drive along the wild Shyok riverbed to Pangong Tso. Check in to premium lakeside camps.", icons: ["waves", "moon"] },
      { day: "Day 6", title: "Pangong Tso to Hanle Dark Sky Reserve", description: "Cross high plateaus to Hanle, home to the Indian Astronomical Observatory and pristine starlit night skies.", icons: ["star", "mountain"] },
      { day: "Day 7", title: "Hanle to Leh via Chang La", description: "Ascend Chang La pass (5,360m) and visit Hemis & Thiksey monasteries on the return to Leh.", icons: ["mountain", "bus"] },
      { day: "Day 8", title: "Leh Heritage Streets & Farewell Feast", description: "Explore Leh Palace and local market bazaars followed by a group dinner.", icons: ["users", "utensils"] },
      { day: "Day 9", title: "Leh Departure", description: "Airport transfers with lifetime Himalayan memories.", icons: ["check", "plane"] }
    ],
    inclusions: ["8 Nights Boutique Stays & Glamping", "Daily Breakfast & Dinners", "Expedition-spec 4x4 / Force Urbania", "All Inner Line Permits & Environment Fees", "Medical Oxygen & Altitude Safety Kit"],
    exclusions: ["Airfare to/from Leh", "Lunches & Personal Shopping", "Camel / ATV Rentals"],
    faqs: [
      { id: "ld1", question: "Are permits included in the package?", answer: "Yes, all inner line permits for Nubra, Pangong, and Hanle are processed by Raasta in advance." }
    ],
    pickupPoints: ["Leh Airport (IXL)"],
    packingList: ["Heavy down jacket & windbreaker", "Thermal base layers", "Category 3 or 4 UV sunglasses", "SPF 50+ sunscreen & lip balm", "Sturdy walking boots"],
    cancellationPolicy: "100% credit refund up to 20 days before departure. 50% between 10-19 days."
  },
  {
    id: "jaisalmer",
    name: "Jaisalmer & Thar Desert",
    subTitle: "Golden Forts, Sand Dunes & Campfire Caravans",
    desc: "An overland desert journey with sunset camel treks, 4x4 dune bashing, living fort alleys, and folk music nights under the stars.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=80",
    season: "Oct – Mar",
    duration: "4 Days / 3 Nights",
    price: 11999,
    originalPrice: 14499,
    attractions: ["Sam Sand Dunes", "Sonar Qila (Jaisalmer Fort)", "Kuldhara Ghost Village", "Patwon Ki Haveli"],
    category: "Adventure",
    collectionDefault: "explore",
    rating: 4.8,
    longDesc: "Journey into the golden heart of Rajasthan. Walk the living lanes of the Sonar Qila, explore the mysterious abandoned village of Kuldhara, and venture into the Thar desert for sunset camel treks, 4x4 dune bashing, and night camping under an unpolluted canopy of stars.",
    highlights: ["Sunset dune drive across Sam Sand Dunes", "Stargazing from boutique desert luxury tents", "Sonar Qila living fort heritage trail", "Traditional Manganiyar folk music night by the fire"],
    itinerary: [
      { day: "Day 1", title: "Jaisalmer Arrival & Gadisar Lake Sunset", description: "Check in to our boutique sandstone haveli. Sunset walk by Gadisar Lake admiring sculpted pavilions.", icons: ["map-pin", "sunset"] },
      { day: "Day 2", title: "Sonar Qila & Kuldhara Ghost Village", description: "Explore the golden fortress of Jaisalmer, Jain temples, and Patwon ki Haveli. Afternoon visit to the abandoned ghost village of Kuldhara.", icons: ["compass", "camera"] },
      { day: "Day 3", title: "Thar Desert Safari & Bonfire Night", description: "Head into the Sam Sand Dunes for 4x4 dune bashing and sunset camel ride. Night luxury glamping with traditional Rajasthani dinner and folk music.", icons: ["sun", "music"] },
      { day: "Day 4", title: "Desert Sunrise & Departure", description: "Early morning desert sunrise tea over the dunes. Departure transfers to Jaisalmer station or airport.", icons: ["coffee", "check"] }
    ],
    inclusions: ["2 Nights Boutique Haveli & 1 Night Luxury Desert Camp", "Daily Breakfasts & 2 Traditional Dinners", "AC Transfers & 4x4 Dune Drive", "Trip Captain & Local Historian Guides", "Desert Cultural Program & Bonfire"],
    exclusions: ["Transit to/from Jaisalmer", "Lunches & Personal Shopping", "Quad Biking Add-ons"],
    faqs: [
      { id: "js1", question: "What are the desert camps like?", answer: "Our luxury Swiss tents feature proper beds, private attached bathrooms, and warm bedding for desert nights." }
    ],
    pickupPoints: ["Jaisalmer Railway Station", "Jodhpur Airport (optional transfer)"],
    packingList: ["Warm jacket for desert nights", "Light cotton clothes for daytime", "Sunglasses & scarf for dust", "Moisturizer & power bank"],
    cancellationPolicy: "100% credit refund up to 15 days before departure. 50% between 7-14 days."
  }
];

export const TRIPS: Trip[] = [
  {
    id: "trip-spiti-1",
    destinationId: "spiti",
    destinationName: "Spiti High Desert Overland Caravan",
    collection: "select",
    dates: "14 – 21 Nov 2026",
    price: 22999,
    originalPrice: 26999,
    duration: "8 Days / 7 Nights",
    seatsTotal: 12,
    seatsAvailable: 4,
    description: "Navigate high Himalayan passes, send postcards from Hikkim, and camp under the Milky Way at Chandratal.",
    overview: "An intimate 8-day overland circuit across the trans-Himalayan rain shadow, featuring mud-walled monasteries, fossil hunting, and lakeside glamping.",
    heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
    status: "Selling Fast",
    captainName: "Tenzin Norbu",
    category: "Mountain",
    transportDetails: "Force Urbania with captain and high-clearance 4x4 for river crossings",
    accommodationDetails: "Curated heritage homestays with heating and boutique lakeside glamping at Chandratal",
    mealsDetails: "All breakfasts and authentic local dinners with warm tea service",
    inclusions: ["7 Nights Homestay & High-Altitude Glamping", "Breakfast and Traditional Dinners", "Force Urbania / 4x4 Expedition Vehicle", "Certified Mountain Lead & Oxygen Setup", "Inner Line Permits & Sanctuary Tolls"],
    exclusions: ["Transit to/from Shimla/Manali", "Lunches & Personal Shopping", "Emergency Evacuations", "Gratuities"],
    cancellationPolicy: "100% credit refund up to 21 days before departure. 50% between 10-20 days."
  },
  {
    id: "trip-gokarna-1",
    destinationId: "gokarna",
    destinationName: "Gokarna Five-Beach Cliff Trail",
    collection: "explore",
    dates: "20 – 23 Nov 2026",
    price: 7999,
    originalPrice: 9999,
    duration: "3 Days / 2 Nights",
    seatsTotal: 14,
    seatsAvailable: 6,
    description: "Trek pristine ocean cliffs across five beaches, explore monolithic Yana Caves, and witness Mirjan Fort.",
    overview: "A student-friendly and accessible coastal trail connecting Kudle, Om, Half Moon, and Paradise beaches with evening campfire jams.",
    heroImage: gokarnaImg,
    status: "Seats Open",
    captainName: "Aditya Hegde",
    category: "Beach",
    transportDetails: "AC Tempo Traveller for local sightseeing and station transfers",
    accommodationDetails: "Beachside boutique cottages with ocean breeze and garden areas",
    mealsDetails: "Daily hearty breakfasts and coastal welcome dinner",
    inclusions: ["2 Nights Boutique Beach Stays", "Daily Breakfasts", "Local AC Transport & Transfers", "Experienced Trek Lead & Captain", "Trek Permits & Safety Support"],
    exclusions: ["Train/Flight to Hubli or Gokarna", "Lunches & Dinners", "Water Sports", "Personal Expenses"],
    cancellationPolicy: "100% refund as travel credits up to 15 days before departure. 50% between 7-14 days."
  },
  {
    id: "trip-meghalaya-1",
    destinationId: "meghalaya",
    destinationName: "Meghalaya Living Bridges & Cascades",
    collection: "select",
    dates: "05 – 10 Dec 2026",
    price: 18499,
    originalPrice: 21999,
    duration: "6 Days / 5 Nights",
    seatsTotal: 12,
    seatsAvailable: 5,
    description: "Trek to the double-decker root bridges, kayak the transparent Dawki river, and swim in Krang Shuri falls.",
    overview: "A boutique 6-day expedition deep into Khasi rainforests, crystal rivers, and heritage mountain stays.",
    heroImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=80",
    status: "Selling Fast",
    captainName: "Dapbiang Rymbai",
    category: "Adventure",
    transportDetails: "Private AC SUV / Force Traveller throughout the circuit",
    accommodationDetails: "Eco-resorts overlooking cloud valleys and riverside cottages in Dawki",
    mealsDetails: "Daily breakfasts and traditional Khasi tribal dinners",
    inclusions: ["5 Nights Heritage Stays & Eco Cottages", "Daily Breakfasts & 3 Dinners", "All Internal Transfers in AC Vehicle", "Local Khasi Guides & Entry Permits", "Boating Gear & Lifejackets"],
    exclusions: ["Airfare to Guwahati", "Lunches & Personal Shopping", "Adventure Add-ons"],
    cancellationPolicy: "100% credit refund up to 15 days before departure. 50% between 7-14 days."
  },
  {
    id: "trip-goa-1",
    destinationId: "goa",
    destinationName: "Goa Coastal Heritage & Secret Lagoons",
    collection: "explore",
    dates: "12 – 15 Dec 2026",
    price: 8999,
    originalPrice: 10999,
    duration: "4 Days / 3 Nights",
    seatsTotal: 14,
    seatsAvailable: 3,
    description: "Intimate coastal journey covering Fontainhas Latin quarters, secret South Goa beaches, and sunset clifftops.",
    overview: "Skip the commercial clutter for old-world Portuguese architecture, clifftop sunsets at Cabo de Rama, and kayaking quiet sweetwater lagoons.",
    heroImage: goaImg,
    status: "Almost Full",
    captainName: "Derek D'Souza",
    category: "Beach",
    transportDetails: "Dedicated AC Tempo Traveller with seasoned driver",
    accommodationDetails: "Heritage Portuguese villa and boutique coastal rooms",
    mealsDetails: "Daily breakfasts and authentic Goan seafood / vegetarian welcome dinner",
    inclusions: ["3 Nights Boutique Stay", "Daily Breakfasts & 2 Dinners", "AC Internal Transfers", "Experienced RAASTA Captain", "Heritage Walks & Entry Fees"],
    exclusions: ["Transit to/from Goa", "Lunches", "Water Sports", "Personal Expenses"],
    cancellationPolicy: "100% refund as travel credits up to 15 days before departure. 50% between 7-14 days."
  },
  {
    id: "trip-ladakh-1",
    destinationId: "ladakh",
    destinationName: "Ladakh & Nubra Valley Overland",
    collection: "select",
    dates: "15 – 23 Jan 2027",
    price: 27499,
    originalPrice: 31999,
    duration: "9 Days / 8 Nights",
    seatsTotal: 10,
    seatsAvailable: 2,
    description: "Conquer Khardung La, explore white sand dunes at Hunder, and experience Pangong Tso's azure waters.",
    overview: "The gold standard of trans-Himalayan overlanding, featuring high-altitude monasteries, Hanle dark sky stargazing, and private 4x4 support.",
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
    status: "Almost Full",
    captainName: "Rigzin Dorje",
    category: "Mountain",
    transportDetails: "Expedition-spec 4x4 SUVs with mountain-trained drivers",
    accommodationDetails: "Handpicked premium hotels in Leh and luxury insulated dome tents by the lake",
    mealsDetails: "Full breakfast and hot dinners with mountain tea service",
    inclusions: ["8 Nights Boutique Stays & Glamping", "Daily Breakfast & Dinners", "Expedition-spec 4x4 / Force Urbania", "All Inner Line Permits & Environment Fees", "Medical Oxygen & Altitude Safety Kit"],
    exclusions: ["Airfare to/from Leh", "Lunches & Personal Shopping", "Camel / ATV Rentals"],
    cancellationPolicy: "100% credit refund up to 20 days before departure. 50% between 10-19 days."
  },
  {
    id: "trip-jaisalmer-1",
    destinationId: "jaisalmer",
    destinationName: "Thar Desert Starlit Caravan",
    collection: "explore",
    dates: "06 – 09 Feb 2027",
    price: 11999,
    originalPrice: 14499,
    duration: "4 Days / 3 Nights",
    seatsTotal: 14,
    seatsAvailable: 5,
    description: "4x4 dune bashing in Sam, sunset camel rides, and folk music bonfires under the vast desert sky.",
    overview: "A vibrant 4-day desert caravan exploring the living sandstone fort of Jaisalmer, abandoned Kuldhara village, and starlit luxury desert camping.",
    heroImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=80",
    status: "Selling Fast",
    captainName: "Manvendra Singh",
    category: "Adventure",
    transportDetails: "AC vehicle for transfers and 4x4 modified Jeeps for dune bashing",
    accommodationDetails: "2 nights in boutique sandstone haveli and 1 night in luxury Swiss desert tent",
    mealsDetails: "Daily breakfasts and 2 authentic Rajasthani dinners",
    inclusions: ["2 Nights Boutique Haveli & 1 Night Luxury Desert Camp", "Daily Breakfasts & 2 Traditional Dinners", "AC Transfers & 4x4 Dune Drive", "Trip Captain & Local Historian Guides", "Desert Cultural Program & Bonfire"],
    exclusions: ["Transit to/from Jaisalmer", "Lunches & Personal Shopping", "Quad Biking Add-ons"],
    cancellationPolicy: "100% credit refund up to 15 days before departure. 50% between 7-14 days."
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-1",
    name: "Abhi Ghodke",
    role: "Founder & Lead Overland Captain",
    bio: "Passionate road-tripper with over 80,000 km across the Indian subcontinent. Founded RAASTA to make authentic road journeys accessible, safe, and deeply personal.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    experience: "8+ Years Overlanding",
    specialtyRoutes: ["Spiti Valley", "Western Ghats", "Goa Heritage"]
  },
  {
    id: "team-2",
    name: "Tenzin Norbu",
    role: "Himalayan Route Architect",
    bio: "Born in Kinnaur, Tenzin has led high-altitude caravans across Spiti and Zanskar for over a decade. Wilderness First Aid certified with deep community roots.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    experience: "10+ Years High Altitude",
    specialtyRoutes: ["Spiti Circuit", "Ladakh & Nubra", "Kinnaur"]
  },
  {
    id: "team-3",
    name: "Pooja Deshmukh",
    role: "Traveler Experience & Operations Lead",
    bio: "Ensures every traveler's enquiry receives thoughtful attention, coordinates bespoke stays with local homestay hosts, and champions solo female traveler safety.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    experience: "6+ Years Hospitality",
    specialtyRoutes: ["Gokarna Trails", "Meghalaya Highlands", "Rajasthan"]
  },
  {
    id: "team-4",
    name: "Siddharth Shinde",
    role: "Expedition Photographer & Scout",
    bio: "Documenting unmapped trailheads, campfire stories, and cultural heritage across India with a camera in hand and an ear for genuine travelers' stories.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    experience: "7+ Years Documentary",
    specialtyRoutes: ["Western Ghats", "Desert Caravans", "Coastal Cliffs"]
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Aditya Roy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    destination: "Spiti High Desert Overland",
    tripCollection: "select",
    verifiedTraveler: true,
    content: "The high-altitude overlanding with RAASTA was absolute bliss. Navigating Kunzum Pass and camping at Chandratal felt completely seamless under Tenzin's expert guidance.",
    date: "October 2026"
  },
  {
    id: "rev-2",
    author: "Sneha Kapoor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    destination: "Gokarna Five-Beach Cliff Trail",
    tripCollection: "explore",
    verifiedTraveler: true,
    content: "Waking up to the sound of waves at our cliffside stay was unforgettable. As a college student joining solo, I made incredible friends on the very first day.",
    date: "September 2026"
  },
  {
    id: "rev-3",
    author: "Kabir Mehta",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    destination: "Goa Coastal Heritage",
    tripCollection: "explore",
    verifiedTraveler: true,
    content: "RAASTA completely redefined Goa for me. We skipped commercial tourist traps and discovered secret South Goa lagoons and Fontainhas history. Absolute perfection!",
    date: "August 2026"
  },
  {
    id: "rev-4",
    author: "Ananya Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    destination: "Meghalaya Living Bridges",
    tripCollection: "select",
    verifiedTraveler: true,
    content: "The trek to Nongriat and swimming in Krang Shuri falls was otherworldly. As a solo female traveler, I felt completely safe, respected, and welcomed by the whole crew.",
    date: "October 2026"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1400&q=80",
    title: "Kunzum Summit Sunrise",
    destination: "Spiti Valley",
    category: "Mountains",
    date: "Oct 2026",
    likes: 489,
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
    photographer: "Abhi G."
  },
  {
    id: "gal-3",
    url: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80",
    title: "Om Beach Bonfire Night",
    destination: "Gokarna",
    category: "Beaches",
    date: "Sep 2026",
    likes: 312,
    photographer: "Aditya H."
  },
  {
    id: "gal-4",
    url: "https://images.unsplash.com/photo-1504712548863-1f758290f57d?auto=format&fit=crop&w=1400&q=80",
    title: "Chasing Himalayan Clouds",
    destination: "Spiti Valley",
    category: "Roads",
    date: "Sep 2026",
    likes: 428,
    photographer: "Tenzin N."
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
    photographer: "Pooja D."
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do RAASTA road trips work?",
    answer: "RAASTA is not a standard sightseeing tour. We curate intimate group overland journeys. Each caravan has a strict microgroup cap of 12 to 14 travelers led by an experienced RAASTA Trip Captain and veteran local drivers. We travel in high-quality vehicles, pause at unmapped local spots, stay in boutique heritage homestays, and bond over campfires and acoustic jams."
  },
  {
    id: "faq-2",
    question: "What is the difference between RAASTA EXPLORE and RAASTA SELECT?",
    answer: "RAASTA EXPLORE focuses on high-energy, accessible, student-friendly group adventures, coastal trails, and weekend backpacking escapes with comfortable homestays. RAASTA SELECT features boutique heritage stays, smaller micro-groups, dedicated 4x4 expedition cruisers, local naturalists, and premium inclusions."
  },
  {
    id: "faq-3",
    question: "How does the enquiry and booking process work?",
    answer: "We follow an Enquiry-First model. When you find a trip you love, submit an enquiry or connect with us on WhatsApp. A dedicated team member personally checks real-time seat availability, clarifies route logistics, and assists you directly before manual reservation confirmation. We never charge automated surprise fees."
  },
  {
    id: "faq-4",
    question: "Are these trips safe for solo female travelers?",
    answer: "Over 65% of our explorers join solo, a large majority of whom are women. Rigorous safety audits, certified route captains, vetted accommodations, and zero-tolerance harassment policies make RAASTA one of India's most trusted travel communities for solo adventurers."
  },
  {
    id: "faq-5",
    question: "What is your refund & cancellation policy?",
    answer: "If you cancel 15 days or more prior to departure, you receive a 100% refund as RAASTA travel credits that never expire. If you cancel within 7 to 14 days, a 50% refund is issued. Within 7 days, cancellations can be transferred to any friend or family member at zero re-booking fee."
  },
  {
    id: "faq-6",
    question: "How are high-altitude medical emergencies handled?",
    answer: "All our Himalayan expeditions carry portable medical oxygen cylinders, pulse oximeters, specialized mountain first-aid kits, and 24/7 satellite ops connectivity with nearby base hospitals. Captains are trained in Wilderness First Aid."
  }
];

export const PACKAGES: PackageTier[] = [
  {
    id: "adventure",
    name: "Raasta Explorer",
    desc: "Accessible group departures with comfortable homestays, road caravans, and essential permits.",
    basePrice: 8999,
    features: [
      "Comfortable experiential homestays",
      "Dedicated 4x4 / Force Urbania vehicle",
      "Daily wholesome breakfasts & dinners",
      "Certified RAASTA Trip Captain",
      "Inner line permits & entry passes"
    ]
  },
  {
    id: "nomad",
    name: "Raasta Select",
    desc: "Curated micro-groups with boutique heritage stays, smaller group caps, and private naturalists.",
    basePrice: 18499,
    isMostLoved: true,
    features: [
      "Boutique heritage villas & high glamping",
      "Micro-group capped at 8-10 people",
      "Dedicated high-clearance SUV fleet",
      "Curated local culinary trails",
      "Specialized high-altitude naturalist",
      "Priority assistance & flexible reschedule"
    ]
  },
  {
    id: "bespoke",
    name: "Private Charter",
    desc: "Customized private route tailored for families, couples, or private corporate expeditions.",
    basePrice: 24999,
    features: [
      "Private vehicle & captain dedicated to your party",
      "Fully customized dates & daily pacing",
      "Handpicked luxury villas & estate stays",
      "Personalized culinary arrangements",
      "Airport/hub private transfers"
    ]
  }
];
