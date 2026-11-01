/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Trip, Booking } from "../types";
import { TRIPS } from "../data";
import { Calendar, Users, SlidersHorizontal, MapPin, Tag, Search, ArrowRight, Sparkles, Compass, ArrowUpDown, ChevronDown, Check, ArrowDownWideNarrow, ArrowUpNarrowWide, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import BookingForm from "./BookingForm";
import TopographicOverlay from "./TopographicOverlay";

interface UpcomingTripsProps {
  tripsList: Trip[];
  onBookTrip: (trip: Trip) => void;
  selectedTripForBooking: Trip | null;
  onCloseBookingForm: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
  initialFilterDestinationId?: string;
  onClearInitialFilter?: () => void;
}

export type TripSortOption = "default" | "price-asc" | "price-desc" | "date-asc" | "date-desc";

// Helper to robustly parse various trip date formats for chronological sorting
function parseTripDate(dateStr: string): number {
  if (!dateStr) return 0;

  // Direct parse attempt
  const direct = Date.parse(dateStr);
  if (!isNaN(direct)) return direct;

  // Standardize dashes (replace en-dash, em-dash with standard hyphen)
  const normalized = dateStr.replace(/[–—]/g, "-").trim();

  // Pattern 1: "12 - 15 July 2025" or "12 - 15 Jul 2025"
  const rangeWithMonthYear = normalized.match(/(\d{1,2})\s*-\s*\d{1,2}\s+([A-Za-z]+)\s+(\d{4})/);
  if (rangeWithMonthYear) {
    const [, startDay, month, year] = rangeWithMonthYear;
    const parsed = Date.parse(`${month} ${startDay}, ${year}`);
    if (!isNaN(parsed)) return parsed;
  }

  // Pattern 2: "28 Oct - 2 Nov 2025"
  const multiMonthRange = normalized.match(/(\d{1,2})\s+([A-Za-z]+)\s*-\s*\d{1,2}\s+[A-Za-z]+\s+(\d{4})/);
  if (multiMonthRange) {
    const [, startDay, month, year] = multiMonthRange;
    const parsed = Date.parse(`${month} ${startDay}, ${year}`);
    if (!isNaN(parsed)) return parsed;
  }

  // Pattern 3: "12 July 2025" or "July 12 2025"
  const dayMonthYear = normalized.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (dayMonthYear) {
    const [, day, month, year] = dayMonthYear;
    const parsed = Date.parse(`${month} ${day}, ${year}`);
    if (!isNaN(parsed)) return parsed;
  }

  // Pattern 4: "July 2025"
  const monthYear = normalized.match(/([A-Za-z]+)\s+(\d{4})/);
  if (monthYear) {
    const [, month, year] = monthYear;
    const parsed = Date.parse(`${month} 1, ${year}`);
    if (!isNaN(parsed)) return parsed;
  }

  // Pattern 5: Any 4-digit year e.g. "2025"
  const yearOnly = normalized.match(/(\d{4})/);
  if (yearOnly) {
    return new Date(parseInt(yearOnly[1], 10), 0, 1).getTime();
  }

  return 0;
}

export default function UpcomingTrips({
  tripsList,
  onBookTrip,
  selectedTripForBooking,
  onCloseBookingForm,
  onBookingSuccess,
  initialFilterDestinationId,
  onClearInitialFilter
}: UpcomingTripsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<TripSortOption>("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const statuses = ["All", "Seats Open", "Selling Fast", "Almost Full", "Monsoon Special"];

  const sortOptions: { id: TripSortOption; label: string; shortLabel: string; hint: string }[] = [
    { id: "default", label: "Featured Order", shortLabel: "Featured", hint: "Curated expedition sequence" },
    { id: "price-asc", label: "Price: Low to High", shortLabel: "Price (Low → High)", hint: "Budget friendly first" },
    { id: "price-desc", label: "Price: High to Low", shortLabel: "Price (High → Low)", hint: "Premium caravans first" },
    { id: "date-asc", label: "Date: Earliest First", shortLabel: "Date (Soonest)", hint: "Upcoming departures first" },
    { id: "date-desc", label: "Date: Latest First", shortLabel: "Date (Later)", hint: "Future departures" },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOpen]);

  // 1. Filter our scheduled departures
  const filteredTrips = tripsList.filter((trip) => {
    // Destination filter (passed down from Deep Dive triggers)
    if (initialFilterDestinationId && trip.destinationId !== initialFilterDestinationId) {
      return false;
    }

    // Search matches
    const matchesSearch =
      trip.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.dates.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Status matches
    const matchesStatus = statusFilter === "All" || trip.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 2. Sort filtered scheduled departures
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    if (sortBy === "date-asc") {
      const dateA = parseTripDate(a.dates);
      const dateB = parseTripDate(b.dates);
      return dateA - dateB;
    }
    if (sortBy === "date-desc") {
      const dateA = parseTripDate(a.dates);
      const dateB = parseTripDate(b.dates);
      return dateB - dateA;
    }
    return 0;
  });

  const activeSort = sortOptions.find(o => o.id === sortBy) || sortOptions[0];

  return (
    <section id="trips" className="py-32 px-6 bg-[#07080a] relative overflow-hidden">
      <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/5 blur-[160px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header Block */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs tracking-widest text-amber-400 uppercase font-bold mb-3 block font-display">
            Curated Expeditions
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 font-display">
            Upcoming <br/>
            <span className="font-editorial text-amber-300 font-normal italic text-5xl sm:text-6xl md:text-7xl">Departures & Caravans</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-light">
            Reserve your seat on our next handcrafted expeditions. To protect local ecosystems, we strictly cap group size to 14 travelers per caravan.
          </p>

          {/* Active Deep Dive Destination Filter Alert */}
          {initialFilterDestinationId && (
            <div className="mt-6 inline-flex items-center gap-3.5 px-5 py-2.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold">
              <span>
                Filtered by: {tripsList.find(t => t.destinationId === initialFilterDestinationId)?.destinationName.split(" ")[0]} Route
              </span>
              <button
                onClick={onClearInitialFilter}
                className="font-bold underline hover:text-white transition uppercase text-[10px] tracking-wider cursor-pointer ml-2"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Filters & Sorting Controls Bar */}
        <div className="glass border border-white/10 p-4 sm:p-5 rounded-3xl mb-12 flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between shadow-xl">
          {/* Search bar */}
          <div className="relative w-full xl:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search dates, passes, mountains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>

          {/* Availability Status list filters */}
          <div className="flex flex-wrap gap-2 items-center flex-1 justify-start xl:justify-center">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider font-display uppercase transition-all duration-300 cursor-pointer ${
                  statusFilter === st
                    ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown Menu */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`w-full xl:w-auto min-w-[210px] px-4 py-3 rounded-2xl border text-xs font-medium flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer ${
                sortBy !== "default"
                  ? "bg-amber-400/10 border-amber-400/40 text-amber-300 shadow-sm shadow-amber-500/10"
                  : "bg-white/5 border-white/10 hover:border-white/20 text-zinc-200 hover:text-white"
              }`}
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
            >
              <div className="flex items-center gap-2">
                <ArrowUpDown className={`w-3.5 h-3.5 ${sortBy !== "default" ? "text-amber-400" : "text-zinc-400"}`} />
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono">Sort:</span>
                <span className="font-semibold text-white truncate max-w-[120px]">{activeSort.shortLabel}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Options Popover */}
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-72 bg-[#0c0d12] border border-white/15 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-30 space-y-1"
                  role="listbox"
                >
                  <div className="px-3 py-2 flex items-center justify-between border-b border-white/10 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono">
                      Sort Departures
                    </span>
                    {sortBy !== "default" && (
                      <button
                        onClick={() => {
                          setSortBy("default");
                          setIsSortOpen(false);
                        }}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono uppercase tracking-wider cursor-pointer"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        Reset
                      </button>
                    )}
                  </div>

                  {sortOptions.map((opt) => {
                    const isSelected = sortBy === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer group ${
                          isSelected
                            ? "bg-amber-400/15 border border-amber-400/30 text-amber-300"
                            : "hover:bg-white/5 text-zinc-300 hover:text-white border border-transparent"
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {opt.id.startsWith("price") ? (
                              <Tag className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-zinc-500 group-hover:text-amber-400"}`} />
                            ) : opt.id.startsWith("date") ? (
                              <Calendar className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-zinc-500 group-hover:text-amber-400"}`} />
                            ) : (
                              <Sparkles className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-zinc-500 group-hover:text-amber-400"}`} />
                            )}
                            <span>{opt.label}</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-0.5 pl-5.5 font-light">
                            {opt.hint}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick status bar showing results count and active sort/filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 px-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-white font-semibold">{sortedTrips.length}</span>
            <span>{sortedTrips.length === 1 ? "caravan available" : "caravans available"}</span>
            {searchTerm && (
              <span className="text-zinc-500">
                • matching "<span className="text-zinc-300">{searchTerm}</span>"
              </span>
            )}
            {statusFilter !== "All" && (
              <span className="text-zinc-500">
                • status: <span className="text-amber-400 font-medium">{statusFilter}</span>
              </span>
            )}
          </div>

          {sortBy !== "default" && (
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-mono">
              <span>Sorted by: {activeSort.shortLabel}</span>
              <button
                onClick={() => setSortBy("default")}
                className="hover:text-white transition cursor-pointer"
                title="Reset to default sorting"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Departures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {sortedTrips.length > 0 ? (
              sortedTrips.map((trip) => {
                // Color style mapping for status badges
                const getStatusStyle = (status: string) => {
                  switch (status) {
                    case "Selling Fast":
                    case "Almost Full":
                      return "bg-rose-500/10 text-rose-300 border-rose-500/30";
                    case "Monsoon Special":
                      return "bg-sky-500/10 text-sky-300 border-sky-500/30";
                    default:
                      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
                  }
                };

                return (
                  <motion.div
                    layout
                    key={trip.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="group relative bg-[#0b0c10] border border-white/10 rounded-[32px] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-amber-400/40 flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)] overflow-hidden"
                  >
                    {/* Subtle Topographic Cartography Lines */}
                    <TopographicOverlay opacity={0.03} />

                    <div className="relative z-10">
                      {/* Top status bar */}
                      <div className="flex justify-between items-center mb-6">
                        <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest font-display ${getStatusStyle(trip.status)}`}>
                          {trip.status}
                        </span>
                        
                        <div className="flex flex-col items-end">
                          {trip.originalPrice && (
                            <span className="text-[11px] text-zinc-500 line-through font-normal">
                              ₹{trip.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <div className="flex items-center gap-1.5 text-amber-300 text-base font-black font-display">
                            <Tag className="w-3.5 h-3.5 text-amber-400" />
                            <span>₹{trip.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Title information */}
                      <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight font-display">
                        {trip.destinationName}
                      </h3>

                      {/* Dates and location */}
                      <div className="space-y-2.5 mb-6">
                        <div className="flex items-center gap-3 text-zinc-200 text-xs font-medium">
                          <Calendar className="w-4 h-4 text-amber-400" />
                          <span>{trip.dates}</span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-400 text-xs font-light">
                          <MapPin className="w-4 h-4 text-zinc-500" />
                          <span>Expedition Loop & 4x4 Trail</span>
                        </div>
                      </div>

                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 font-light">
                        {trip.description}
                      </p>
                    </div>

                    {/* Inventory control meters */}
                    <div className="pt-6 border-t border-white/10 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 text-[11px]">Seats Capacity:</span>
                        <span className="font-mono text-white text-xs font-bold">{trip.seatsAvailable} of {trip.seatsTotal} Available</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, (trip.seatsAvailable / (trip.seatsTotal || 15)) * 100))}%` }}
                        />
                      </div>

                      {trip.seatsAvailable > 0 ? (
                        <button
                          onClick={() => onBookTrip(trip)}
                          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white hover:bg-amber-300 text-black font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer font-display"
                        >
                          <Users className="w-4 h-4" />
                          <span>Reserve Seat</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3.5 rounded-2xl bg-white/5 text-zinc-600 font-black text-xs uppercase tracking-widest cursor-not-allowed font-display"
                        >
                          Waitlist Full
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center text-zinc-500 glass rounded-[32px] border border-white/10">
                <Search className="w-10 h-10 stroke-[1] mx-auto mb-4 text-zinc-600" />
                <p className="text-base font-semibold text-white font-display">No scheduled caravans found</p>
                <p className="text-xs text-zinc-400 mt-1 font-light">Try searching a different month or clearing the status filter.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* RENDER RESERVATION SHEET IN PORTAL / OVERLAY FLOW */}
      <AnimatePresence>
        {selectedTripForBooking && (
          <BookingForm
            trip={selectedTripForBooking}
            onClose={onCloseBookingForm}
            onBookingSuccess={onBookingSuccess}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
