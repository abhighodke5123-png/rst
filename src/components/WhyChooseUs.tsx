import React from "react";
import { ShieldCheck, Users, Headphones, HeartHandshake, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import TopographicOverlay from "./TopographicOverlay";

const HIGHLIGHTS = [
  {
    title: "Dedicated 4x4 Fleet & Route Captains",
    description: "Every Himalayan pass and coastal loop is chauffeured in high-clearance 4x4 vehicles led by certified wilderness captains.",
    tag: "VEHICLE & CREW"
  },
  {
    title: "Strict Micro-Groups (Max 14)",
    description: "No crowded tourist buses. Intimate groups of creators, solo wanderers, and adventurers who value true exploration.",
    tag: "CAPACITY"
  },
  {
    title: "24/7 Satellite Ops & Medical Oximeters",
    description: "Real-time meteorological monitoring, oxygen support for high-altitude passes, and immediate ground-hospital links.",
    tag: "SAFETY"
  },
  {
    title: "Transparent Fixed Pricing",
    description: "Zero hidden surcharges. Boutique stays, breakfasts, route permits, and safety equipment are 100% accounted for.",
    tag: "INTEGRITY"
  },
  {
    title: "Unmapped Trailhead Access",
    description: "We intentionally bypass commercial tourist traps to guide you into secluded waterfalls, high plateaus, and village feasts.",
    tag: "ROUTES"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-32 bg-[#07080a] relative overflow-hidden border-t border-white/5">
      <TopographicOverlay opacity={0.04} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 max-w-3xl">
          <span className="text-xs tracking-widest text-amber-400 uppercase font-bold mb-3 block font-mono">
            [ 03 // THE EXPEDITION STANDARD ]
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight font-display uppercase leading-[1.08]">
            Engineered for <br />
            <span className="font-editorial text-amber-300 font-normal italic lowercase text-5xl sm:text-6xl md:text-7xl">
              conscious explorers.
            </span>
          </h2>
          <p className="text-zinc-300 font-light text-base sm:text-lg leading-relaxed">
            We handle complex permits, high-altitude logistics, and boutique accommodations so you can immerse entirely in the route.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HIGHLIGHTS.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="bg-[#0b0c10] border border-white/10 p-8 rounded-[32px] hover:border-amber-400/30 transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-4">
                  {highlight.tag}
                </span>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight font-display">{highlight.title}</h3>
                <p className="text-zinc-300 leading-relaxed text-sm font-light">{highlight.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Standard</span>
              </div>
            </motion.div>
          ))}
          
          {/* Real Track Record Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border border-amber-400/30 p-8 rounded-[32px] flex flex-col justify-center bg-gradient-to-br from-amber-500/10 via-[#10121a] to-[#0d0f14] shadow-xl"
          >
            <div className="flex items-center gap-2 mb-6 text-amber-400 text-xs uppercase font-bold tracking-widest font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Verified Ledger</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 font-display">2,500+</div>
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider font-mono">Nomads Guided</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 font-display">180+</div>
                <div className="text-xs text-zinc-300 font-bold uppercase tracking-wider font-mono">Dispatches</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 font-display">4.9</div>
                <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider font-mono">Avg Rating</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 font-display">100%</div>
                <div className="text-xs text-zinc-300 font-bold uppercase tracking-wider font-mono">Safety Record</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
