import React from "react";
import { Users, Gift, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function CommunityReferral() {
  return (
    <section className="py-32 px-6 bg-[#040404] relative overflow-hidden border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand-emerald/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Community Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass border border-white/10 rounded-[32px] p-8 lg:p-12 flex flex-col justify-between overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-[100px] pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
          <div>
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 text-brand-emerald mb-8 border border-white/10">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              Travel with strangers.<br />
              <span className="text-zinc-500">Leave with friends.</span>
            </h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10 font-light">
              RAASTA isn't just about the places we go. It's about the tribe we build along the way. Campfire jams, shared stories, and bonds forged in the mountains or by the ocean. Join our thriving community of modern nomads.
            </p>
          </div>
          <a 
            href="https://chat.whatsapp.com/Db0PsVb39ra0PFDXhJKWbz"
            target="_blank"
            rel="noreferrer"
            className="self-start flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm tracking-wide hover:bg-zinc-200 transition-colors"
          >
            <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.015c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            Join WhatsApp Community
          </a>
        </motion.div>
      </div>
    </section>
  );
}
