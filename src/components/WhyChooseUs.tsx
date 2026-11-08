import React from "react";
import { Compass, DollarSign, Headphones, Users, CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "motion/react";
import TopographicOverlay from "./TopographicOverlay";

const CORE_PILLARS = [
  {
    icon: Compass,
    title: "Thoughtfully Planned Journeys",
    tagline: "Curated, Not Rushed",
    description: "Every route is personally scouted by our founding captains. We design gradual acclimatization schedules, avoid commercial tourist traps, and uncover untouched vistas."
  },
  {
    icon: DollarSign,
    title: "Transparent Fixed Pricing",
    tagline: "Zero Hidden Surcharges",
    description: "What you see is what you pay. Stays, reliable transport, route permits, and safety equipment are included upfront. No sudden compulsory fees on the trail."
  },
  {
    icon: Headphones,
    title: "Personal Assistance",
    tagline: "Human-Led from Day One",
    description: "You speak directly with our team captains on WhatsApp and phone. From gear preparation and packing advice to flight coordination, we guide you every step."
  },
  {
    icon: Users,
    title: "Memorable Group Experiences",
    tagline: "Micro-Groups strictly capped at 14",
    description: "No crowded 40-person tour buses. Travel with open-minded explorers, solo adventurers, and creatives who become friends long after the journey ends."
  }
];

export default function WhyChooseUs() {
  return (
    <section id="why-raasta" className="py-24 sm:py-32 bg-[#182622] relative overflow-hidden border-t border-[#8C9A82]/20">
      <TopographicOverlay opacity={0.03} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#202522] border border-[#8C9A82]/30 text-[#D4A96C] text-xs font-semibold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Raasta Difference</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#EDE9DF] tracking-tight mb-5">
            Why Travel with <span className="italic text-[#D4A96C]">Raasta</span>
          </h2>
          <p className="text-[#EDE9DF]/80 text-base sm:text-lg font-light leading-relaxed">
            We built Raasta for people who seek real adventure without sacrificing trust, safety, and human warmth.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {CORE_PILLARS.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#202522] border border-[#8C9A82]/25 p-8 sm:p-10 rounded-[32px] hover:border-[#D4A96C]/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#182622] border border-[#8C9A82]/30 flex items-center justify-center text-[#D4A96C]">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#D4A96C]/80">
                      {pillar.tagline}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif text-[#EDE9DF] font-bold mb-3 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-[#EDE9DF]/80 leading-relaxed text-sm sm:text-base font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#8C9A82]/15 flex items-center gap-2 text-xs text-[#8C9A82] font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Guaranteed standard on every departure</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
