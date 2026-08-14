/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PACKAGES } from "../data";
import { Check, Star, Calculator, HelpCircle, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PackagesTierProps {
  onSelectPackageForBooking: (tierName: string) => void;
}

export default function PackagesTier({ onSelectPackageForBooking }: PackagesTierProps) {
  // Calculator interactive state
  const [calcTier, setCalcTier] = useState("adventure");
  const [calcTravelers, setCalcTravelers] = useState(2);
  const [calcDays, setCalcDays] = useState(4);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [includeMeals, setIncludeMeals] = useState(true);

  // Math variables
  const getCalcBasePrice = () => {
    const pkg = PACKAGES.find((p) => p.id === calcTier);
    return pkg ? pkg.basePrice : 9999;
  };

  const basePricePerPerson = getCalcBasePrice();
  // Extra day scaling cost: 10% of base price per day beyond 3 days
  const extraDaysCount = calcDays > 3 ? calcDays - 3 : 0;
  const extraDayCostPerPerson = Math.floor(basePricePerPerson * 0.12) * extraDaysCount;
  
  const insurancePrice = includeInsurance ? 450 : 0;
  const premiumFoodPrice = includeMeals ? 1200 : 0;

  const costPerPerson = basePricePerPerson + extraDayCostPerPerson + insurancePrice + premiumFoodPrice;
  const overallTotal = costPerPerson * calcTravelers;

  return (
    <section id="packages" className="py-32 px-6 bg-[#07080a] relative overflow-hidden">
      <div className="absolute left-0 bottom-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header Block */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <span className="text-xs tracking-widest text-amber-400 uppercase font-bold mb-3 block font-display">
            Expedition Tiers
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight font-display">
            Pick your <span className="font-editorial text-amber-300 font-normal italic text-5xl sm:text-6xl md:text-7xl">flavor</span> of the road
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-light">
            Three distinct travel tiers meticulously balanced with boutique heritage stays, seasoned 4x4 captains, local naturalists, and cinema-grade media capturing.
          </p>
        </div>

        {/* Tiers Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-stretch">
          {PACKAGES.map((pkg) => {
            const isLoved = pkg.isMostLoved;
            
            return (
              <div
                key={pkg.id}
                className={`p-8 sm:p-10 rounded-[32px] flex flex-col justify-between relative transition-all duration-300 ${
                  isLoved
                    ? "glass bg-gradient-to-b from-[#181a24] to-[#0d0f14] md:-translate-y-4 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.2)] border-2 border-amber-400/50"
                    : "glass border border-white/10 hover:border-white/20 hover:-translate-y-1"
                }`}
              >
                {/* Visual badge highlight */}
                {isLoved && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Loved Tier</span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
                      {pkg.name}
                    </h3>
                  </div>
                  
                  <p className="text-xs text-zinc-400 mb-8 font-light leading-relaxed">
                    {pkg.desc}
                  </p>
                  
                  {/* Big price display */}
                  <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-white font-display">
                        ₹{pkg.basePrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        / traveler
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                      Includes stays, transfers & captain
                    </span>
                  </div>

                  {/* Feature lists mapping */}
                  <ul className="space-y-3.5 mb-10 select-none">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-xs sm:text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isLoved ? "bg-amber-400/20 text-amber-400" : "bg-white/10 text-zinc-300"
                        }`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className={isLoved ? "text-zinc-200 font-medium" : "text-zinc-400 font-light"}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#trips"
                  onClick={() => onSelectPackageForBooking(pkg.id)}
                  className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-center transition-all duration-300 block cursor-pointer ${
                    isLoved
                      ? "bg-amber-400 text-black hover:bg-amber-300 shadow-lg shadow-amber-500/20"
                      : "bg-white/10 text-white hover:bg-white hover:text-black border border-white/10"
                  }`}
                >
                  Select & Explore Routes
                </a>
              </div>
            );
          })}
        </div>

        {/* INTERACTIVE VALUE CALCULATOR BENCH */}
        <div className="relative glass border border-white/10 rounded-[36px] p-6 sm:p-12 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 items-center">
            
            {/* Input Config Bench column */}
            <div className="lg:col-span-7 space-y-7">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                    Custom Expedition Estimator
                  </h3>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm font-light">
                  Tailor your group size and duration to receive instant real-time quotes for private charters.
                </p>
              </div>

              {/* Package selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-2.5">
                  1. Multi-Tier Platform
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "explorer", label: "Explorer", price: "₹4,999" },
                    { id: "adventure", label: "Adventure", price: "₹9,999" },
                    { id: "premium-expedition", label: "Premium", price: "₹14,999" },
                  ].map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setCalcTier(pkg.id)}
                      className={`p-3 rounded-2xl text-left transition duration-200 border select-none cursor-pointer ${
                        calcTier === pkg.id
                          ? "bg-amber-400/15 text-white border-amber-400/60 shadow-lg shadow-amber-500/10"
                          : "bg-white/5 text-zinc-400 border-white/5 hover:border-white/15"
                      }`}
                    >
                      <span className="block text-xs font-bold text-white">{pkg.label}</span>
                      <span className="block text-[10px] text-zinc-400 mt-0.5">{pkg.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Size and Duration slider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Travelers count */}
                <div className="glass p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-3">
                    <span>2. Group Headcount</span>
                    <span className="text-amber-400 font-black text-xs font-display">{calcTravelers} Travelers</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    value={calcTravelers}
                    onChange={(e) => setCalcTravelers(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-500 mt-2 uppercase font-bold select-none">
                    <span>Solo (1)</span>
                    <span>16 Travelers (Max)</span>
                  </div>
                </div>

                {/* Days count */}
                <div className="glass p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-3">
                    <span>3. Journey Length</span>
                    <span className="text-amber-400 font-black text-xs font-display">{calcDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={calcDays}
                    onChange={(e) => setCalcDays(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-500 mt-2 uppercase font-bold select-none">
                    <span>3 Days (Min)</span>
                    <span>12 Days (Full)</span>
                  </div>
                </div>
              </div>

              {/* Toggles features addons */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-2.5">
                  4. Bundled Coverage Upgrades
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div
                    onClick={() => setIncludeInsurance(!includeInsurance)}
                    className={`p-3.5 border rounded-2xl cursor-pointer flex items-center gap-3 transition ${
                      includeInsurance ? "border-amber-400/50 bg-amber-400/10" : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border text-[9px] font-bold ${
                      includeInsurance ? "border-amber-400 bg-amber-400 text-black" : "border-zinc-500 text-transparent"
                    }`}>
                      {includeInsurance && "✔"}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-200 block">Accident & Medical Shield</span>
                      <span className="text-[10px] text-zinc-400 block font-light">Mountain insurance + rescue evacuation</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setIncludeMeals(!includeMeals)}
                    className={`p-3.5 border rounded-2xl cursor-pointer flex items-center gap-3 transition ${
                      includeMeals ? "border-amber-400/50 bg-amber-400/10" : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border text-[9px] font-bold ${
                      includeMeals ? "border-amber-400 bg-amber-400 text-black" : "border-zinc-500 text-transparent"
                    }`}>
                      {includeMeals && "✔"}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-200 block">Culinary Board Upgrade</span>
                      <span className="text-[10px] text-zinc-400 block font-light">3 authentic meals/day in local stays</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price output bench column */}
            <div className="lg:col-span-5 glass bg-gradient-to-b from-[#181a24] to-[#0d0f14] border border-white/10 p-8 rounded-[30px] text-center self-stretch flex flex-col justify-between shadow-2xl">
              <div>
                <span className="text-xs uppercase font-black text-amber-400 tracking-widest block mb-6 font-display">
                  Live Custom Quote
                </span>

                <div className="space-y-3.5 text-xs text-zinc-400 text-left border-b border-white/10 pb-6 mb-6 font-light">
                  <div className="flex justify-between">
                    <span>Base Tier Rate:</span>
                    <span className="text-white font-semibold">₹{basePricePerPerson.toLocaleString()}</span>
                  </div>
                  {extraDaysCount > 0 && (
                    <div className="flex justify-between text-[11px]">
                      <span>Extended Journey ({extraDaysCount} extra days):</span>
                      <span className="text-white">+₹{extraDayCostPerPerson.toLocaleString()}</span>
                    </div>
                  )}
                  {includeMeals && (
                    <div className="flex justify-between text-[11px]">
                      <span>Culinary Board:</span>
                      <span className="text-white">+₹1,200</span>
                    </div>
                  )}
                  {includeInsurance && (
                    <div className="flex justify-between text-[11px]">
                      <span>Medical Protection:</span>
                      <span className="text-white">+₹450</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-white/10 text-white font-bold text-xs">
                    <span>Per Traveler Estimate:</span>
                    <span className="text-amber-400 font-display font-bold">₹{costPerPerson.toLocaleString()}</span>
                  </div>
                </div>

                <div className="py-2">
                  <span className="text-xs text-zinc-400 block uppercase tracking-wider font-semibold">
                    Total Estimated Group Cost
                  </span>
                  <span className="text-4xl sm:text-5xl font-black text-white block mt-2 tracking-tight font-display">
                    ₹{overallTotal.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-2 font-light">
                    *Taxes and permit costs calculated at checkout.
                  </span>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="#trips"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black hover:bg-amber-300 font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl cursor-pointer"
                >
                  <span>Book Scheduled Caravan</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
