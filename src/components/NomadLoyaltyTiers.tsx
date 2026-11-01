/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Booking } from "../types";
import {
  Compass,
  Mountain,
  Crown,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  Award,
  MapPin,
  TrendingUp,
  FileCheck2,
  Luggage,
  Users,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import TopographicOverlay from "./TopographicOverlay";

export type NomadTierId = "explorer" | "wanderer" | "legend";

export interface NomadTierConfig {
  id: NomadTierId;
  name: string;
  subtitle: string;
  minTrips: number;
  maxTrips: number | null;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
  glowColor: string;
  discountCode: string | null;
  discountRate: string | null;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  perks: {
    title: string;
    desc: string;
    highlight?: boolean;
  }[];
}

export const NOMAD_TIERS: NomadTierConfig[] = [
  {
    id: "explorer",
    name: "Explorer",
    subtitle: "The First Step on the High Road",
    minTrips: 0,
    maxTrips: 1,
    accentColor: "from-amber-500/20 to-amber-700/10",
    borderColor: "border-amber-500/30",
    badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    textColor: "text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.15)",
    discountCode: null,
    discountRate: "Standard Tier Rates",
    icon: Compass,
    tagline: "Every grand expedition begins with the willingness to leave the paved highway behind.",
    perks: [
      {
        title: "Secret Departure Drop Alerts",
        desc: "48-hour early notice on unreleased winter, autumn, and monsoon slots."
      },
      {
        title: "24/7 Route Captain Emergency Relay",
        desc: "Direct satellite / SOS coordination via captain pack network on every trip."
      },
      {
        title: "Digital Nomad Passport",
        desc: "Personal verified record of passed ridges, summits, and coastal waypoints."
      },
      {
        title: "Official RAASTA Trail Enamel Pin",
        desc: "Handcrafted physical expedition pin gifted on completion of your 1st voyage."
      }
    ]
  },
  {
    id: "wanderer",
    name: "Wanderer",
    subtitle: "Mountain Pass & Coastal Trail Pilgrim",
    minTrips: 2,
    maxTrips: 4,
    accentColor: "from-emerald-500/20 to-teal-700/10",
    borderColor: "border-emerald-500/40",
    badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    textColor: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.18)",
    discountCode: "NOMAD-WANDERER-5",
    discountRate: "5% Lifetime Credit",
    icon: Mountain,
    tagline: "You know the quiet magic of cold dawn air, high-altitude passes, and shared campfires.",
    perks: [
      {
        title: "5% Lifetime Loyalty Credit",
        desc: "Applied automatically on all future road trip bookings across India.",
        highlight: true
      },
      {
        title: "Priority Co-Driver / Panoramic Seat",
        desc: "Guaranteed front / window cabin seat priority on long cruiser runs."
      },
      {
        title: "Complimentary Pro Photo Pack (₹2,500 value)",
        desc: "Full uncompressed RAW & edited gallery captured by our trail media artist."
      },
      {
        title: "Captains' Scouting WhatsApp Circle",
        desc: "Direct access to private captain discussions and insider road condition updates."
      }
    ]
  },
  {
    id: "legend",
    name: "Legend",
    subtitle: "Master of Passes & Trail Vanguard",
    minTrips: 5,
    maxTrips: null,
    accentColor: "from-amber-400/25 via-yellow-500/15 to-amber-700/20",
    borderColor: "border-amber-400/50",
    badgeBg: "bg-amber-400/20 text-amber-200 border-amber-400/50 shadow-lg shadow-amber-500/20",
    textColor: "text-amber-300",
    glowColor: "rgba(251, 191, 36, 0.25)",
    discountCode: "RAASTA-LEGEND-10",
    discountRate: "10% Lifetime Rebate",
    icon: Crown,
    tagline: "A true master of the subcontinent's wildest contours, trusted by our veteran captains.",
    perks: [
      {
        title: "10% Lifetime Rebate on Every Journey",
        desc: "Maximum community discount on all small-pack departures and custom packages.",
        highlight: true
      },
      {
        title: "Complimentary Boutique Suite Upgrade",
        desc: "Free upgrade to heritage river suites and luxury glamping tents where available.",
        highlight: true
      },
      {
        title: "First-Seat Pilot on Uncharted Routes",
        desc: "Invitation to test inaugural pilot expeditions before public release (Zanskar, Tawang)."
      },
      {
        title: "Annual Spiti Campfire Summit Invitation",
        desc: "All-expenses-covered annual gathering with founders, photographers, and lead captains."
      },
      {
        title: "Dedicated 1-on-1 Route Concierge",
        desc: "Direct phone line to our head route architect for bespoke itinerary creation."
      }
    ]
  }
];

interface NomadLoyaltyTiersProps {
  bookings: Booking[];
  userName: string;
  userEmail: string;
  onExploreDepartures?: () => void;
}

export default function NomadLoyaltyTiers({
  bookings,
  userName,
  userEmail,
  onExploreDepartures
}: NomadLoyaltyTiersProps) {
  const confirmedCount = bookings.length;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedTierTab, setSelectedTierTab] = useState<NomadTierId>(
    confirmedCount >= 5 ? "legend" : confirmedCount >= 2 ? "wanderer" : "explorer"
  );
  const [showPassportCard, setShowPassportCard] = useState(false);

  // Determine current tier
  const currentTier: NomadTierConfig =
    confirmedCount >= 5
      ? NOMAD_TIERS[2]
      : confirmedCount >= 2
      ? NOMAD_TIERS[1]
      : NOMAD_TIERS[0];

  // Calculate progress toward next tier
  let progressPercent = 0;
  let nextTier: NomadTierConfig | null = null;
  let tripsRemaining = 0;

  if (confirmedCount < 2) {
    nextTier = NOMAD_TIERS[1]; // Wanderer (at 2)
    progressPercent = Math.min(100, Math.round((confirmedCount / 2) * 100));
    tripsRemaining = 2 - confirmedCount;
  } else if (confirmedCount < 5) {
    nextTier = NOMAD_TIERS[2]; // Legend (at 5)
    progressPercent = Math.min(100, Math.round(((confirmedCount - 2) / 3) * 100));
    tripsRemaining = 5 - confirmedCount;
  } else {
    nextTier = null;
    progressPercent = 100;
    tripsRemaining = 0;
  }

  // Calculate distance & trail statistics
  const totalTravelersLed = bookings.reduce((acc, b) => acc + (b.numTravelers || 1), 0);
  const totalAmountSpent = bookings.reduce((acc, b) => acc + (b.totalCost || 0), 0);
  const nomadTrailPoints = Math.round(totalAmountSpent / 10);

  // Estimate distance explored based on destination types
  const estimatedTrailKm = bookings.reduce((sum, b) => {
    const lower = (b.tripName || "").toLowerCase();
    if (lower.includes("spiti")) return sum + 1350;
    if (lower.includes("ladakh") || lower.includes("nubra")) return sum + 1600;
    if (lower.includes("meghalaya")) return sum + 1100;
    if (lower.includes("gokarna")) return sum + 750;
    if (lower.includes("goa")) return sum + 620;
    return sum + 850;
  }, 0);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const activeTabConfig = NOMAD_TIERS.find((t) => t.id === selectedTierTab) || currentTier;
  const isSelectedTierUnlocked =
    selectedTierTab === "explorer" ||
    (selectedTierTab === "wanderer" && confirmedCount >= 2) ||
    (selectedTierTab === "legend" && confirmedCount >= 5);

  return (
    <div className="bg-[#0b0c10] border border-white/10 rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      {/* Subtle cartographic vector lines */}
      <TopographicOverlay opacity={0.03} />

      {/* Ambient background glow matching active tier */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentTier.glowColor }}
      />

      {/* 1. Header & Current Status */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-medium mb-1.5">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px] font-mono">
              RAASTA Nomad Club
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-300">Voyager Loyalty Standing</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight flex items-center gap-3">
              <span>Tier:</span>
              <span className={`bg-gradient-to-r ${currentTier.id === "legend" ? "from-amber-300 via-yellow-400 to-amber-500" : currentTier.id === "wanderer" ? "from-emerald-300 to-teal-400" : "from-amber-400 to-amber-200"} bg-clip-text text-transparent`}>
                {currentTier.name}
              </span>
            </h2>

            <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 font-display ${currentTier.badgeBg}`}>
              <currentTier.icon className="w-3.5 h-3.5" />
              <span>{currentTier.subtitle}</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 mt-2 max-w-xl font-light leading-relaxed">
            {currentTier.tagline}
          </p>
        </div>

        {/* Passport / Pass Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowPassportCard(!showPassportCard)}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer font-display"
          >
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            <span>{showPassportCard ? "Hide Nomad Stamp" : "Digital Nomad Stamp"}</span>
          </button>

          {onExploreDepartures && (
            <button
              onClick={onExploreDepartures}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 font-display"
            >
              <span>Book Next Run</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Passport Stamp Drawer / Card (Animated toggle) */}
      <AnimatePresence>
        {showPassportCard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="my-6 p-6 sm:p-7 rounded-3xl bg-[#07080a] border border-amber-400/30 relative shadow-2xl">
              <TopographicOverlay opacity={0.05} />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-amber-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified High-Altitude Passage Stamp · No. RAA-{(userEmail || "user").slice(0, 6).toUpperCase()}</span>
                  </div>
                  <h3 className="text-xl font-black text-white font-display">
                    {userName || "RAASTA Voyager"}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                    <span>Rank: <strong className="text-white font-medium">{currentTier.name}</strong></span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span>Verified Bookings: <strong className="text-amber-400 font-mono tabular-nums">{confirmedCount}</strong></span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span>Trail Mileage: <strong className="text-white font-mono tabular-nums">~{estimatedTrailKm.toLocaleString()} KM</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-amber-400/40 bg-amber-400/10 text-center font-display shrink-0 min-w-44">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-black mx-auto flex items-center justify-center mb-2 shadow-md">
                    <currentTier.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-amber-400 block uppercase">Official Stamp</span>
                  <span className="text-xs font-black text-white block uppercase tracking-wide mt-0.5">
                    {currentTier.name} Vanguard
                  </span>
                  <span className="text-[9px] text-zinc-400 block mt-1 font-mono">Issued 2026 Season</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Progress Track & Next Tier Milestone */}
      <div className="relative z-10 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-300 font-medium">Milestone Progression:</span>
            <span className="text-amber-400 font-mono font-bold tabular-nums">
              {confirmedCount} {confirmedCount === 1 ? "expedition" : "expeditions"} completed
            </span>
          </div>

          <div className="text-xs text-zinc-400 font-light">
            {nextTier ? (
              <span>
                <strong className="text-white font-semibold font-mono tabular-nums">{tripsRemaining}</strong> more{" "}
                {tripsRemaining === 1 ? "journey" : "journeys"} to reach{" "}
                <span className={`font-bold ${nextTier.textColor}`}>{nextTier.name}</span> ({nextTier.discountRate})
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1.5 font-display">
                <Crown className="w-3.5 h-3.5" />
                Apex Tier Reached · Lifetime Legend Status
              </span>
            )}
          </div>
        </div>

        {/* Interactive Progress Bar with Milestones */}
        <div className="relative py-4">
          {/* Track line background */}
          <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width:
                  confirmedCount >= 5
                    ? "100%"
                    : confirmedCount >= 2
                    ? `${40 + ((confirmedCount - 2) / 3) * 60}%`
                    : `${(confirmedCount / 2) * 40}%`
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${
                confirmedCount >= 5
                  ? "from-amber-500 via-yellow-400 to-amber-300"
                  : confirmedCount >= 2
                  ? "from-emerald-500 to-teal-400"
                  : "from-amber-500 to-amber-300"
              }`}
            />
          </div>

          {/* 3 Milestone Node Pins */}
          <div className="flex justify-between items-center -mt-4 relative">
            {/* Explorer Node (0) */}
            <div className="flex flex-col items-start text-left">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  confirmedCount >= 0
                    ? "bg-amber-400 border-black text-black"
                    : "bg-[#0b0c10] border-white/30 text-zinc-600"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-[11px] font-bold text-white mt-1.5 font-display">Explorer</span>
              <span className="text-[9px] font-mono text-zinc-500">0 - 1 trips</span>
            </div>

            {/* Wanderer Node (2) */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  confirmedCount >= 2
                    ? "bg-emerald-400 border-black text-black"
                    : "bg-[#0b0c10] border-white/30 text-zinc-600"
                }`}
              >
                {confirmedCount >= 2 ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                )}
              </div>
              <span className={`text-[11px] font-bold mt-1.5 font-display ${confirmedCount >= 2 ? "text-emerald-300" : "text-zinc-400"}`}>
                Wanderer
              </span>
              <span className="text-[9px] font-mono text-zinc-500">2 - 4 trips</span>
            </div>

            {/* Legend Node (5) */}
            <div className="flex flex-col items-end text-right">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  confirmedCount >= 5
                    ? "bg-amber-400 border-black text-black shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                    : "bg-[#0b0c10] border-white/30 text-zinc-600"
                }`}
              >
                {confirmedCount >= 5 ? (
                  <Crown className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                )}
              </div>
              <span className={`text-[11px] font-bold mt-1.5 font-display ${confirmedCount >= 5 ? "text-amber-300" : "text-zinc-400"}`}>
                Legend
              </span>
              <span className="text-[9px] font-mono text-zinc-500">5+ trips</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quantitative Statistics KPI Grid (Domain tabular figures) */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3.5 my-4">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Journeys Logged</span>
            <Luggage className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">
            {confirmedCount}
          </div>
          <span className="text-[10px] text-zinc-500 font-light mt-0.5 block">
            {confirmedCount > 0 ? "Active departure history" : "Begin your 1st voyage"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Trail Distance</span>
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">
            ~{estimatedTrailKm.toLocaleString()} <span className="text-xs text-zinc-400 font-sans font-normal">KM</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-light mt-0.5 block">
            High mountain & coastal ridges
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Nomad Points</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tabular-nums">
            {nomadTrailPoints.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-500 font-light mt-0.5 block">
            10 pts per ₹100 settled
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Travelers Led</span>
            <Users className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">
            {totalTravelersLed} <span className="text-xs text-zinc-400 font-sans font-normal">Pax</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-light mt-0.5 block">
            Group companions brought
          </span>
        </div>
      </div>

      {/* 5. Interactive Tier Privileges Inspector */}
      <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Privilege Spectrum & Unlocked Vouchers</span>
            </h3>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              Select any tier to compare privileges and copy active loyalty discount codes.
            </p>
          </div>

          {/* Segmented Control Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10 self-stretch sm:self-auto">
            {NOMAD_TIERS.map((tier) => {
              const isCurrent = currentTier.id === tier.id;
              const isSelected = selectedTierTab === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTierTab(tier.id)}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-display flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <tier.icon className="w-3.5 h-3.5" />
                  <span>{tier.name}</span>
                  {isCurrent && (
                    <span className={`text-[8px] px-1 py-0.2 rounded font-mono uppercase ${isSelected ? "bg-black/20 text-black" : "bg-amber-400/20 text-amber-300"}`}>
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tier Perks Display Box */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 ${activeTabConfig.borderColor} bg-gradient-to-br ${activeTabConfig.accentColor} relative overflow-hidden`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider font-display ${activeTabConfig.textColor}`}>
                  {activeTabConfig.name} Tier
                </span>
                <span aria-hidden="true" className="text-zinc-500">·</span>
                <span className="text-xs text-zinc-300 font-light">{activeTabConfig.subtitle}</span>
              </div>
              <p className="text-xs text-zinc-300 font-light">
                Requirement:{" "}
                <strong className="text-white font-mono">
                  {activeTabConfig.minTrips === 0 ? "0 to 1" : activeTabConfig.maxTrips ? `${activeTabConfig.minTrips} to ${activeTabConfig.maxTrips}` : `${activeTabConfig.minTrips}+`}{" "}
                  confirmed voyages
                </strong>
              </p>
            </div>

            {/* Voucher Code Box if tier has a discount code */}
            {activeTabConfig.discountCode && (
              <div className="flex items-center gap-2 bg-[#07080a] border border-white/15 px-3.5 py-2 rounded-2xl shrink-0">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-400 block">
                    {activeTabConfig.discountRate} Code
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {activeTabConfig.discountCode}
                  </span>
                </div>
                {isSelectedTierUnlocked ? (
                  <button
                    onClick={() => handleCopyCode(activeTabConfig.discountCode!)}
                    className="p-2 rounded-xl bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-black transition cursor-pointer"
                    title="Copy Promo Code"
                  >
                    {copiedCode === activeTabConfig.discountCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                ) : (
                  <div className="p-2 text-zinc-600" title="Locked until tier milestone reached">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activeTabConfig.perks.map((perk, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#07080a]/80 border border-white/10 flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  {isSelectedTierUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-display mb-0.5 flex items-center gap-1.5">
                    <span>{perk.title}</span>
                    {perk.highlight && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono uppercase">
                        Featured
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Locked vs Unlocked Tier Status Footer */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              {isSelectedTierUnlocked ? (
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All privileges active on your account profile</span>
                </span>
              ) : (
                <span className="text-amber-400/90 flex items-center gap-1.5 font-medium">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>
                    Lock status: Complete{" "}
                    <strong className="text-white font-mono tabular-nums">
                      {Math.max(1, activeTabConfig.minTrips - confirmedCount)}
                    </strong>{" "}
                    more departure to unlock this tier
                  </span>
                </span>
              )}
            </div>

            {!isSelectedTierUnlocked && onExploreDepartures && (
              <button
                onClick={onExploreDepartures}
                className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer font-display transition"
              >
                Find eligible routes →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
