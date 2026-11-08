/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DESTINATIONS } from "../data";
import { Destination } from "../types";
import { ArrowRight, Star, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import TopographicOverlay from "./TopographicOverlay";

interface DestinationsProps {
  onSelectDestinationForDepartures: (destId: string) => void;
}

export default function Destinations({ onSelectDestinationForDepartures }: DestinationsProps) {
  const [filter, setFilter] = useState<string>("All");
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  const categories = ["All", "Mountain", "Adventure", "Beach"];

  const filteredDestinations = filter === "All"
    ? DESTINATIONS
    : DESTINATIONS.filter((item) => item.category === filter);

  return (
    <section id="destinations" className="py-32 px-6 relative bg-[#07080a] overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Block with Editorial Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-xs tracking-widest text-amber-400 uppercase font-bold mb-3 block font-mono">
              [ 01 // EXPEDITION CORRIDORS ]
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-display leading-[1.08] uppercase">
              Curated Circuits <br />
              <span className="font-editorial text-amber-300 font-normal italic lowercase text-5xl sm:text-6xl md:text-7xl tracking-normal">
                that stay with you.
              </span>
            </h2>
          </div>

          {/* Motion Filter Toggle with layoutId animated pill */}
          <div className="flex gap-1.5 glass p-1.5 rounded-2xl w-fit self-start md:self-end border border-white/10">
            {categories.map((cat) => {
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`relative px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[44px] ${
                    isActive ? "text-black font-black" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="categoryActivePill"
                      className="absolute inset-0 rounded-xl bg-amber-400 shadow-lg shadow-amber-500/20"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Grid Layout with spring motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((dest) => (
              <motion.div
                layout
                key={dest.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-[32px] bg-[#0b0c10] border border-white/10 flex flex-col h-full hover:border-amber-400/40 hover:shadow-[0_20px_45px_-15px_rgba(245,158,11,0.18)]"
              >
                {/* Subtle topographic card pattern */}
                <TopographicOverlay opacity={0.03} />

                {/* Custom Card Header Image */}
                <div className="h-72 overflow-hidden relative">
                  <img
                    alt={dest.name}
                    src={dest.image}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Clean Tags */}
                  <div className="absolute top-5 left-5 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 font-mono">
                    {dest.category} Route
                  </div>
                  <div className="absolute top-5 right-5 bg-amber-400/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/40 font-mono">
                    {dest.season}
                  </div>

                  {/* Gradient layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/60 to-transparent opacity-95"></div>
                </div>

                {/* Body Details */}
                <div className="p-8 flex flex-col flex-1 justify-between relative z-10 -mt-20">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-3xl font-black text-white tracking-tight font-display">
                        {dest.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mb-1 bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg backdrop-blur-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-black text-white font-display">{dest.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
                      {dest.subTitle}
                    </p>
                    <p className="text-zinc-300 text-sm leading-relaxed mb-8 font-light line-clamp-2">
                      {dest.desc}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Price, duration and trigger link */}
                    <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold mb-1">
                          {dest.duration}
                        </div>
                        <div className="text-2xl font-black text-white font-display flex items-baseline gap-2">
                          {dest.originalPrice && (
                            <span className="text-sm text-zinc-400 line-through font-normal">
                              ₹{dest.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span>₹{dest.price.toLocaleString()}</span>
                          <span className="text-xs text-zinc-400 font-normal font-sans">/person</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedDest(dest)}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-amber-300 transition-all duration-300 group-hover:scale-105 shadow-lg cursor-pointer min-h-[44px] min-w-[44px]"
                        title="View Route Details"
                        aria-label={`View details for ${dest.name}`}
                      >
                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* EXPANDED DESTINATION POP-UP SHEET MODAL */}
      <AnimatePresence>
        {selectedDest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDest(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative bg-[#0d0f14] border border-white/15 rounded-[36px] overflow-hidden w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto z-10"
            >
              <button
                onClick={() => setSelectedDest(null)}
                aria-label="Close dialog"
                className="absolute top-6 right-6 glass p-3 rounded-full hover:bg-white/20 transition text-white z-20 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-72 sm:h-96 w-full">
                <img
                  alt={selectedDest.name}
                  src={selectedDest.image}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-[#0d0f14]/50 to-transparent"></div>
                
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="inline-block px-4 py-1.5 glass text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-white/20">
                    {selectedDest.category} Route
                  </div>
                  <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display">
                    {selectedDest.name}
                  </h3>
                  <p className="text-amber-300 text-sm sm:text-base font-semibold mt-2">
                    {selectedDest.subTitle}
                  </p>
                </div>
              </div>

              <div className="p-8 sm:p-10 space-y-10">
                <div>
                  <h4 className="text-xs uppercase font-bold text-amber-400 tracking-widest mb-3 font-display">Overview</h4>
                  <p className="text-zinc-200 text-base sm:text-lg leading-relaxed font-light">
                    {selectedDest.longDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                  <div className="glass p-6 rounded-[24px] flex flex-col justify-between border border-white/10">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/10 pb-3">
                        <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Best Season</span>
                        <span className="text-sm font-bold text-white">{selectedDest.season}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-3">
                        <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Duration</span>
                        <span className="text-sm font-bold text-white">{selectedDest.duration}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3">
                        <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Rating</span>
                        <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                          {selectedDest.rating} <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-white/10">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-1">Standard All-Inclusive</div>
                      <div className="flex items-baseline gap-2">
                        {selectedDest.originalPrice && (
                          <span className="text-zinc-400 line-through text-base font-normal mr-1">
                            ₹{selectedDest.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-3xl font-black text-white font-display">
                          ₹{selectedDest.price.toLocaleString()}
                        </span>
                        <span className="text-zinc-300 text-xs">/ person</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase font-bold text-amber-400 tracking-widest mb-4 font-display">Expedition Highlights</h4>
                    <ul className="space-y-3.5">
                      {selectedDest.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-200 font-light">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-6 items-center justify-between">
                  <div className="text-zinc-300 text-xs font-light text-center sm:text-left max-w-md">
                    Includes permits, stays, transfers, and seasoned expedition captains. Microgroup capped at 14 travelers.
                  </div>
                  <button
                    onClick={() => {
                      onSelectDestinationForDepartures(selectedDest.id);
                      setSelectedDest(null);
                    }}
                    className="w-full sm:w-auto px-8 py-4 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-full hover:bg-amber-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl cursor-pointer min-h-[44px]"
                  >
                    <span>View Scheduled Batches</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
