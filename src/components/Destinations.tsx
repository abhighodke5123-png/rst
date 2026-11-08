import React, { useState } from "react";
import { DESTINATIONS } from "../data";
import { Destination } from "../types";
import { ArrowRight, Star, Compass, Sparkles, Calendar, Clock, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import TopographicOverlay from "./TopographicOverlay";

interface DestinationsProps {
  onSelectDestinationForDepartures: (destId: string) => void;
  onViewDestinationDetails?: (destId: string) => void;
}

export default function Destinations({
  onSelectDestinationForDepartures,
  onViewDestinationDetails
}: DestinationsProps) {
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Mountain", "Adventure", "Beach"];

  const filteredDestinations = filter === "All"
    ? DESTINATIONS
    : DESTINATIONS.filter((item) => item.category === filter);

  return (
    <section id="destinations" className="py-24 sm:py-32 px-6 relative bg-[#182622] overflow-hidden border-t border-[#8C9A82]/20">
      <TopographicOverlay opacity={0.03} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#202522] border border-[#8C9A82]/30 text-[#D4A96C] text-xs font-semibold uppercase tracking-widest mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>Handcrafted Circuits</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#EDE9DF] tracking-tight">
              Featured <span className="italic text-[#D4A96C]">Destinations</span>
            </h2>
            <p className="text-[#EDE9DF]/80 text-base sm:text-lg font-light leading-relaxed mt-4">
              From trans-Himalayan rain shadows to secluded Arabian Sea cliff trails, discover circuits designed for deep connection.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-1.5 p-1 rounded-2xl bg-[#202522] border border-[#8C9A82]/30 w-fit self-start md:self-end">
            {categories.map((cat) => {
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#D4A96C] text-[#182622] font-bold shadow-sm"
                      : "text-[#EDE9DF]/70 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((dest) => {
              const isSelect = dest.collectionDefault === "select";
              return (
                <motion.div
                  layout
                  key={dest.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className={`group relative overflow-hidden rounded-[32px] bg-[#202522] border flex flex-col h-full shadow-2xl transition-all duration-300 hover:-translate-y-1.5 ${
                    isSelect
                      ? "border-[#D4A96C]/40 hover:border-[#D4A96C]"
                      : "border-[#8C9A82]/25 hover:border-[#8C9A82]/60"
                  }`}
                >
                  {/* Image & Vignette */}
                  <div className="h-72 overflow-hidden relative">
                    <img
                      alt={dest.name}
                      src={dest.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#202522] via-[#202522]/40 to-transparent" />

                    {/* Collection Tag */}
                    <div className="absolute top-5 left-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                        isSelect
                          ? "bg-[#D4A96C] text-[#182622]"
                          : "bg-[#8C9A82] text-[#182622]"
                      }`}>
                        {isSelect ? "RAASTA SELECT" : "RAASTA EXPLORE"}
                      </span>
                    </div>

                    {/* Season Tag */}
                    <div className="absolute top-5 right-5 bg-[#182622]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-[#D4A96C] border border-[#8C9A82]/30">
                      {dest.season}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-7 flex flex-col flex-1 justify-between relative z-10 -mt-10">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-2xl sm:text-3xl font-serif text-[#EDE9DF] font-bold tracking-tight">
                          {dest.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-[#D4A96C] font-mono font-semibold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{dest.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#D4A96C] font-semibold uppercase tracking-wider mb-3">
                        {dest.subTitle}
                      </p>

                      <p className="text-xs sm:text-sm text-[#EDE9DF]/75 font-light leading-relaxed mb-6 line-clamp-3">
                        {dest.desc}
                      </p>

                      {/* Attractions Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {dest.attractions.slice(0, 3).map((attr, aIdx) => (
                          <span
                            key={aIdx}
                            className="px-2 py-0.5 rounded-md bg-[#182622] text-[10px] font-mono text-[#EDE9DF]/80 border border-[#8C9A82]/20"
                          >
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Footer Actions */}
                    <div className="pt-5 border-t border-[#8C9A82]/20 space-y-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-[#EDE9DF]/50 font-mono block">{dest.duration}</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-serif font-bold text-[#D4A96C]">
                              ₹{dest.price.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-[#EDE9DF]/60">/ person</span>
                          </div>
                        </div>

                        {dest.originalPrice && (
                          <span className="text-xs text-[#EDE9DF]/40 line-through font-mono">
                            ₹{dest.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => {
                            if (onViewDestinationDetails) {
                              onViewDestinationDetails(dest.id);
                            } else {
                              onSelectDestinationForDepartures(dest.id);
                            }
                          }}
                          className="py-3 px-3 rounded-xl bg-[#182622] hover:bg-[#182622]/80 text-[#EDE9DF] border border-[#8C9A82]/30 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D4A96C]" />
                          <span>View Route</span>
                        </button>

                        <button
                          onClick={() => onSelectDestinationForDepartures(dest.id)}
                          className="py-3 px-3 rounded-xl bg-[#D4A96C] hover:bg-[#d8b37c] text-[#182622] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <span>Departures</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}