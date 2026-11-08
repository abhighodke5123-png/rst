import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Lock, CheckCircle2, ArrowRight, AlertCircle, X } from "lucide-react";

interface PrivacyAgreementPopupProps {
  isOpen: boolean;
  onAccept: () => void;
  onOpenFullPolicy: () => void;
  onOpenTerms: () => void;
}

export default function PrivacyAgreementPopup({
  isOpen,
  onAccept,
  onOpenFullPolicy,
  onOpenTerms,
}: PrivacyAgreementPopupProps) {
  const [agreed, setAgreed] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onAccept}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-[#0b0c10] border border-amber-400/30 rounded-[32px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] z-10 text-zinc-200 my-auto"
        >
          {/* Close button for accessible dismissal */}
          <button
            onClick={onAccept}
            aria-label="Close dialog"
            className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Accent glow bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

          {/* Header */}
          <div className="p-6 sm:p-8 pb-4 pr-14">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/25 text-amber-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  DPDP Act (2023) Compliant • RAASTA Expeditions
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
                  Privacy Policy & Traveler Agreement
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Welcome to RAASTA. Before exploring our overland expeditions and reserving departure seats, please review our traveler data privacy notice and expedition code of conduct.
            </p>
          </div>

          {/* Core Highlights Summary */}
          <div className="px-6 sm:px-8 py-2 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-xs mb-1 font-display">Encrypted Data Storage</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed font-light">
                    Your contact and booking details are secured via 256-bit AES encryption. We never sell or license personal data.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-xs mb-1 font-display">Permits & Safety Coordination</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed font-light">
                    Information is strictly used for high-altitude passes, vetted homestay check-ins, and 24/7 route captain support.
                  </p>
                </div>
              </div>
            </div>

            {/* Traveler Conduct Note */}
            <div className="p-3.5 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-zinc-300 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                By participating in RAASTA expeditions, travelers agree to uphold environmental leave-no-trace ethics and respect local community traditions across all routes.
              </p>
            </div>
          </div>

          {/* Checkbox Acknowledgment */}
          <div className="px-6 sm:px-8 pt-4 pb-2">
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-amber-500 bg-black border-white/30 focus:ring-amber-400 cursor-pointer accent-amber-400"
              />
              <span className="text-xs text-zinc-300 font-light leading-relaxed group-hover:text-white transition-colors">
                I acknowledge and agree to the <strong className="text-white font-medium">Privacy Policy</strong>, <strong className="text-white font-medium">Terms & Conditions</strong>, and authorize RAASTA to process journey logistics.
              </span>
            </label>
          </div>

          {/* Action Bar */}
          <div className="p-6 sm:p-8 pt-4 bg-[#07080a] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3.5">
            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={onOpenFullPolicy}
                className="text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer font-display transition"
              >
                Read Full Privacy Policy
              </button>
              <span className="text-zinc-600">•</span>
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-zinc-400 hover:text-white underline underline-offset-4 cursor-pointer font-display transition"
              >
                Terms & Regulations
              </button>
            </div>

            <button
              type="button"
              disabled={!agreed}
              onClick={onAccept}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer font-display flex items-center justify-center gap-2 min-h-[44px] ${
                agreed
                  ? "bg-gradient-to-r from-amber-400 to-amber-300 text-black hover:scale-[1.02] shadow-lg shadow-amber-500/25"
                  : "bg-white/10 text-zinc-500 cursor-not-allowed opacity-50"
              }`}
            >
              <span>Accept & Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
