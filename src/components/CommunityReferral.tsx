import React, { useState } from "react";
import { Users, Gift, Copy, Check, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CommunityReferral() {
  const [copied, setCopied] = useState(false);
  const referralCode = "RAASTA-NOMAD-500";

  const handleCopyReferral = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Hey! Join me on a curated road trip with RAASTA Travels. Use my code ${referralCode} to get ₹500 OFF your first trip: https://wa.me/919226638440?text=Hi%20Raasta,%20I'm%20using%20referral%20code%20${referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="py-24 px-6 bg-[#040404] relative overflow-hidden border-t border-white/5">
      {/* Visual background atmospheric lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-emerald/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: WhatsApp Community Tribe */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass border border-white/10 rounded-[32px] p-8 lg:p-10 flex flex-col justify-between relative group hover:border-white/20 transition-all duration-300"
          >
            <div>
              <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-brand-emerald/10 text-brand-emerald mb-6 border border-brand-emerald/20">
                <Users className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-brand-emerald mb-2 block">
                Exclusive Nomad Tribe
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                Travel with strangers. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-brand-blue">
                  Leave with lifelong friends.
                </span>
              </h2>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 font-light">
                Campfire acoustic jams, secret midnight viewpoints, and raw road memories. Join 5,000+ wanderers in our private WhatsApp community for early-bird batch announcements, weekend meetups, and route discussions.
              </p>
            </div>

            <a
              href="https://chat.whatsapp.com/Db0PsVb39ra0PFDXhJKWbz"
              target="_blank"
              rel="noreferrer"
              className="self-start flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-black font-bold text-sm hover:scale-105 transition-transform shadow-lg cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.015c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Join WhatsApp Tribe
            </a>
          </motion.div>

          {/* Card 2: Referral & Earn ₹500 Credits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass border border-white/10 rounded-[32px] p-8 lg:p-10 flex flex-col justify-between relative group hover:border-white/20 transition-all duration-300"
          >
            <div>
              <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-brand-orange/10 text-brand-orange mb-6 border border-brand-orange/20">
                <Gift className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-2 block">
                Travel Rewards Program
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                Refer a Nomad. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-400">
                  Earn ₹500 Travel Credit.
                </span>
              </h2>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 font-light">
                Give your friends ₹500 off on their first departure. When they complete their trip, you receive ₹500 in Raasta Travel Coins credited to your ledger for your next expedition!
              </p>

              {/* Copy Code Box */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Your Unique Invite Code</span>
                  <span className="font-mono text-base font-bold text-white tracking-widest">{referralCode}</span>
                </div>

                <button
                  onClick={handleCopyReferral}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    copied
                      ? "bg-brand-emerald text-black"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 font-light">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>No limit on referral earnings. Usable on any domestic tour.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
