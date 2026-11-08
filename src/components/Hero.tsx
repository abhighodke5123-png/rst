import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, MessageCircle, Compass, Sparkles, MapPin, ShieldCheck, Users } from "lucide-react";
import TopographicOverlay from "./TopographicOverlay";

interface HeroProps {
  onExploreClick: () => void;
  onTalkToRaasta: () => void;
  onSelectDestination?: (destId: string) => void;
}

interface DestinationHeroSlide {
  id: string;
  name: string;
  region: string;
  tagline: string;
  image: string;
  elevation: string;
  coordinates: string;
  season: string;
  collection: "explore" | "select";
}

const HERO_SLIDES: DestinationHeroSlide[] = [
  {
    id: "spiti",
    name: "Spiti Valley",
    region: "Himachal Pradesh",
    tagline: "Cold Desert Caravans & Ancient Monasteries",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
    elevation: "4,590m Kunzum Pass",
    coordinates: "32° 14' N, 78° 03' E",
    season: "May – Oct",
    collection: "select"
  },
  {
    id: "ladakh",
    name: "Ladakh & Nubra",
    region: "Himalayan Ridge",
    tagline: "High Altitude Passes & Starlit Sand Dunes",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
    elevation: "5,359m Khardung La",
    coordinates: "34° 09' N, 77° 34' E",
    season: "Jun – Sep",
    collection: "select"
  },
  {
    id: "gokarna",
    name: "Gokarna & Karwar",
    region: "Karnataka Coast",
    tagline: "Cliffside Trails, Secluded Bays & Caves",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80",
    elevation: "15m Coastal Ridge",
    coordinates: "14° 32' N, 74° 19' E",
    season: "Oct – Mar",
    collection: "explore"
  },
  {
    id: "meghalaya",
    name: "Meghalaya Highlands",
    region: "Northeast India",
    tagline: "Living Root Bridges & Emerald Cascades",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=80",
    elevation: "1,450m Cloud Plateau",
    coordinates: "25° 18' N, 91° 35' E",
    season: "Sep – May",
    collection: "select"
  },
  {
    id: "jaisalmer",
    name: "Jaisalmer & Thar",
    region: "Rajasthan",
    tagline: "Golden Dunes & Starlit Caravan Camps",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=80",
    elevation: "225m Desert Ridge",
    coordinates: "26° 54' N, 70° 54' E",
    season: "Oct – Mar",
    collection: "explore"
  }
];

export default function Hero({ onExploreClick, onTalkToRaasta, onSelectDestination }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <section id="hero" className="relative min-h-[92vh] sm:min-h-[96vh] w-full flex items-center justify-center pt-32 pb-24 overflow-hidden bg-[#182622]">
      {/* Cinematic Photography Background Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.image}
            src={slide.image}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.38, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
            alt={slide.name}
          />
        </AnimatePresence>

        {/* Topographic Lines Overlay */}
        <TopographicOverlay opacity={0.04} />

        {/* Editorial Gradients & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#182622] via-[#182622]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#182622]/85 via-transparent to-transparent" />
      </div>

      {/* Floating Tactical Cartography (Top Right) */}
      <div className="hidden lg:flex items-center gap-3 absolute top-32 right-10 z-20 bg-[#202522]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#8C9A82]/30 text-xs">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <div className="text-left font-mono">
          <div className="text-[11px] text-[#D4A96C] font-bold">{slide.coordinates}</div>
          <div className="text-[10px] text-[#EDE9DF]/70">{slide.elevation} • {slide.season}</div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 flex flex-col items-center">
        
        {/* Curated Batch Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#202522]/90 backdrop-blur-xl text-xs font-semibold tracking-wider text-[#EDE9DF] mb-8 border border-[#8C9A82]/30 shadow-xl"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[#EDE9DF]/90 font-mono text-[11px]">2026–2027 CURATED DEPARTURES</span>
          <span className="text-[#D4A96C] text-[10px] font-bold px-2 py-0.5 rounded bg-[#D4A96C]/10 border border-[#D4A96C]/30 font-mono">
            {slide.name}
          </span>
        </motion.div>

        {/* Editorial Headline (Exact prompt requirement) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.05] mb-6 tracking-tight text-[#EDE9DF]"
        >
          Not Just Trips. <br />
          <span className="italic text-[#D4A96C] font-normal">Stories You’ll Carry Forever.</span>
        </motion.h1>

        {/* Subtitle (Exact prompt requirement) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[#EDE9DF]/85 mb-10 max-w-2xl leading-relaxed font-light"
        >
          Discover new places, meet your kind of people and experience journeys worth remembering.
        </motion.p>

        {/* Primary CTAs (Exact prompt requirement: "Explore Trips" and "Talk to Raasta") */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-12"
        >
          <button
            onClick={onExploreClick}
            className="group px-8 py-4 bg-[#D4A96C] hover:bg-[#d8b37c] text-[#182622] rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider w-full sm:w-auto transition-all duration-200 cursor-pointer shadow-xl shadow-[#D4A96C]/20 flex items-center justify-center gap-2"
          >
            <span>Explore Trips</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onTalkToRaasta}
            className="px-8 py-4 bg-[#202522]/90 backdrop-blur-xl text-[#EDE9DF] hover:text-[#D4A96C] hover:bg-[#202522] rounded-2xl font-semibold text-xs sm:text-sm uppercase tracking-wider w-full sm:w-auto transition-colors border border-[#8C9A82]/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Talk to Raasta</span>
          </button>
        </motion.div>

        {/* Interactive Destination Preview Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-2 sm:gap-2.5 mb-10 flex-wrap"
        >
          {HERO_SLIDES.map((item, idx) => {
            const isActive = activeSlide === idx;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSlide(idx);
                  if (onSelectDestination) onSelectDestination(item.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-[#D4A96C] text-[#182622] font-bold shadow-md"
                    : "bg-[#202522]/80 text-[#EDE9DF]/70 hover:text-[#EDE9DF] border border-[#8C9A82]/20"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#182622]" : "bg-[#8C9A82]"}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Genuine Expedition Standards Matrix */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#8C9A82]/20 w-full max-w-4xl text-left"
        >
          <div className="bg-[#202522]/80 backdrop-blur-md p-4 rounded-2xl border border-[#8C9A82]/20">
            <div className="text-sm font-serif font-bold text-[#EDE9DF]">14 Max Cap</div>
            <div className="text-[11px] text-[#EDE9DF]/70 font-light">Micro-groups Only</div>
          </div>

          <div className="bg-[#202522]/80 backdrop-blur-md p-4 rounded-2xl border border-[#8C9A82]/20">
            <div className="text-sm font-serif font-bold text-[#EDE9DF]">Dedicated 4x4 Fleet</div>
            <div className="text-[11px] text-[#EDE9DF]/70 font-light">Vetted vehicles & drivers</div>
          </div>

          <div className="bg-[#202522]/80 backdrop-blur-md p-4 rounded-2xl border border-[#8C9A82]/20">
            <div className="text-sm font-serif font-bold text-[#EDE9DF]">Certified Captains</div>
            <div className="text-[11px] text-[#EDE9DF]/70 font-light">Experienced route leads</div>
          </div>

          <div className="bg-[#202522]/80 backdrop-blur-md p-4 rounded-2xl border border-[#8C9A82]/20">
            <div className="text-sm font-serif font-bold text-[#EDE9DF]">Zero Hidden Costs</div>
            <div className="text-[11px] text-[#EDE9DF]/70 font-light">Transparent per-person rates</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}