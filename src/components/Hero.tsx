import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowRight, Sparkles, ShieldCheck, Star, Users, MapPin, Compass, Thermometer, Mountain, Radio } from "lucide-react";
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
  accentColor: string;
}

const HERO_SLIDES: DestinationHeroSlide[] = [
  {
    name: "Spiti Valley",
    region: "Himachal Pradesh",
    tagline: "High Mountain Deserts & Ancient Monasteries",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
    elevation: "3,800m - 4,590m",
    coordinates: "32° 14' 45\" N, 78° 03' 21\" E",
    temp: "-2°C Alpine Crisp",
    accentColor: "from-amber-400 to-amber-600"
  },
  {
    name: "Gokarna & Karwar",
    region: "Karnataka Coast",
    tagline: "Bioluminescent Bays & Secluded Cliff Trails",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80",
    elevation: "15m Coastal Ridge",
    coordinates: "14° 32' 50\" N, 74° 19' 02\" E",
    temp: "28°C Sunset Breeze",
    accentColor: "from-sky-400 to-teal-500"
  },
  {
    name: "Meghalaya Highlands",
    region: "Northeast India",
    tagline: "Living Root Bridges & Emerald Cascades",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=80",
    elevation: "1,450m Cloud Plateau",
    coordinates: "25° 18' 04\" N, 91° 35' 18\" E",
    temp: "20°C Monsoonal Mist",
    accentColor: "from-emerald-400 to-emerald-600"
  },
  {
    name: "Ladakh & Nubra",
    region: "Himalayan Ridge",
    tagline: "High Altitude Passes & Starlit Sand Dunes",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
    elevation: "4,350m Khardung La",
    coordinates: "34° 09' 09\" N, 77° 34' 43\" E",
    temp: "4°C Glacial Wind",
    accentColor: "from-indigo-400 to-purple-500"
  }
];

export default function Hero({ onExploreClick, onPackagesClick }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [compassBearing, setCompassBearing] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      setCompassBearing((prev) => (prev + 45) % 360);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 15 },
    },
  };

  return (
    <section className="relative min-h-[96vh] w-full flex items-center justify-center pt-32 pb-28 overflow-hidden bg-[#07080a]">
      {/* Immersive Background Imagery with Dynamic Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.image}
            src={slide.image}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.38, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
            alt={slide.name}
          />
        </AnimatePresence>

        {/* Topographic Vector Contour Lines */}
        <TopographicOverlay opacity={0.06} />

        {/* Dynamic Multi-layered Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080a]/85 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#07080a_85%)]" />

        {/* Ambient atmospheric luminous glow orbs */}
        <div className="bg-blob bg-amber-500 w-[45vw] h-[45vw] top-[10%] left-[8%] mix-blend-screen opacity-15" />
        <div className="bg-blob bg-sky-500 w-[40vw] h-[40vw] bottom-[10%] right-[8%] mix-blend-screen opacity-15" style={{ animationDelay: "3s" }} />
      </div>

      {/* Floating Tactical Cartography Compass & Coordinate Tag (Top Right) */}
      <div className="hidden lg:flex items-center gap-3 absolute top-32 right-10 z-20 glass px-4 py-2 rounded-2xl border border-white/10 text-xs">
        <div className="relative w-6 h-6 flex items-center justify-center text-amber-400">
          <Compass
            className="w-5 h-5 transition-transform duration-1000 ease-out"
            style={{ transform: `rotate(${compassBearing}deg)` }}
          />
        </div>
        <div className="text-left font-mono">
          <div className="text-[10px] text-amber-400 font-bold tracking-wider">{slide.coordinates}</div>
          <div className="text-[9px] text-zinc-400">{slide.elevation} • {slide.temp}</div>
        </div>
      </div>

      {/* Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-5xl mx-auto px-6 flex flex-col items-center"
      >
        {/* Live Status & Batch Pill */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0b0c10]/90 backdrop-blur-xl text-xs font-semibold tracking-wider text-white uppercase mb-8 border border-white/15 shadow-xl shadow-black/60"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-zinc-200">Curated Autumn & Winter Batches 2026</span>
          <span className="text-amber-400 text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 font-mono">
            {slide.name}
          </span>
        </motion.div>

        {/* Hero Title with Distinctive Typography Pairing */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.04] mb-7 tracking-tight text-white font-display"
        >
          Travel <span className="font-editorial text-amber-300 font-normal italic text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-normal">Beyond</span> <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
            Imaginations.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl leading-relaxed font-light"
        >
          Handcrafted road journeys and boutique overland expeditions across India. Intimate micro-groups, certified trail captains, vetted stays, and memories that last a lifetime.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-12"
        >
          <button
            onClick={onExploreClick}
            className="group relative px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-black rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest w-full sm:w-auto overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/20 cursor-pointer font-display"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Explore Departures
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          <button
            onClick={onPackagesClick}
            className="px-8 py-4 bg-[#0b0c10]/80 backdrop-blur-xl text-white rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-widest w-full sm:w-auto transition-all duration-300 hover:bg-white/10 hover:border-amber-400/50 active:scale-95 border border-white/20 flex items-center justify-center gap-2 cursor-pointer font-display"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Find My Ideal Route</span>
          </button>
        </motion.div>

        {/* Interactive Destination Preview Carousel Switcher */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-2 sm:gap-3 mb-10 flex-wrap"
        >
          {HERO_SLIDES.map((item, idx) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveSlide(idx);
                setCompassBearing((idx * 90 + 42) % 360);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-display flex items-center gap-2 ${
                activeSlide === idx
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/10"
                  : "bg-white/5 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeSlide === idx ? "bg-amber-400" : "bg-zinc-500"}`} />
              <span>{item.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Proof & Trust Badges */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-white/10 w-full max-w-4xl text-left"
        >
          <div className="flex items-center gap-3 bg-[#0b0c10]/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">4.9 / 5.0</div>
              <div className="text-[11px] text-zinc-400">500+ Verified Stories</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0b0c10]/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">12-15 Max</div>
              <div className="text-[11px] text-zinc-400">Microgroup Cap</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0b0c10]/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">100% Vetted</div>
              <div className="text-[11px] text-zinc-400">Stays & 4x4 Fleets</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0b0c10]/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">2,500+</div>
              <div className="text-[11px] text-zinc-400">Nomads Traveled</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-widest text-zinc-500 flex flex-col items-center gap-1.5 select-none pointer-events-none uppercase font-bold">
        <span>Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </motion.div>
      </div>
    </section>
  );
}

