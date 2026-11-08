import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Compass } from "lucide-react";
import TopographicOverlay from "./TopographicOverlay";

interface HeroProps {
  onExploreClick: () => void;
  onPackagesClick: () => void;
}

interface DestinationHeroSlide {
  name: string;
  region: string;
  tagline: string;
  image: string;
  elevation: string;
  coordinates: string;
  temp: string;
}

const HERO_SLIDES: DestinationHeroSlide[] = [
  {
    name: "Spiti Valley",
    region: "Himachal Pradesh",
    tagline: "High Mountain Desert & Ancient Monasteries",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
    elevation: "4,590m Kunzum Pass",
    coordinates: "32° 14' 45\" N, 78° 03' 21\" E",
    temp: "-2°C Alpine Crisp"
  },
  {
    name: "Ladakh & Nubra",
    region: "Himalayan Ridge",
    tagline: "High Altitude Passes & Starlit Sand Dunes",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
    elevation: "5,359m Khardung La",
    coordinates: "34° 09' 09\" N, 77° 34' 43\" E",
    temp: "4°C Glacial Wind"
  },
  {
    name: "Meghalaya Highlands",
    region: "Northeast India",
    tagline: "Living Root Bridges & Emerald Cascades",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=80",
    elevation: "1,450m Cloud Plateau",
    coordinates: "25° 18' 04\" N, 91° 35' 18\" E",
    temp: "20°C Forest Mist"
  },
  {
    name: "Gokarna & Karwar",
    region: "Karnataka Coast",
    tagline: "Bioluminescent Bays & Secluded Cliff Trails",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80",
    elevation: "15m Coastal Ridge",
    coordinates: "14° 32' 50\" N, 74° 19' 02\" E",
    temp: "28°C Sunset Breeze"
  },
  {
    name: "Jaisalmer & Thar",
    region: "Rajasthan",
    tagline: "Golden Dunes & Starlit Caravan Camps",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=80",
    elevation: "225m Desert Ridge",
    coordinates: "26° 54' 56\" N, 70° 54' 53\" E",
    temp: "18°C Campfire Night"
  }
];

export default function Hero({ onExploreClick, onPackagesClick }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [compassBearing, setCompassBearing] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      setCompassBearing((prev) => (prev + 72) % 360);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <section className="relative min-h-[94vh] w-full flex items-center justify-center pt-32 pb-24 overflow-hidden bg-[#07080a]">
      {/* Immersive Background Imagery with Dynamic Motion Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.image}
            src={slide.image}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.44, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
            alt={slide.name}
          />
        </AnimatePresence>

        {/* Topographic Vector Contour Lines */}
        <TopographicOverlay opacity={0.06} />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080a]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#07080a_85%)]" />
      </div>

      {/* Floating Tactical Cartography Compass (Top Right) */}
      <div className="hidden lg:flex items-center gap-3 absolute top-32 right-10 z-20 glass px-4 py-2.5 rounded-2xl border border-white/10 text-xs">
        <div className="relative w-6 h-6 flex items-center justify-center text-amber-400">
          <Compass
            className="w-5 h-5 transition-transform duration-1000 ease-out"
            style={{ transform: `rotate(${compassBearing}deg)` }}
          />
        </div>
        <div className="text-left font-mono">
          <div className="text-[10px] text-amber-400 font-bold tracking-wider">{slide.coordinates}</div>
          <div className="text-[9px] text-zinc-300">{slide.elevation} • {slide.temp}</div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 flex flex-col items-center">
        {/* Curated Batch Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0b0c10]/90 backdrop-blur-xl text-xs font-semibold tracking-wider text-white uppercase mb-8 border border-white/15 shadow-xl shadow-black/60"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-zinc-200">Curated Expeditions 2026–2027</span>
          <span className="text-amber-400 text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 font-mono">
            {slide.name}
          </span>
        </motion.div>

        {/* Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.96] mb-7 tracking-tight text-white uppercase font-display"
        >
          The Open <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            Road
          </span>{" "}
          <span className="font-editorial normal-case italic text-amber-300 font-normal">Awaits.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl leading-relaxed font-light"
        >
          Handcrafted overland caravans across high Himalayan passes, rainforest living bridges, and secluded coastal cliffs. Intimate micro-groups strictly capped at 14 travelers.
        </motion.p>

        {/* Primary Action Buttons with Motion Spring feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExploreClick}
            className="group relative px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-black rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest w-full sm:w-auto overflow-hidden transition-shadow shadow-xl shadow-amber-500/20 cursor-pointer font-display focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[44px]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Explore Departures
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPackagesClick}
            className="px-8 py-4 bg-[#0b0c10]/80 backdrop-blur-xl text-white rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-widest w-full sm:w-auto transition-colors hover:bg-white/10 hover:border-amber-400/50 border border-white/20 flex items-center justify-center gap-2 cursor-pointer font-display focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Find My Ideal Route</span>
          </motion.button>
        </motion.div>

        {/* Interactive Destination Preview Switcher with Motion layoutId */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-2 sm:gap-3 mb-10 flex-wrap"
        >
          {HERO_SLIDES.map((item, idx) => {
            const isActive = activeSlide === idx;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveSlide(idx);
                  setCompassBearing((idx * 72 + 42) % 360);
                }}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer font-display flex items-center gap-2 min-h-[44px] ${
                  isActive ? "text-amber-300" : "text-zinc-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="heroActivePill"
                    className="absolute inset-0 rounded-xl bg-amber-400/20 border border-amber-400/50 shadow-md shadow-amber-500/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 w-1.5 h-1.5 rounded-full ${isActive ? "bg-amber-400" : "bg-zinc-500"}`} />
                <span className="relative z-10">{item.name}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Verified Expedition Standards Matrix */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-white/10 w-full max-w-4xl text-left"
        >
          <div className="bg-[#0b0c10]/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-sm font-bold text-white font-display">14 Max Cap</div>
            <div className="text-[11px] text-zinc-300 font-light">Micro-groups Only</div>
          </div>

          <div className="bg-[#0b0c10]/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-sm font-bold text-white font-display">100% 4x4 & Vetted</div>
            <div className="text-[11px] text-zinc-300 font-light">Dedicated Fleet & Stays</div>
          </div>

          <div className="bg-[#0b0c10]/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-sm font-bold text-white font-display">Certified Captains</div>
            <div className="text-[11px] text-zinc-300 font-light">Local Trail Mentors</div>
          </div>

          <div className="bg-[#0b0c10]/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-sm font-bold text-white font-display">Zero Surcharges</div>
            <div className="text-[11px] text-zinc-300 font-light">All-Inclusive Transparent</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
