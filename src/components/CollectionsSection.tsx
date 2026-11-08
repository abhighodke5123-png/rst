import React from "react";
import { Compass, Sparkles, Users, Award, Shield, ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";

interface CollectionsSectionProps {
  onSelectCollection: (collection: "explore" | "select") => void;
  onEnquireClick: (collectionPreference: "explore" | "select") => void;
}

export default function CollectionsSection({ onSelectCollection, onEnquireClick }: CollectionsSectionProps) {
  return (
    <section id="collections" className="py-24 sm:py-32 px-6 bg-[#182622] relative overflow-hidden">
      {/* Subtle organic background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A96C]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8C9A82]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE9DF]/10 border border-[#EDE9DF]/20 text-[#D4A96C] text-xs font-semibold uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Travel Streams</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#EDE9DF] tracking-tight mb-5">
            Two Ways to <span className="italic text-[#D4A96C]">Experience Raasta</span>
          </h2>
          <p className="text-[#EDE9DF]/80 text-base sm:text-lg font-light leading-relaxed">
            Whether you want a high-energy group backpacking trip or an intimate boutique escape, we ensure every journey is thoughtfully planned and led by real people.
          </p>
        </div>

        {/* Collections Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* RAASTA EXPLORE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative bg-[#202522] border border-[#8C9A82]/25 rounded-[32px] p-8 sm:p-10 flex flex-col justify-between shadow-2xl hover:border-[#D4A96C]/50 transition-all duration-300"
          >
            <div>
              {/* Badge */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8C9A82]/20 border border-[#8C9A82]/40 text-[#EDE9DF] text-xs font-semibold uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5 text-[#D4A96C]" />
                  Accessible Adventures
                </span>
                <span className="text-xs text-[#EDE9DF]/60 font-mono">From ₹7,999/person</span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-3xl sm:text-4xl font-serif text-[#EDE9DF] mb-3">
                RAASTA <span className="italic text-[#D4A96C]">EXPLORE</span>
              </h3>
              <p className="text-[#EDE9DF]/80 text-sm sm:text-base leading-relaxed font-light mb-8">
                Designed for college students, young professionals, and spirited backpackers who want authentic group travel without inflating the budget.
              </p>

              {/* Key Features */}
              <div className="space-y-3.5 mb-8">
                {[
                  "Affordable, transparent per-person pricing",
                  "Student-friendly weekend getaways & coastal loops",
                  "Vetted experiential hostels & family homestays",
                  "Energetic group camaraderie (10–14 travelers)",
                  "Signature beach bonfires, cafe trails & acoustic jams",
                  "Certified RAASTA Trip Captain on every departure"
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#EDE9DF]/90 font-light">
                    <div className="w-4 h-4 rounded-full bg-[#8C9A82]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#D4A96C]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#8C9A82]/20 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onSelectCollection("explore")}
                className="w-full sm:w-1/2 py-3.5 px-5 rounded-2xl bg-[#EDE9DF] hover:bg-white text-[#182622] font-semibold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>View Explore Trips</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onEnquireClick("explore")}
                className="w-full sm:w-1/2 py-3.5 px-5 rounded-2xl bg-[#182622] hover:bg-[#182622]/80 text-[#D4A96C] border border-[#D4A96C]/40 font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                Enquire for Group
              </button>
            </div>
          </motion.div>

          {/* RAASTA SELECT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="group relative bg-[#202522] border-2 border-[#D4A96C]/40 rounded-[32px] p-8 sm:p-10 flex flex-col justify-between shadow-2xl hover:border-[#D4A96C] transition-all duration-300 relative overflow-hidden"
          >
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A96C]/10 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10">
              {/* Badge */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4A96C]/20 border border-[#D4A96C]/40 text-[#D4A96C] text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Boutique & Curated
                </span>
                <span className="text-xs text-[#D4A96C] font-mono font-semibold">From ₹18,499/person</span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-3xl sm:text-4xl font-serif text-[#EDE9DF] mb-3">
                RAASTA <span className="italic text-[#D4A96C]">SELECT</span>
              </h3>
              <p className="text-[#EDE9DF]/80 text-sm sm:text-base leading-relaxed font-light mb-8">
                Curated for working professionals, couples, and seekers of comfort who want deep immersive travel paired with boutique heritage stays.
              </p>

              {/* Key Features */}
              <div className="space-y-3.5 mb-8">
                {[
                  "Handpicked boutique heritage villas & luxury glamping",
                  "Strictly smaller micro-groups (capped at 8–10 people)",
                  "Dedicated high-clearance 4x4 / Force Urbania fleet",
                  "Slow travel pacing with curated local food trails",
                  "Expert local naturalists & high-altitude specialists",
                  "All-inclusive logistics, permits, and priority assistance"
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#EDE9DF]/90 font-light">
                    <div className="w-4 h-4 rounded-full bg-[#D4A96C]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#D4A96C]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#8C9A82]/20 flex flex-col sm:flex-row items-center gap-3 relative z-10">
              <button
                onClick={() => onSelectCollection("select")}
                className="w-full sm:w-1/2 py-3.5 px-5 rounded-2xl bg-[#D4A96C] hover:bg-[#d8b37c] text-[#182622] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4A96C]/20"
              >
                <span>View Select Trips</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onEnquireClick("select")}
                className="w-full sm:w-1/2 py-3.5 px-5 rounded-2xl bg-[#182622] hover:bg-[#182622]/80 text-[#EDE9DF] border border-[#8C9A82]/40 font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                Custom Itinerary Enquiry
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
