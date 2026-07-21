/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DESTINATIONS } from "../data";
import { Destination } from "../types";
import { Compass, Calendar, ArrowRight, Star, CheckCircle, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DestinationsProps {
  onSelectDestinationForDepartures: (destId: string) => void;
}

export default function Destinations({ onSelectDestinationForDepartures }: DestinationsProps) {
  const [filter, setFilter] = useState<string>("All");
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  const categories = ["All", "Beach", "Mountain", "Adventure"];

  const filteredDestinations = filter === "All"
    ? DESTINATIONS
    : DESTINATIONS.filter((item) => item.category === filter);

  return (
    <section id="destinations" className="py-32 px-6 relative bg-brand-bg">
      {/* Visual Accent */}
      <div className="absolute right-0 top-1/4 w-[50vw] h-[50vw] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Destinations that <br/>
              <span className="text-zinc-500">stay with you.</span>
            </h2>
          </div>

          {/* Luxury Filter Toggle */}
          <div className="flex gap-2 glass p-2 rounded-2xl w-fit self-start md:self-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 ${
                  filter === cat
                    ? "bg-white text-black shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((dest) => (
              <motion.div
                layout
                key={dest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-[32px] glass flex flex-col h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(76,201,240,0.15)]"
              >
                {/* Custom Card Header Image */}
                <div className="h-72 overflow-hidden relative">
                  <img
                    alt={dest.name}
                    src={dest.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Glass Tags */}
                  <div className="absolute top-5 left-5 glass px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-white">
                    {dest.category}
                  </div>
                  <div className="absolute top-5 right-5 glass px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-white">
                    {dest.season}
                  </div>

                  {/* Gradient layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent opacity-90"></div>
                </div>

                {/* Substantive body details */}
                <div className="p-8 flex flex-col flex-1 justify-between relative z-10 -mt-20">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-3xl font-bold text-white tracking-tight">
                        {dest.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mb-1 bg-white/10 px-2 py-1 rounded-md backdrop-blur-md">
                        <Star className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                        <span className="text-xs font-bold text-white">{dest.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-brand-blue text-sm font-medium mb-4">
                      {dest.subTitle}
                    </p>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-light">
                      {dest.desc}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Price, duration and trigger link */}
                    <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-zinc-500 font-medium mb-1">
                          {dest.duration}
                        </div>
                        <div className="text-xl font-bold text-white flex items-baseline gap-2">
                          {dest.originalPrice && (
                            <span className="text-sm text-zinc-500 line-through font-normal">
                              ₹{dest.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span>₹{dest.price.toLocaleString()}</span>
                          <span className="text-xs text-zinc-500 font-normal">/person</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedDest(dest)}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 transition-colors group-hover:scale-110 duration-300"
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
      </motion.div>

      {/* EXPANDED DESTINATION POP-UP SHEET MODAL */}
      <AnimatePresence>
        {selectedDest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop lock */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDest(null)}
              className="absolute inset-0 bg-[#080808]/80 backdrop-blur-xl"
            ></motion.div>

            {/* Modal Sheet Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-[#0F0F0F] border border-white/10 rounded-[32px] overflow-hidden w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto z-10 custom-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDest(null)}
                className="absolute top-6 right-6 glass p-3 rounded-full hover:bg-white/20 transition text-white z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Banner visual */}
              <div className="relative h-72 sm:h-96 w-full">
                <img
                  alt={selectedDest.name}
                  src={selectedDest.image}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/50 to-transparent"></div>
                
                {/* Visual tags overlay */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="inline-block px-4 py-1.5 glass text-white text-xs font-semibold rounded-full mb-4">
                    {selectedDest.category} Route
                  </div>
                  <h3 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
                    {selectedDest.name}
                  </h3>
                  <p className="text-brand-blue text-sm sm:text-base font-medium mt-2">
                    {selectedDest.subTitle}
                  </p>
                </div>
              </div>

              {/* Comprehensive Details Content Section */}
              <div className="p-8 sm:p-10 space-y-10">
                <div>
                  <h4 className="text-sm text-zinc-500 font-medium mb-3">Overview</h4>
                  <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-light">
                    {selectedDest.longDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  {/* Core Logistics Column */}
                  <div className="glass p-6 rounded-[24px] flex flex-col justify-between">
                    <div className="space-y-5">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-sm text-zinc-400">Season</span>
                        <span className="text-sm font-semibold text-white">{selectedDest.season}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-sm text-zinc-400">Duration</span>
                        <span className="text-sm font-semibold text-white">{selectedDest.duration}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3">
                        <span className="text-sm text-zinc-400">Rating</span>
                        <span className="text-sm font-semibold text-brand-orange flex items-center gap-1">
                          {selectedDest.rating} <Star className="w-3 h-3 fill-current" />
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-white/5">
                      <div className="text-xs text-zinc-500 mb-2">Base Cost Plan</div>
                      <div className="flex items-baseline gap-2">
                        {selectedDest.originalPrice && (
                          <span className="text-zinc-500 line-through text-lg font-normal mr-2">
                            ₹{selectedDest.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-white">
                          ₹{selectedDest.price.toLocaleString()}
                        </span>
                        <span className="text-zinc-550 text-sm">/ person</span>
                      </div>
                    </div>
                  </div>

                  {/* Handcrafted Highlights column */}
                  <div>
                    <h4 className="text-sm text-zinc-500 font-medium mb-4">Highlights</h4>
                    <ul className="space-y-4">
                      {selectedDest.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-3 text-sm text-zinc-300 font-light">
                          <CheckCircle className="w-5 h-5 text-brand-emerald shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Confirm Route departures action */}
                <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row gap-6 items-center justify-between">
                  <div className="text-zinc-500 text-sm font-light text-center sm:text-left max-w-md">
                    Taxes and safety permits included. Limited seats to protect environment footprint.
                  </div>
                  <button
                    onClick={() => {
                      onSelectDestinationForDepartures(selectedDest.id);
                      setSelectedDest(null);
                    }}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3"
                  >
                    View Departures
                    <ArrowRight className="w-5 h-5" />
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
