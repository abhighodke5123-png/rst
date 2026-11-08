import React from "react";
import { TEAM_MEMBERS } from "../data";
import { Compass, MapPin, Award, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "motion/react";

export default function MeetTheTeam() {
  return (
    <section id="team" className="py-24 sm:py-32 px-6 bg-[#202522] relative overflow-hidden border-t border-[#8C9A82]/20">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182622] border border-[#8C9A82]/30 text-[#D4A96C] text-xs font-semibold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Real People. Zero Call Centers.</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#EDE9DF] tracking-tight mb-5">
            Meet the <span className="italic text-[#D4A96C]">Raasta Crew</span>
          </h2>
          <p className="text-[#EDE9DF]/80 text-base sm:text-lg font-light leading-relaxed">
            Every itinerary is designed and led by explorers who have actually walked the trails, tested the homestays, and driven the passes.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-[#182622] border border-[#8C9A82]/25 rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-[#D4A96C]/50 transition-all duration-300 shadow-xl"
            >
              {/* Photo */}
              <div className="relative h-64 overflow-hidden bg-black/40">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182622] via-[#182622]/20 to-transparent" />
                <span className="absolute bottom-3 left-4 px-2.5 py-1 rounded-full bg-[#202522]/90 backdrop-blur-md text-[#D4A96C] text-[10px] font-mono border border-[#8C9A82]/30 font-semibold">
                  {member.experience}
                </span>
              </div>

              {/* Bio & Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif text-[#EDE9DF] font-bold tracking-tight mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#D4A96C] font-semibold uppercase tracking-wider mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs text-[#EDE9DF]/75 font-light leading-relaxed mb-4">
                    {member.bio}
                  </p>
                </div>

                {/* Specialties */}
                <div className="pt-4 border-t border-[#8C9A82]/20">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#EDE9DF]/50 block mb-2">
                    Specialty Routes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialtyRoutes.map((route, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2 py-0.5 rounded-md bg-[#202522] border border-[#8C9A82]/20 text-[10px] text-[#EDE9DF]/80 font-mono"
                      >
                        {route}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand promise banner */}
        <div className="mt-16 p-8 rounded-[28px] bg-[#182622] border border-[#D4A96C]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A96C]/10 border border-[#D4A96C]/30 flex items-center justify-center shrink-0 text-[#D4A96C]">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-serif text-[#EDE9DF] font-bold">
                Want to speak directly to a Trip Captain?
              </h4>
              <p className="text-xs sm:text-sm text-[#EDE9DF]/75 font-light">
                Have questions about fitness requirements, vehicle types, or weather? Our captains answer WhatsApp directly.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/919226638440?text=Hi%20Raasta%20Trips%2C%20I%20would%20like%20to%20talk%20to%20a%20Trip%20Captain%20about%20upcoming%20routes."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-[#D4A96C] text-[#182622] font-bold text-xs uppercase tracking-wider hover:bg-[#d8b37c] transition-colors shrink-0 shadow-md"
          >
            Connect on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
