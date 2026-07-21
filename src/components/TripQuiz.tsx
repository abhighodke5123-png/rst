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
            className="absolute inset-0 bg-white/85 backdrop-blur-sm"
          ></motion.div>

          {/* Dialog content box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="relative bg-zinc-50 border border-zinc-300 rounded-2.5xl p-6 sm:p-8 w-full max-w-lg shadow-2xl z-10 text-black overflow-hidden"
          >
            {/* Design accents */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none"></div>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-zinc-100 border border-transparent hover:border-zinc-200 p-2 rounded-full text-zinc-600 hover:text-black transition z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {step < 4 && (
              <div className="mb-6 flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-widest text-zinc-500">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                <span>Routemap Discovery Wizard • Step {step} of 3</span>
              </div>
            )}

            {/* Step 1: Terrain Choice */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-black">What landscape heals your soul?</h3>
                  <p className="text-xs text-zinc-600 mt-1">Select the natural habitat you wish to map next.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "beach-sands", title: "Tropical Coconut Beaches", desc: "Golden sands, waving palm trees, and coastal sea breezes.",icon: "🌴" },
                    { id: "coastal-cliffs", title: "Ocean Clifftops & Secret Bays", desc: "Rugged cliffs falling directly into quiet blue surfing coves.", icon: "🧗" },
                    { id: "high-mountains", title: "High-Altitude Mountains", desc: "Wind-swept canyons, snow valleys, and deep mystic monasteries.", icon: "🏔" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer("terrain", opt.id)}
                      className="w-full text-left p-4 rounded-xl border border-zinc-200 bg-zinc-100/40 hover:border-zinc-600 hover:bg-zinc-100 transition flex items-center gap-4 group"
                    >
                      <span className="text-2xl shrink-0 group-hover:scale-110 transition">{opt.icon}</span>
                      <div>
                        <span className="text-sm font-bold text-zinc-800 block transition group-hover:text-black">{opt.title}</span>
                        <span className="text-[11px] text-zinc-500 block mt-0.5">{opt.desc}</span>
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
                  <h3 className="text-xl sm:text-2xl font-extrabold text-black">What vibe are you chasing?</h3>
                  <p className="text-xs text-zinc-600 mt-1">Our loops cater to distinct state-of-mind experiences.</p>
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
                      className="w-full text-left p-4 rounded-xl border border-zinc-200 bg-zinc-100/40 hover:border-zinc-600 hover:bg-zinc-100 transition flex items-center gap-4 group"
                    >
                      <span className="text-2xl shrink-0 group-hover:scale-110 transition">{opt.icon}</span>
                      <div>
                        <span className="text-sm font-bold text-zinc-800 block transition group-hover:text-black">{opt.title}</span>
                        <span className="text-[11px] text-zinc-500 block mt-0.5">{opt.desc}</span>
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
                  <h3 className="text-xl sm:text-2xl font-extrabold text-black">How long can you get lost?</h3>
                  <p className="text-xs text-zinc-600 mt-1">Caravans range from quick escapes to deep mountain voyages.</p>
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
                      className="w-full text-left p-4 rounded-xl border border-zinc-200 bg-zinc-100/40 hover:border-zinc-600 hover:bg-zinc-100 transition flex items-center gap-4 group"
                    >
                      <span className="text-2xl shrink-0 group-hover:scale-110 transition">{opt.icon}</span>
                      <div>
                        <span className="text-sm font-bold text-zinc-800 block transition group-hover:text-black">{opt.title}</span>
                        <span className="text-[11px] text-zinc-500 block mt-0.5">{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Result recommendation display */}
            {step === 4 && recommendation && (
              <div className="space-y-6">
                <div className="text-center pb-4 border-b border-zinc-200">
                  <div className="text-3xl mb-1 flex justify-center">✨</div>
                  <h3 className="text-sm uppercase font-extrabold tracking-widest text-yellow-500">
                    Your Optimum RAASTA Match Is Resolved
                  </h3>
                  <h4 className="text-3xl font-extrabold text-black mt-1">
                    {recommendation.name} Exp.
                  </h4>
                </div>

                {/* Banner mock thumbnail */}
                <div className="h-40 rounded-xl overflow-hidden relative">
                  <img
                    alt={recommendation.name}
                    src={recommendation.image}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 bg-white/60 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 uppercase">
                    {recommendation.season} • {recommendation.duration}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed text-center">
                    "{recommendation.desc}"
                  </p>

                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                      Why this fits your profile:
                    </span>
                    <ul className="space-y-1.5">
                      {recommendation.highlights.slice(0, 2).map((hl) => (
                        <li key={hl} className="flex items-center gap-2 text-xs text-zinc-450">
                          <Check className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-200 flex justify-between gap-4">
                  <button
                    onClick={resetQuiz}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 text-zinc-600 hover:text-black hover:bg-zinc-100 transition text-xs font-semibold uppercase tracking-wider"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart
                  </button>

                  <button
                    onClick={() => {
                      onSelectMatchingDestination(recommendation.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white hover:bg-yellow-500 hover:text-black transition text-xs font-extrabold uppercase tracking-widest"
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
