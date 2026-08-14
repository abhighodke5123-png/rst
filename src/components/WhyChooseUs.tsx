import React from "react";
import { ShieldCheck, HeartHandshake, Headphones, MapPin, Users, Award, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import TopographicOverlay from "./TopographicOverlay";

const HIGHLIGHTS = [
  {
    title: "Vetted 4x4 Fleet & Local Captains",
    description: "Every mountain pass and coastal trail is led by veteran drivers and certified high-altitude captains.",
    icon: <ShieldCheck className="w-6 h-6 text-amber-400" />
  },
  {
    title: "Curated Micro-Groups (Max 14)",
    description: "No crowded tourist buses. Travel in intimate groups with like-minded wanderers and creators.",
    icon: <Users className="w-6 h-6 text-sky-400" />
  },
  {
    title: "24/7 Ground Ops Support",
    description: "Our dedicated operations crew monitors weather, road permits, and medical logistics in real-time.",
    icon: <Headphones className="w-6 h-6 text-emerald-400" />
  },
  {
    title: "Transparent Fixed Pricing",
    description: "Zero hidden surcharges. Boutique stays, breakfast, fuel, and expedition gear are all accounted for.",
    icon: <HeartHandshake className="w-6 h-6 text-amber-300" />
  },
  {
    title: "Secret Trailhead Access",
    description: "We bypass standard tourist circuits to guide you into secluded waterfalls, high plateaus, and village feasts.",
    icon: <MapPin className="w-6 h-6 text-rose-400" />
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-32 bg-[#07080a] relative overflow-hidden">
      {/* Topographic Background Pattern */}
      <TopographicOverlay opacity={0.04} />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-xs tracking-widest text-amber-400 uppercase font-bold mb-3 block font-display">
            The Raasta Standard
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight font-display">
            Engineered for <span className="font-editorial text-amber-300 font-normal italic text-5xl sm:text-6xl md:text-7xl">true explorers.</span>
          </h2>
          <p className="text-zinc-400 font-light text-base sm:text-lg leading-relaxed">
            We handle complex permits, high-altitude logistics, and boutique accommodations so you can immerse entirely in the journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HIGHLIGHTS.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass border border-white/10 p-8 rounded-[32px] hover:-translate-y-2 hover:border-white/20 transition-all duration-500 flex flex-col items-start group hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.1)]"
            >
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-6 group-hover:bg-amber-400/10 group-hover:border-amber-400/30 transition-colors">
                {highlight.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight font-display">{highlight.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm font-light">{highlight.description}</p>
            </motion.div>
          ))}
          
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass border border-amber-400/30 p-8 rounded-[32px] flex flex-col justify-center bg-gradient-to-br from-amber-500/10 via-[#10121a] to-[#0d0f14] shadow-xl"
          >
            <div className="flex items-center gap-2 mb-6 text-amber-400 text-xs uppercase font-bold tracking-widest font-display">
              <Sparkles className="w-4 h-4" />
              <span>Proven Track Record</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 font-display">5,200+</div>
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Travelers Guided</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 font-display">180+</div>
                <div className="text-xs text-sky-400 font-bold uppercase tracking-wider">Caravans Dispatched</div>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 font-display">99.4%</div>
                <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">5-Star Reviews</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 font-display">100%</div>
                <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Safety Record</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
