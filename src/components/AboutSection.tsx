import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Compass, MapPin, ShieldCheck, HeartHandshake, Eye, Sparkles } from "lucide-react";
import aboutImg from "../assets/images/regenerated_image_1784642536092.jpg";
import TopographicOverlay from "./TopographicOverlay";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32 px-6 bg-[#202522] relative border-t border-[#8C9A82]/20 overflow-hidden">
      <TopographicOverlay opacity={0.03} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182622] border border-[#8C9A82]/30 text-[#D4A96C] text-xs font-semibold uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>The Raasta Story</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#EDE9DF] tracking-tight mb-5">
            About <span className="italic text-[#D4A96C]">Raasta Trips</span>
          </h2>
          <p className="text-[#EDE9DF]/80 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Born from a hunger for raw horizons, authentic trailside hospitality, and genuine micro-group camaraderie.
          </p>
        </div>

        {/* Narrative & Visual Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-serif text-[#EDE9DF] font-bold">
              We travel the way journeys used to be: curious, deliberate, and deeply human.
            </h3>
            <p className="text-[#EDE9DF]/80 leading-relaxed text-sm sm:text-base font-light">
              At RAASTA, we believe travel should be memorable, deeply authentic, and completely hassle-free. Whether you're chasing secluded coastal coves, navigating raw high-altitude mountain passes, or joining a handcrafted group caravan, we make travel effortless.
            </p>
            <p className="text-[#EDE9DF]/75 leading-relaxed text-sm sm:text-base font-light">
              Our mission is to engineer immersive journeys with transparent fixed rates, reliable on-ground captains, and zero corporate fluff. We partner with local family homestays, veteran mountain drivers, and certified safety crews to protect the lands we traverse.
            </p>
            <div className="pt-4 border-t border-[#8C9A82]/20">
              <span className="text-[#D4A96C] font-serif font-bold text-lg tracking-wide block">
                Find Your Way. Make Your Story.
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[440px] sm:h-[480px] rounded-[36px] overflow-hidden border border-[#8C9A82]/30 group shadow-2xl"
          >
            <img
              src={aboutImg}
              alt="Travelers exploring together with Raasta"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 select-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#182622] via-[#182622]/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-[#EDE9DF] font-serif italic text-base sm:text-lg leading-relaxed">
                "Whether you're taking your first road trip or crossing your tenth Himalayan pass, Raasta is your crew on the road."
              </p>
            </div>
          </motion.div>
        </div>

        {/* 3 Pillars Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#182622] border border-[#8C9A82]/25 p-8 rounded-[28px]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4A96C] block mb-3">
              Standard 01
            </span>
            <h4 className="text-xl font-serif text-[#EDE9DF] font-bold mb-3">Micro-Groups Capped at 14</h4>
            <p className="text-xs sm:text-sm text-[#EDE9DF]/75 font-light leading-relaxed">
              We never pool large crowds. Small group sizes preserve the sacred wilderness atmosphere and allow authentic friendships to form naturally.
            </p>
          </div>

          <div className="bg-[#182622] border border-[#8C9A82]/25 p-8 rounded-[28px]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4A96C] block mb-3">
              Standard 02
            </span>
            <h4 className="text-xl font-serif text-[#EDE9DF] font-bold">Local Community Custodians</h4>
            <p className="text-xs sm:text-sm text-[#EDE9DF]/75 font-light leading-relaxed">
              We stay in locally owned homestays and work exclusively with native drivers and trail guides, putting direct economic value into village economies.
            </p>
          </div>

          <div className="bg-[#182622] border border-[#8C9A82]/25 p-8 rounded-[28px]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4A96C] block mb-3">
              Standard 03
            </span>
            <h4 className="text-xl font-serif text-[#EDE9DF] font-bold">Uncompromising Safety</h4>
            <p className="text-xs sm:text-sm text-[#EDE9DF]/75 font-light leading-relaxed">
              Every high-altitude expedition carries medical pulse oximeters, portable emergency oxygen cylinders, and dedicated 24/7 ground coordination.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
