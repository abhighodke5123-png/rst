import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Mail, PhoneCall } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#0b0c10] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-zinc-200 z-10"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-[#0b0c10] sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white font-display">Privacy Policy</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Compliant with Digital Personal Data Protection (DPDP) Act</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar text-zinc-300 text-sm leading-relaxed space-y-7 font-light">
            <section>
              <p className="text-base text-zinc-200 leading-relaxed font-normal">
                At <strong className="text-white font-bold font-display">RAASTA Travels & Experiences Pvt. Ltd.</strong>, we prioritize the protection of your personal and booking data through enterprise-grade encryption.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-white font-display">1. Information We Collect</h3>
              <p className="text-xs text-zinc-400">To curate personalized caravan itineraries and arrange transport permits, we collect:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-300 marker:text-amber-400">
                <li>Legal traveler name and government ID verification (when required for high-altitude border permits)</li>
                <li>Email address and verified WhatsApp phone number</li>
                <li>Emergency contact details and dietary / medical preferences</li>
                <li>Encrypted transaction logs (we never store raw credit card credentials)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-white font-display">2. How We Utilize Traveler Information</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-300 marker:text-amber-400">
                <li>Coordinate directly with on-ground 4x4 expedition captains</li>
                <li>Issue official seat passes and departure countdown itineraries</li>
                <li>Facilitate verified homestay reservations and local permit clearances</li>
                <li>Provide 24/7 WhatsApp emergency support during active expeditions</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-white font-display">3. Security & Third-Party Protections</h3>
              <p className="text-xs text-zinc-400">
                All data is stored in isolated cloud databases encrypted at rest using 256-bit AES protocols. We strictly do not sell, license, or monetize your personal travel data to marketing third parties.
              </p>
            </section>

            <section className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">Privacy Inquiries & Data Removal</h3>
              <p className="text-xs text-zinc-400">
                To request complete data removal or update your records, reach our Data Compliance Officer:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2 text-xs font-mono text-zinc-300">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-400" /> raastatrips.in@gmail.com</span>
                <span className="flex items-center gap-1.5"><PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> +91 7348929802</span>
              </div>
            </section>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-[#07080a] flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 transition shadow-lg shadow-amber-500/20 cursor-pointer font-display"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
