/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PACKAGES } from "../data";
import { Check, Star, Calculator, HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";
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
    <section id="packages" className="py-24 px-6 bg-white relative">
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-zinc-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto"
      >
        
        {/* Header Block */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-sm tracking-widest text-zinc-500 uppercase font-extrabold mb-2 block">
            Adventure Packages
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-4">
            Pick your <span className="text-zinc-500 font-medium">flavor</span> of roads
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            Three distinct travel hierarchies meticulously balanced with curated stays, comfortable vehicles, local naturalists, and pro media capturing.
          </p>
        </div>

        {/* Tiers Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-stretch">
          {PACKAGES.map((pkg) => {
            const isLoved = pkg.isMostLoved;
            
            return (
              <div
                key={pkg.id}
                className={`p-8 rounded-3xl flex flex-col justify-between relative transition-all duration-300 ${
                  isLoved
                    ? "bg-black text-white md:-translate-y-4 shadow-2xl border-2 border-yellow-500"
                    : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:border-zinc-400"
                }`}
              >
                {/* Visual badge highlight */}
                {isLoved && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                    Most Loved Choice
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight mb-2">
                    {pkg.name}
                  </h3>
                  <p className={`text-xs mb-8 font-medium ${isLoved ? "text-zinc-650" : "text-zinc-600"}`}>
                    {pkg.desc}
                  </p>
                  
                  {/* Big price display */}
                  <div className="mb-8">
                    <span className="text-3xl sm:text-4xl font-extrabold">
                      ₹{pkg.basePrice.toLocaleString()}
                    </span>
                    <span className={`text-xs ml-1 font-semibold ${isLoved ? "text-zinc-500" : "text-zinc-550"}`}>
                      + base fee / head
                    </span>
                  </div>

                  {/* Feature lists mapping */}
                  <ul className="space-y-4 mb-10 select-none">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-xs sm:text-sm">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isLoved ? "text-yellow-600 stroke-[3.5]" : "text-yellow-500 stroke-[2.5]"
                          }`}
                        />
                        <span className={isLoved ? "text-zinc-800 font-medium" : "text-zinc-700"}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#trips"
                  onClick={() => onSelectPackageForBooking(pkg.id)}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-all duration-200 ${
                    isLoved
                      ? "bg-black text-white hover:bg-zinc-200"
                      : "border border-zinc-200 hover:bg-white hover:text-black hover:border-white"
                  }`}
                >
                  Select and Explore Route
                </a>
              </div>
            );
          })}
        </div>

        {/* INTERACTIVE VALUE CALCULATOR BENCH */}
        <div className="relative bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
          
          {/* Subtle design grid overlay representing telemetry roadmap */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial bg-zinc-100/10 pointer-events-none border-l border-zinc-200/40 hidden lg:block"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-center">
            
            {/* Input Config Bench column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-black flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-yellow-500" />
                  Custom Caravan Pricing Estimator
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm mt-1">
                  Adjust group metrics and days to calculate real-time custom charter bookings.
                </p>
              </div>

              {/* Package selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-2">
                  1. Multi-tier Platform
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "explorer", label: "Explorer (₹4k)" },
                    { id: "adventure", label: "Adventure (₹9k)" },
                    { id: "premium-expedition", label: "Premium (₹14k)" },
                  ].map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setCalcTier(pkg.id)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold transition duration-200 border select-none ${
                        calcTier === pkg.id
                          ? "bg-black text-white border-white"
                          : "bg-zinc-100/50 text-zinc-600 border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      {pkg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Size and Duration slider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Travelers count */}
                <div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-2">
                    <span>2. Group scale (Headcount)</span>
                    <span className="text-black font-extrabold text-xs">{calcTravelers} Travelers</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    value={calcTravelers}
                    onChange={(e) => setCalcTravelers(Number(e.target.value))}
                    className="w-full accent-white h-1.5 bg-zinc-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-650 mt-1 uppercase font-bold select-none">
                    <span>Solo</span>
                    <span>16 Travelers (Max Pack)</span>
                  </div>
                </div>

                {/* Days count */}
                <div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-2">
                    <span>3. Journey length</span>
                    <span className="text-black font-extrabold text-xs">{calcDays} Days Caravan</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={calcDays}
                    onChange={(e) => setCalcDays(Number(e.target.value))}
                    className="w-full accent-white h-1.5 bg-zinc-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-650 mt-1 uppercase font-bold select-none">
                    <span>3 Days (Min)</span>
                    <span>12 Days</span>
                  </div>
                </div>
              </div>

              {/* Toggles features addons */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-2">
                  4. Bundled coverage upgrades
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div
                    onClick={() => setIncludeInsurance(!includeInsurance)}
                    className={`p-3 border rounded-xl cursor-pointer flex items-center gap-3 transition ${
                      includeInsurance ? "border-zinc-600 bg-zinc-100/60" : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border text-[9px] font-bold ${
                      includeInsurance ? "border-yellow-500 bg-yellow-500 text-black" : "border-zinc-400 text-transparent"
                    }`}>
                      {includeInsurance && "✔"}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-250 block">Accident & Medical Shield Cover</span>
                      <span className="text-[9px] text-zinc-500 block">Comprehensive mountain insurance + Rescue lift</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setIncludeMeals(!includeMeals)}
                    className={`p-3 border rounded-xl cursor-pointer flex items-center gap-3 transition ${
                      includeMeals ? "border-zinc-600 bg-zinc-100/60" : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border text-[9px] font-bold ${
                      includeMeals ? "border-yellow-500 bg-yellow-500 text-black" : "border-zinc-400 text-transparent"
                    }`}>
                      {includeMeals && "✔"}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-250 block">Full Local Culinary Board (Cuisine Upgrade)</span>
                      <span className="text-[9px] text-zinc-500 block">3 authentic meals per day inside local family shacks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price output bench column */}
            <div className="lg:col-span-5 bg-zinc-100/40 border border-zinc-200 p-6 sm:p-8 rounded-2.5xl text-center self-stretch flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold text-zinc-500 tracking-widest block mb-4">
                  Charters Quote Estimation
                </span>

                <div className="space-y-4 text-xs text-zinc-600 text-left border-b border-zinc-200 pb-5 mb-5">
                  <div className="flex justify-between">
                    <span>Selected base level:</span>
                    <span className="text-black font-bold">₹{basePricePerPerson.toLocaleString()}</span>
                  </div>
                  {extraDaysCount > 0 ? (
                    <div className="flex justify-between text-[11px]">
                      <span>Journey extensions ({extraDaysCount} extra days):</span>
                      <span className="text-black">+₹{extraDayCostPerPerson.toLocaleString()}</span>
                    </div>
                  ) : null}
                  {includeMeals && (
                    <div className="flex justify-between text-[11px]">
                      <span>Culinary board addon:</span>
                      <span className="text-black">+₹1,200</span>
                    </div>
                  )}
                  {includeInsurance && (
                    <div className="flex justify-between text-[11px]">
                      <span>Special medical shield:</span>
                      <span className="text-black">+₹450</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-zinc-200 text-black font-bold text-xs">
                    <span>Est. pricing / per traveler:</span>
                    <span className="text-yellow-500">₹{costPerPerson.toLocaleString()}</span>
                  </div>
                </div>

                <div className="py-2">
                  <span className="text-xs text-zinc-600 block uppercase tracking-wider font-semibold">
                    Estimated Combined Total
                  </span>
                  <span className="text-4xl sm:text-5xl font-extrabold text-black block mt-1 tracking-tight select-all">
                    ₹{overallTotal.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-1.5 font-medium">
                    *Quote subject to final seat vacancies and permits validation.
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="#trips"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white hover:bg-yellow-500 hover:text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-colors duration-200"
                >
                  Book Instant Scheduled Caravan
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
