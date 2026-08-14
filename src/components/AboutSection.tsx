import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Compass, Map, ShieldCheck, HeartHandshake, Eye, Sparkles } from "lucide-react";
// @ts-expect-error - Vite handles asset imports dynamically
import aboutImg from "../assets/images/regenerated_image_1784642536092.jpg";
import TopographicOverlay from "./TopographicOverlay";

export default function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 bg-[#07080a] relative border-t border-white/5 overflow-hidden">
      {/* Topographic Cartography Lines */}
      <TopographicOverlay opacity={0.03} />

      <div className="absolute left-0 bottom-10 w-[600px] h-[600px] bg-amber-500/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <span className="text-xs tracking-widest text-amber-400 uppercase font-bold mb-3 block font-display">
            The Philosophy
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight font-display">
            About <span className="font-editorial text-amber-300 font-normal italic text-5xl sm:text-6xl md:text-7xl">RAASTA Expeditions</span>
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Born from a hunger for raw horizons, authentic trailside hospitality, and genuine micro-group camaraderie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-zinc-300 leading-relaxed text-base sm:text-lg font-light">
              At RAASTA, we believe every journey should be memorable, deeply authentic, and completely hassle-free. Whether you're chasing secluded coastal coves, navigating raw high-altitude mountain passes, or joining a handcrafted group caravan, we make travel effortless.
            </p>
            <p className="text-zinc-400 leading-relaxed text-base sm:text-lg font-light">
              Our mission is to engineer immersive journeys with transparent fixed rates, reliable on-ground captains, and zero corporate fluff. We partner with local homestays, veteran 4x4 drivers, and certified safety crews.
            </p>
            <div className="pt-6 border-t border-white/10">
              <span className="text-amber-400 font-black text-lg tracking-wide font-display block">
                Travel More. Worry Less. Explore with Raasta.
              </span>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[480px] rounded-[36px] overflow-hidden border border-white/10 glass group shadow-2xl"
          >
            <img 
              src={aboutImg} 
              alt="Travelers exploring together" 
              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-[1.5s] opacity-90 group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white font-medium text-base sm:text-lg leading-relaxed font-display">
                "Whether you're taking your first road trip or crossing your tenth Himalayan pass, Raasta is your crew on the road."
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* What We Offer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass border border-white/10 p-8 sm:p-10 rounded-[32px] hover:border-white/20 transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-amber-400/10 text-amber-400 mb-8 border border-amber-400/20">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-white mb-6 tracking-tight font-display">What We Curate</h3>
            <ul className="space-y-3.5">
              {[
                "All-inclusive road caravans",
                "High-altitude mountain expeditions",
                "Secluded coastal trail loops",
                "Bespoke private charter itineraries",
                "Heritage homestay reservations",
                "Certified 4x4 captain assistance",
                "Full permit & medical shielding"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3.5 text-zinc-400 text-xs sm:text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass border border-white/10 p-8 sm:p-10 rounded-[32px] hover:border-white/20 transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-sky-400/10 text-sky-400 mb-8 border border-sky-400/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-white mb-6 tracking-tight font-display">Why Trust Raasta?</h3>
            <ul className="space-y-3.5">
              {[
                "Unmatched local captain guidance",
                "Strict 14-traveler microgroup cap",
                "Transparent zero-hidden-fee pricing",
                "24/7 dedicated satellite ops link",
                "Vetted safety gear & mountain first aid",
                "Instant instant WhatsApp confirmation"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3.5 text-zinc-400 text-xs sm:text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass border border-white/10 p-8 sm:p-10 rounded-[32px] hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-amber-300/10 text-amber-300 mb-8 border border-amber-300/20">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight font-display">Our Vision</h3>
              <p className="text-zinc-400 leading-relaxed text-sm sm:text-base font-light">
                To build India's premier community of conscious road adventurers — bridging travelers with offbeat terrain while respecting fragile local ecosystems and supporting remote heritage communities.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-display uppercase tracking-widest text-[10px] text-amber-400 font-bold">Est. 2022</span>
              <HeartHandshake className="w-6 h-6 text-zinc-400" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
