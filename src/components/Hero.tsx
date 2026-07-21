/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { ChevronDown, ArrowRight } from "lucide-react";

interface HeroProps {
  onExploreClick: () => void;
  onPackagesClick: () => void;
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80";

export default function Hero({ onExploreClick, onPackagesClick }: HeroProps) {
  // Stagger variants for entry effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 15 },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#080808]">
      {/* Immersive Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={HERO_IMAGE}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover font-sans"
          referrerPolicy="no-referrer"
          alt="Curated travel experience"
        />
        {/* Soft atmospheric radial or linear dark overlays to match luxury UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-transparent to-transparent"></div>
        
        {/* Glowing floating blobs */}
        <div className="bg-blob bg-brand-blue w-[40vw] h-[40vw] top-[10%] left-[10%] mix-blend-screen"></div>
        <div className="bg-blob bg-brand-emerald w-[30vw] h-[30vw] bottom-[20%] right-[10%] mix-blend-screen" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Hero Core Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-5xl mx-auto px-6 flex flex-col items-center"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium tracking-wider text-white uppercase mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald"></span>
          </span>
          Next Batch Starts Soon
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.05] mb-6 tracking-tight text-white"
        >
          Travel Beyond <br className="hidden sm:block" />
          <span className="text-gradient">Imaginations.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl leading-relaxed font-light"
        >
          Curated group trips crafted for unforgettable memories. Experience the journey, elevated.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <button
            onClick={onExploreClick}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-medium text-lg w-full sm:w-auto overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Explore Trips
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          
          <button
            onClick={onPackagesClick}
            className="px-8 py-4 glass text-white rounded-full font-medium text-lg w-full sm:w-auto transition-colors hover:bg-white/10 active:scale-95"
          >
            Plan My Trip
          </button>
        </motion.div>
      </motion.div>

      {/* Animated Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-widest text-zinc-500 flex flex-col items-center gap-2 select-none pointer-events-none">
        <span className="uppercase font-medium">Discover More</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-zinc-400" />
        </motion.div>
      </div>
    </section>
  );
}
