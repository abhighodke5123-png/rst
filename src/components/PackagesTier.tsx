import React, { useState } from "react";
import { PACKAGES } from "../data";
import { PackageTier } from "../types";
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
    const pkg = PACKAGES.find((p: PackageTier) => p.id === calcTier);
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
    <section id="packages" className="py-32 px-6 bg-[#07080a] relative border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block font-display">
            Transparent Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display uppercase leading-tight">
            Expedition <span className="font-editorial text-amber-300 font-normal italic lowercase text-5xl sm:text-6xl md:text-7xl">Tier Standards</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-light">
            Three distinct travel tiers meticulously balanced with boutique heritage stays, seasoned 4x4 captains, local naturalists, and cinema-grade media capturing.
          </p>
        </div>

        {/* Tiers Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-stretch">
          {PACKAGES.map((pkg: PackageTier) => {
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
                    {pkg.features.map((feat: string) => (
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

                <button
                  onClick={() => onSelectPackageForBooking(pkg.name)}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-display ${
                    isLoved
                      ? "bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-500/20"
                      : "bg-white/10 hover:bg-white text-white hover:text-black"
                  }`}
                >
                  <span>Select {pkg.name.split(" ")[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
