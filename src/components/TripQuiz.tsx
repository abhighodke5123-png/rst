/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DESTINATIONS } from "../data";
import { Destination } from "../types";
import { Sparkles, Calendar, Compass, ArrowRight, X, RotateCcw, AlertCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TripQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMatchingDestination: (destId: string) => void;
}

export default function TripQuiz({ isOpen, onClose, onSelectMatchingDestination }: TripQuizProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    terrain: "",
    vibe: "",
    timeline: ""
  });

  const [recommendation, setRecommendation] = useState<Destination | null>(null);

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ terrain: "", vibe: "", timeline: "" });
    setRecommendation(null);
  };

  const handleSelectAnswer = (key: string, val: string) => {
    const nextAnswers = { ...answers, [key]: val };
    setAnswers(nextAnswers);

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Calculate output suggestion match based on answers
      let matchId = "goa"; // default suggestion

      if (nextAnswers.terrain === "high-mountains" || nextAnswers.timeline === "long") {
        matchId = "spiti";
      } else if (nextAnswers.terrain === "coastal-cliffs" || nextAnswers.vibe === "bohemian-backlog") {
        matchId = "gokarna";
      } else {
        matchId = "goa";
      }

      const matchDest = DESTINATIONS.find((d) => d.id === matchId) || DESTINATIONS[0];
      setRecommendation(matchDest);
      setStep(4);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop lock */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          ></motion.div>

          {/* Dialog content box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="relative bg-[#0b0c10] border border-white/10 rounded-[32px] p-6 sm:p-8 w-full max-w-lg shadow-2xl z-10 text-white overflow-hidden"
          >
            {/* Design accents */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none"></div>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/5 border border-white/10 hover:bg-white/10 p-2.5 rounded-full text-zinc-400 hover:text-white transition z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {step < 4 && (
              <div className="mb-6 flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-widest text-amber-400 font-display">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Routemap Discovery Wizard • Step {step} of 3</span>
              </div>
            )}

            {/* Step 1: Terrain Choice */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display">What landscape heals your soul?</h3>
                  <p className="text-xs text-zinc-400 mt-1">Select the natural habitat you wish to map next.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "beach-sands", title: "Tropical Coconut Beaches", desc: "Golden sands, waving palm trees, and coastal sea breezes.", icon: "🌴" },
                    { id: "coastal-cliffs", title: "Ocean Clifftops & Secret Bays", desc: "Rugged cliffs falling directly into quiet blue surfing coves.", icon: "🧗" },
                    { id: "high-mountains", title: "High-Altitude Mountains", desc: "Wind-swept canyons, snow valleys, and deep mystic monasteries.", icon: "🏔" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer("terrain", opt.id)}
                      className="w-full text-left p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-amber-400/50 hover:bg-white/10 transition flex items-center gap-4 group cursor-pointer"
                    >
                      <span className="text-2xl shrink-0 group-hover:scale-110 transition">{opt.icon}</span>
                      <div>
                        <span className="text-sm font-bold text-white block transition group-hover:text-amber-400 font-display">{opt.title}</span>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Vibe choice */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display">What vibe are you chasing?</h3>
                  <p className="text-xs text-zinc-400 mt-1">Our loops cater to distinct state-of-mind experiences.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "social-dance", title: "Social Gatherings & Heritage Walks", desc: "Late-night beach food clubs, music bands, and historical neighborhood explorations.", icon: "🎸" },
                    { id: "bohemian-backlog", title: "Cliff Trekking & Camper Bonfires", desc: "Singing acoustic jams under star spheres, sleeping in tents, and simple cafe chats.", icon: "🔥" },
                    { id: "spiritual-sacred", title: "Tibetan Chantings & Solitary Vistas", desc: "Drinking butter tea with monks, quiet meditation loops, and rugged peak photography.", icon: "🧘" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer("vibe", opt.id)}
                      className="w-full text-left p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-amber-400/50 hover:bg-white/10 transition flex items-center gap-4 group cursor-pointer"
                    >
                      <span className="text-2xl shrink-0 group-hover:scale-110 transition">{opt.icon}</span>
                      <div>
                        <span className="text-sm font-bold text-white block transition group-hover:text-amber-400 font-display">{opt.title}</span>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Timeline */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display">How long can you get lost?</h3>
                  <p className="text-xs text-zinc-400 mt-1">Caravans range from quick escapes to deep mountain voyages.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "weekend", title: "3-4 Days (Quick Escape)", desc: "Short, intense bursts of road experiences starting on Thursday night.", icon: "⚡" },
                    { id: "medium", title: "4-5 Days (Backpacker Trail)", desc: "Perfect sweet spot to conquer coastal trekking routes.", icon: "⛺" },
                    { id: "long", title: "9+ Days (Grand Expedition)", desc: "Deep, fully-immersive expedition requiring altitude acclimatization.", icon: "🗺" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer("timeline", opt.id)}
                      className="w-full text-left p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-amber-400/50 hover:bg-white/10 transition flex items-center gap-4 group cursor-pointer"
                    >
                      <span className="text-2xl shrink-0 group-hover:scale-110 transition">{opt.icon}</span>
                      <div>
                        <span className="text-sm font-bold text-white block transition group-hover:text-amber-400 font-display">{opt.title}</span>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Result recommendation display */}
            {step === 4 && recommendation && (
              <div className="space-y-6">
                <div className="text-center pb-4 border-b border-white/10">
                  <div className="text-3xl mb-1 flex justify-center">✨</div>
                  <h3 className="text-xs uppercase font-bold tracking-widest text-amber-400 font-display">
                    Your Optimum RAASTA Match Is Resolved
                  </h3>
                  <h4 className="text-3xl font-black text-white font-display mt-1">
                    {recommendation.name} Exp.
                  </h4>
                </div>

                {/* Banner mock thumbnail */}
                <div className="h-44 rounded-2xl overflow-hidden relative border border-white/10">
                  <img
                    alt={recommendation.name}
                    src={recommendation.image}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-amber-400 border border-white/10 uppercase tracking-wider font-display">
                    {recommendation.season} • {recommendation.duration}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed text-center font-light">
                    "{recommendation.desc}"
                  </p>

                  <div className="space-y-2 bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block font-display">
                      Why this fits your profile:
                    </span>
                    <ul className="space-y-1.5">
                      {recommendation.highlights.slice(0, 2).map((hl) => (
                        <li key={hl} className="flex items-center gap-2 text-xs text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between gap-4">
                  <button
                    onClick={resetQuiz}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 transition text-xs font-bold uppercase tracking-wider cursor-pointer font-display"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart
                  </button>

                  <button
                    onClick={() => {
                      onSelectMatchingDestination(recommendation.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-black hover:bg-amber-300 transition text-xs font-black uppercase tracking-widest cursor-pointer shadow-lg shadow-amber-500/20 font-display"
                  >
                    Lock Caravan & Book
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
