import React, { useState } from "react";
import { Trip, Destination, FAQItem } from "../types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Users,
  Compass,
  Check,
  X as XIcon,
  ChevronDown,
  ShieldCheck,
  Bus,
  Home,
  Utensils,
  Camera,
  MessageCircle,
  Sparkles,
  HelpCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TripDetailViewProps {
  trip: Trip;
  destination?: Destination;
  allTripsForDestination: Trip[];
  onBack: () => void;
  onEnquireNow: (trip: Trip) => void;
  onSelectOtherTrip: (trip: Trip) => void;
}

export default function TripDetailView({
  trip,
  destination,
  allTripsForDestination,
  onBack,
  onEnquireNow,
  onSelectOtherTrip
}: TripDetailViewProps) {
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(0);
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  // Fallback data if destination object is missing or minimal
  const heroImage = trip.heroImage || destination?.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80";
  const itinerary = trip.itinerary || destination?.itinerary || [];
  const inclusions = trip.inclusions || destination?.inclusions || [
    "All nights accommodation in vetted boutique homestays or camps",
    "Breakfast and dinners as outlined in the route plan",
    "High-clearance 4x4 / Force Urbania transport for all trails",
    "Certified Wilderness Trip Captain and local mountain guide",
    "All internal line permits, toll taxes, and forest fees"
  ];
  const exclusions = trip.exclusions || destination?.exclusions || [
    "Personal transit to and from the reporting hub",
    "Lunches and cafe stops on the road",
    "Personal equipment shopping and porterage",
    "Emergency medical evacuation or insurance beyond standard policy"
  ];
  const faqs = trip.faqs || destination?.faqs || [];
  const cancellationPolicy = trip.cancellationPolicy || destination?.cancellationPolicy ||
    "100% refund as non-expiring RAASTA travel credits if cancelled 15+ days prior to departure. 50% between 7-14 days. Transferable to any friend at zero fee anytime.";

  const transportDetails = trip.transportDetails || "High-clearance Force Urbania / Dedicated 4x4 SUVs with experienced local mountain drivers.";
  const accommodationDetails = trip.accommodationDetails || "Double / triple occupancy in authentic boutique heritage homestays, lakeside glamping tents, or character-rich coastal retreats.";
  const mealsDetails = trip.mealsDetails || "Daily freshly prepared regional breakfasts and authentic community dinners. Lunches are enjoyed at curated trailside cafes.";

  const whatsappMessage = encodeURIComponent(
    `Hi Raasta Trips! I am interested in the ${trip.destinationName} departure (${trip.dates}) in the ${trip.collection === "select" ? "Raasta Select" : "Raasta Explore"} collection. Could you please share the availability and detailed quote?`
  );

  return (
    <div className="min-h-screen bg-[#182622] text-[#EDE9DF] pt-24 pb-32">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-[65vh] sm:h-[75vh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt={trip.destinationName}
          className="absolute inset-0 w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
        />
        {/* Gradients & vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#182622] via-[#182622]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#182622]/80 via-transparent to-transparent" />

        {/* Top Back Navigation Bar */}
        <div className="absolute top-6 left-6 right-6 max-w-7xl mx-auto flex items-center justify-between z-20">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#202522]/80 backdrop-blur-md border border-[#8C9A82]/30 text-xs font-semibold uppercase tracking-wider text-[#EDE9DF] hover:bg-[#202522] hover:text-[#D4A96C] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trips</span>
          </button>

          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            trip.collection === "select"
              ? "bg-[#D4A96C] text-[#182622]"
              : "bg-[#8C9A82] text-[#182622]"
          }`}>
            {trip.collection === "select" ? "RAASTA SELECT" : "RAASTA EXPLORE"}
          </span>
        </div>

        {/* Hero Bottom Content */}
        <div className="absolute bottom-8 left-6 right-6 max-w-7xl mx-auto z-20">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#202522]/90 border border-[#8C9A82]/30 text-[#D4A96C] text-xs font-mono font-semibold">
                {trip.duration}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#202522]/90 border border-[#8C9A82]/30 text-[#EDE9DF]/80 text-xs font-mono">
                {trip.dates}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold uppercase tracking-wider">
                {trip.status}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#EDE9DF] font-bold tracking-tight mb-4">
              {trip.destinationName}
            </h1>
            <p className="text-[#EDE9DF]/85 text-base sm:text-xl font-light leading-relaxed max-w-2xl">
              {destination?.subTitle || trip.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: 15 Core Detail Sections */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* 2. DESTINATION OVERVIEW & HIGHLIGHTS */}
          <section className="bg-[#202522] border border-[#8C9A82]/20 rounded-[32px] p-8 sm:p-10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#EDE9DF] mb-4">
              The Expedition <span className="italic text-[#D4A96C]">Overview</span>
            </h2>
            <p className="text-[#EDE9DF]/80 text-sm sm:text-base leading-relaxed font-light mb-8">
              {trip.overview || destination?.longDesc || trip.description}
            </p>

            {destination?.highlights && destination.highlights.length > 0 && (
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#D4A96C] mb-4">
                  Signature Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {destination.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#182622] border border-[#8C9A82]/20 text-xs sm:text-sm text-[#EDE9DF]/90 font-light">
                      <Sparkles className="w-4 h-4 text-[#D4A96C] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 6. DAY-BY-DAY ITINERARY ACCORDION */}
          {itinerary.length > 0 && (
            <section className="bg-[#202522] border border-[#8C9A82]/20 rounded-[32px] p-8 sm:p-10 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#EDE9DF]">
                    Day-by-Day <span className="italic text-[#D4A96C]">Itinerary</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#EDE9DF]/70 font-light mt-1">
                    Carefully paced for acclimatization, photography, and genuine exploration.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#D4A96C] px-3 py-1 rounded-full bg-[#182622] border border-[#8C9A82]/30">
                  {itinerary.length} Days
                </span>
              </div>

              <div className="space-y-4">
                {itinerary.map((dayItem, idx) => {
                  const isOpen = activeDayIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[#8C9A82]/25 overflow-hidden bg-[#182622] transition-colors"
                    >
                      <button
                        onClick={() => setActiveDayIndex(isOpen ? null : idx)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#202522]/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="px-2.5 py-1 rounded-lg bg-[#D4A96C]/10 border border-[#D4A96C]/30 text-[#D4A96C] text-xs font-mono font-bold shrink-0">
                            {dayItem.day}
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-[#EDE9DF]">
                            {dayItem.title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-[#D4A96C] transition-transform duration-200 shrink-0 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#EDE9DF]/80 font-light leading-relaxed border-t border-[#8C9A82]/15"
                          >
                            {dayItem.description}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 7, 8, 9. LOGISTICS & STANDARDS (Transport, Stays, Meals) */}
          <section className="bg-[#202522] border border-[#8C9A82]/20 rounded-[32px] p-8 sm:p-10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#EDE9DF] mb-6">
              Expedition <span className="italic text-[#D4A96C]">Logistics & Stays</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Transport */}
              <div className="p-5 rounded-2xl bg-[#182622] border border-[#8C9A82]/20">
                <div className="w-10 h-10 rounded-xl bg-[#8C9A82]/20 flex items-center justify-center text-[#D4A96C] mb-3">
                  <Bus className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-[#EDE9DF] mb-2">Transport</h4>
                <p className="text-xs text-[#EDE9DF]/75 font-light leading-relaxed">
                  {transportDetails}
                </p>
              </div>

              {/* Stays */}
              <div className="p-5 rounded-2xl bg-[#182622] border border-[#8C9A82]/20">
                <div className="w-10 h-10 rounded-xl bg-[#8C9A82]/20 flex items-center justify-center text-[#D4A96C] mb-3">
                  <Home className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-[#EDE9DF] mb-2">Accommodations</h4>
                <p className="text-xs text-[#EDE9DF]/75 font-light leading-relaxed">
                  {accommodationDetails}
                </p>
              </div>

              {/* Meals */}
              <div className="p-5 rounded-2xl bg-[#182622] border border-[#8C9A82]/20">
                <div className="w-10 h-10 rounded-xl bg-[#8C9A82]/20 flex items-center justify-center text-[#D4A96C] mb-3">
                  <Utensils className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-[#EDE9DF] mb-2">Meals & Pacing</h4>
                <p className="text-xs text-[#EDE9DF]/75 font-light leading-relaxed">
                  {mealsDetails}
                </p>
              </div>
            </div>
          </section>

          {/* 10 & 11. INCLUSIONS & EXCLUSIONS */}
          <section className="bg-[#202522] border border-[#8C9A82]/20 rounded-[32px] p-8 sm:p-10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#EDE9DF] mb-6">
              Transparent <span className="italic text-[#D4A96C]">Package Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Inclusions */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4">
                  <Check className="w-4 h-4" />
                  <span>What is Included</span>
                </div>
                <ul className="space-y-3">
                  {inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#EDE9DF]/85 font-light">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#D4A96C] mb-4">
                  <XIcon className="w-4 h-4" />
                  <span>What is Excluded</span>
                </div>
                <ul className="space-y-3">
                  {exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#EDE9DF]/85 font-light">
                      <div className="w-4 h-4 rounded-full bg-[#D4A96C]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <XIcon className="w-3 h-3 text-[#D4A96C]" />
                      </div>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 13. CANCELLATION POLICY */}
          <section className="bg-[#202522] border border-[#8C9A82]/20 rounded-[32px] p-8 sm:p-10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-[#D4A96C]" />
              <h2 className="text-xl sm:text-2xl font-serif text-[#EDE9DF]">
                Cancellation & Refund Guarantee
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EDE9DF]/80 font-light leading-relaxed mb-4">
              {cancellationPolicy}
            </p>
            <div className="p-4 rounded-xl bg-[#182622] border border-[#8C9A82]/20 text-[11px] text-[#EDE9DF]/70 font-mono">
              💡 Zero Transfer Fee: If you cannot join, you may transfer your seat to a friend up to 72 hours before departure at no penalty.
            </div>
          </section>

          {/* 14. ROUTE FAQS */}
          {faqs.length > 0 && (
            <section className="bg-[#202522] border border-[#8C9A82]/20 rounded-[32px] p-8 sm:p-10 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-serif text-[#EDE9DF] mb-6">
                Route-Specific <span className="italic text-[#D4A96C]">FAQs</span>
              </h2>

              <div className="space-y-3.5">
                {faqs.map((faq) => {
                  const isOpen = activeFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl border border-[#8C9A82]/20 bg-[#182622] overflow-hidden"
                    >
                      <button
                        onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#202522]/50"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-[#EDE9DF]">
                          {faq.question}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-[#D4A96C] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#EDE9DF]/75 font-light leading-relaxed border-t border-[#8C9A82]/15 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>

        {/* RIGHT COLUMN: STICKY BOOKING / ENQUIRY SUMMARY CARD */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="bg-[#202522] border-2 border-[#D4A96C]/40 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
            {/* Price badge */}
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-xs text-[#EDE9DF]/60 font-mono block">All-inclusive package</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-serif text-[#D4A96C] font-bold">
                    ₹{trip.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#EDE9DF]/60">/ person</span>
                </div>
              </div>

              {trip.originalPrice && (
                <span className="text-xs text-[#EDE9DF]/50 line-through font-mono">
                  ₹{trip.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Quick departure info */}
            <div className="space-y-3 py-5 border-y border-[#8C9A82]/20 mb-6 text-xs text-[#EDE9DF]/80">
              <div className="flex justify-between items-center">
                <span className="text-[#EDE9DF]/60">Selected Dates:</span>
                <span className="font-semibold text-[#EDE9DF]">{trip.dates}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#EDE9DF]/60">Duration:</span>
                <span className="font-semibold text-[#EDE9DF]">{trip.duration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#EDE9DF]/60">Availability:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {trip.seatsAvailable} of {trip.seatsTotal} seats open
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#EDE9DF]/60">Collection:</span>
                <span className="font-semibold text-[#D4A96C] uppercase text-[11px]">
                  {trip.collection === "select" ? "Raasta Select" : "Raasta Explore"}
                </span>
              </div>
            </div>

            {/* Primary Action Button: Opens Enquiry Form */}
            <div className="space-y-3">
              <button
                onClick={() => onEnquireNow(trip)}
                className="w-full py-4 rounded-2xl bg-[#D4A96C] hover:bg-[#d8b37c] text-[#182622] font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-[#D4A96C]/20 flex items-center justify-center gap-2"
              >
                <span>Enquire & Reserve Seat</span>
              </button>

              <a
                href={`https://wa.me/919226638440?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-[#182622] hover:bg-[#182622]/80 text-[#EDE9DF] border border-[#8C9A82]/40 font-semibold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Reassurance note */}
            <div className="mt-6 pt-6 border-t border-[#8C9A82]/20 text-center">
              <p className="text-[11px] text-[#EDE9DF]/70 font-light leading-relaxed">
                🔒 <strong>Enquiry-First Model:</strong> No automated charges. Our team personally confirms availability and answers questions before any deposit is requested.
              </p>
            </div>
          </div>

          {/* Other upcoming departures for this destination */}
          {allTripsForDestination.length > 1 && (
            <div className="bg-[#202522] border border-[#8C9A82]/20 rounded-[28px] p-6 shadow-xl">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#D4A96C] mb-4">
                Other Scheduled Dates
              </h3>
              <div className="space-y-2.5">
                {allTripsForDestination
                  .filter((t) => t.id !== trip.id)
                  .map((otherTrip) => (
                    <button
                      key={otherTrip.id}
                      onClick={() => onSelectOtherTrip(otherTrip)}
                      className="w-full text-left p-3 rounded-xl bg-[#182622] hover:bg-[#182622]/80 border border-[#8C9A82]/20 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#EDE9DF]">{otherTrip.dates}</div>
                        <div className="text-[10px] text-[#EDE9DF]/60 font-mono">
                          {otherTrip.seatsAvailable} seats remaining
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#D4A96C] font-semibold">
                        ₹{otherTrip.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}