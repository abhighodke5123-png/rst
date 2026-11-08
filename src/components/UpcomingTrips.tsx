import React, { useState, useRef, useEffect } from "react";
import { Trip } from "../types";
import {
  Calendar,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  Tag,
  ArrowUpDown,
  ChevronDown,
  Check,
  RotateCcw,
  Clock,
  Send,
  Eye,
  SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import TopographicOverlay from "./TopographicOverlay";

interface UpcomingTripsProps {
  tripsList: Trip[];
  onViewTripDetails: (trip: Trip) => void;
  onEnquireTrip: (trip: Trip) => void;
  initialFilterDestinationId?: string;
  onClearInitialFilter?: () => void;
  selectedCollectionFilter?: "all" | "explore" | "select";
  onSetCollectionFilter?: (col: "all" | "explore" | "select") => void;
}

export type TripSortOption = "default" | "price-asc" | "price-desc" | "date-asc" | "date-desc";

function parseTripDate(dateStr: string): number {
  if (!dateStr) return 0;
  const direct = Date.parse(dateStr);
  if (!isNaN(direct)) return direct;

  const normalized = dateStr.replace(/[–—]/g, "-").trim();
  const rangeMatch = normalized.match(/(\d{1,2})\s*-\s*\d{1,2}\s+([A-Za-z]+)\s+(\d{4})/);
  if (rangeMatch) {
    const [, startDay, month, year] = rangeMatch;
    const parsed = Date.parse(`${month} ${startDay}, ${year}`);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
}

export default function UpcomingTrips({
  tripsList,
  onViewTripDetails,
  onEnquireTrip,
  initialFilterDestinationId,
  onClearInitialFilter,
  selectedCollectionFilter = "all",
  onSetCollectionFilter
}: UpcomingTripsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [collectionFilter, setCollectionFilter] = useState<"all" | "explore" | "select">(selectedCollectionFilter);
  const [sortBy, setSortBy] = useState<TripSortOption>("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [maxBudget, setMaxBudget] = useState<number>(30000);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCollectionFilter) {
      setCollectionFilter(selectedCollectionFilter);
    }
  }, [selectedCollectionFilter]);

  const statuses = ["All", "Seats Open", "Selling Fast", "Almost Full"];

  const sortOptions = [
    { id: "default", label: "Curated Sequence", shortLabel: "Curated" },
    { id: "price-asc", label: "Price: Low to High", shortLabel: "Price (Low → High)" },
    { id: "price-desc", label: "Price: High to Low", shortLabel: "Price (High → Low)" },
    { id: "date-asc", label: "Departure Date: Soonest", shortLabel: "Soonest" },
    { id: "date-desc", label: "Departure Date: Later", shortLabel: "Later" }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSortOpen]);

  // Filtering
  const filteredTrips = tripsList.filter((trip) => {
    if (initialFilterDestinationId && trip.destinationId !== initialFilterDestinationId) {
      return false;
    }
    if (collectionFilter !== "all" && trip.collection !== collectionFilter) {
      return false;
    }
    if (statusFilter !== "All" && trip.status !== statusFilter) {
      return false;
    }
    if (trip.price > maxBudget) {
      return false;
    }

    const matchesSearch =
      trip.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.dates.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.category?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Sorting
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "date-asc") return parseTripDate(a.dates) - parseTripDate(b.dates);
    if (sortBy === "date-desc") return parseTripDate(b.dates) - parseTripDate(a.dates);
    return 0;
  });

  const activeSort = sortOptions.find((o) => o.id === sortBy) || sortOptions[0];

  return (
    <section id="trips" className="py-24 sm:py-32 px-6 bg-[#182622] relative overflow-hidden">
      <TopographicOverlay opacity={0.03} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#202522] border border-[#8C9A82]/30 text-[#D4A96C] text-xs font-semibold uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>2026–2027 Calendar</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#EDE9DF] tracking-tight mb-5">
            Upcoming <span className="italic text-[#D4A96C]">Departures</span>
          </h2>
          <p className="text-[#EDE9DF]/80 text-base sm:text-lg font-light leading-relaxed">
            Reserve your seat on our next road caravans. To preserve trail intimacy and local ecosystems, groups are strictly capped at 14 travelers.
          </p>

          {/* Destination filter tag if active */}
          {initialFilterDestinationId && (
            <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#202522] border border-[#D4A96C]/40 text-[#D4A96C] text-xs font-semibold">
              <span>Filtered by destination</span>
              <button
                onClick={onClearInitialFilter}
                className="underline hover:text-white transition font-mono uppercase text-[10px] cursor-pointer ml-1"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#202522] border border-[#8C9A82]/25 p-5 rounded-[28px] mb-10 space-y-4 shadow-xl">
          
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9A82]" />
              <input
                type="text"
                placeholder="Search departures by destination, date, or terrain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-[#EDE9DF] placeholder-[#EDE9DF]/40 focus:outline-none focus:border-[#D4A96C]"
              />
            </div>

            {/* Collection Filter (All / Explore / Select) */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#182622] border border-[#8C9A82]/25 shrink-0">
              {(["all", "explore", "select"] as const).map((col) => (
                <button
                  key={col}
                  onClick={() => {
                    setCollectionFilter(col);
                    if (onSetCollectionFilter) onSetCollectionFilter(col);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    collectionFilter === col
                      ? "bg-[#D4A96C] text-[#182622] font-bold shadow-sm"
                      : "text-[#EDE9DF]/70 hover:text-white"
                  }`}
                >
                  {col === "all" ? "All Streams" : col === "explore" ? "Explore" : "Select"}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full lg:w-auto px-4 py-3 rounded-2xl bg-[#182622] border border-[#8C9A82]/30 text-xs font-semibold text-[#EDE9DF] flex items-center justify-between gap-3 cursor-pointer hover:border-[#D4A96C]/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#D4A96C]" />
                  <span className="text-[11px] uppercase tracking-wider text-[#EDE9DF]/60 font-mono">Sort:</span>
                  <span className="font-semibold text-[#EDE9DF]">{activeSort.shortLabel}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#D4A96C] transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 top-full mt-2 w-60 bg-[#202522] border border-[#8C9A82]/30 rounded-2xl p-2 shadow-2xl z-30 space-y-1"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id as TripSortOption);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer ${
                          sortBy === opt.id
                            ? "bg-[#D4A96C]/20 text-[#D4A96C] font-semibold"
                            : "text-[#EDE9DF]/75 hover:bg-[#182622] hover:text-[#EDE9DF]"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#D4A96C]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick status pills and budget filter slider */}
          <div className="pt-3 border-t border-[#8C9A82]/15 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-[#EDE9DF]/60">Status:</span>
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    statusFilter === st
                      ? "bg-[#EDE9DF] text-[#182622]"
                      : "bg-[#182622] text-[#EDE9DF]/60 hover:text-white border border-[#8C9A82]/20"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Budget filter indicator */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#EDE9DF]/60">Max Budget:</span>
              <span className="font-mono text-[#D4A96C] font-semibold">₹{maxBudget.toLocaleString()}</span>
              <input
                type="range"
                min={7000}
                max={30000}
                step={1000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-28 accent-[#D4A96C] cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Departures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedTrips.length > 0 ? (
            sortedTrips.map((trip) => {
              const isSelect = trip.collection === "select";
              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`group bg-[#202522] border rounded-[32px] p-7 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:-translate-y-1.5 ${
                    isSelect
                      ? "border-[#D4A96C]/40 hover:border-[#D4A96C]"
                      : "border-[#8C9A82]/25 hover:border-[#8C9A82]/60"
                  }`}
                >
                  <div>
                    {/* Top status bar & collection badge */}
                    <div className="flex justify-between items-center mb-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isSelect
                          ? "bg-[#D4A96C]/15 border border-[#D4A96C]/40 text-[#D4A96C]"
                          : "bg-[#8C9A82]/20 border border-[#8C9A82]/40 text-[#EDE9DF]"
                      }`}>
                        {isSelect ? "RAASTA SELECT" : "RAASTA EXPLORE"}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full bg-[#182622] text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold">
                        {trip.status}
                      </span>
                    </div>

                    {/* Trip title */}
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#EDE9DF] font-bold tracking-tight mb-2">
                      {trip.destinationName}
                    </h3>

                    {/* Duration & Dates */}
                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex items-center gap-2.5 text-[#EDE9DF]/80">
                        <Calendar className="w-3.5 h-3.5 text-[#D4A96C]" />
                        <span>{trip.dates}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[#EDE9DF]/60">
                        <Clock className="w-3.5 h-3.5 text-[#8C9A82]" />
                        <span>{trip.duration}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#EDE9DF]/75 font-light leading-relaxed mb-6 line-clamp-3">
                      {trip.description}
                    </p>
                  </div>

                  {/* Pricing & Seat Capacity */}
                  <div className="pt-5 border-t border-[#8C9A82]/20 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-[#EDE9DF]/50 font-mono block">Starting from</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-serif font-bold text-[#D4A96C]">
                            ₹{trip.price.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-[#EDE9DF]/60">/ person</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#EDE9DF]/50 font-mono block">Availability</span>
                        <span className="text-xs font-mono font-semibold text-emerald-400">
                          {trip.seatsAvailable} seats open
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: "View Details" and "Enquire" */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        onClick={() => onViewTripDetails(trip)}
                        className="py-3 px-3 rounded-xl bg-[#182622] hover:bg-[#182622]/80 text-[#EDE9DF] border border-[#8C9A82]/30 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D4A96C]" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => onEnquireTrip(trip)}
                        className="py-3 px-3 rounded-xl bg-[#D4A96C] hover:bg-[#d8b37c] text-[#182622] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enquire</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center bg-[#202522] rounded-[32px] border border-[#8C9A82]/20 p-8">
              <Search className="w-8 h-8 text-[#8C9A82] mx-auto mb-3" />
              <h4 className="text-lg font-serif text-[#EDE9DF] font-bold mb-1">No departures match your filter</h4>
              <p className="text-xs text-[#EDE9DF]/60 mb-4">Try clearing the status filter or raising the max budget slider.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setCollectionFilter("all");
                  setMaxBudget(30000);
                  if (onClearInitialFilter) onClearInitialFilter();
                }}
                className="px-4 py-2 rounded-xl bg-[#D4A96C] text-[#182622] font-semibold text-xs uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}