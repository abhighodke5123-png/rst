import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Calendar,
  DollarSign,
  Users,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Backpack,
  MapPin,
  ChevronDown,
  ChevronUp,
  Send,
  RefreshCw,
  Clock,
  ExternalLink
} from "lucide-react";

interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: string[];
  placesVisited: string[];
  mealsRecommended: string;
  localSecretTip: string;
}

interface AIPlanResult {
  tripTitle: string;
  vibeSummary: string;
  itinerary: ItineraryDay[];
  packingEssentials: string[];
  safetyAdvisories: string[];
  estimatedBudgetBreakdown: {
    stay: string;
    travel: string;
    activities: string;
    food: string;
  };
  whatsappText: string;
}

export default function AITripPlanner() {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("moderate");
  const [travellers, setTravellers] = useState("friends");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<AIPlanResult | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const interestOptions = [
    { id: "beaches", label: "Beaches & Lagoons", emoji: "🏖️" },
    { id: "treks", label: "Mountain Treks & Cliffs", emoji: "🥾" },
    { id: "history", label: "Heritage & Forts", emoji: "🏰" },
    { id: "nightlife", label: "Nightlife & Shacks", emoji: "🎶" },
    { id: "waterfalls", label: "Secret Waterfalls", emoji: "💦" },
    { id: "cuisine", label: "Local Culinary Trails", emoji: "🍛" },
    { id: "photography", label: "Sunset Points & Photo Walks", emoji: "📸" },
  ];

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const generateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setError("Please specify your dream destination first.");
      return;
    }

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const response = await fetch("/api/ai/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          duration,
          interests: selectedInterests,
          budget,
          travellers,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to customize your adventure.");
      }

      setPlan(data);
      setExpandedDay(1); // Auto-expand day 1
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while calling the travel matrix.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppEnquiry = () => {
    if (!plan) return;
    const whatsappNumber = "919900990099"; // RAASTA Travels Captain Contact
    const encodedText = encodeURIComponent(plan.whatsappText);
    const url = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
    window.open(url, "_blank");
  };

  return (
    <section id="ai-planner" className="py-24 px-6 bg-[#09090b] border-t border-zinc-900 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-brand-orange font-mono text-[10px] uppercase tracking-widest rounded-full">
            Unscripted Travel Matrix
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-4 tracking-tight text-white">
            Custom AI Trip Planner
          </h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto font-light leading-relaxed">
            Skip the generic tourist guides. Our customized generative engine curates unscripted itineraries loaded with local hidden spots, cliffside sunset views, and cozy accommodations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form questionnaire card */}
          <div className="lg:col-span-5 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Compass className="w-5 h-5 text-brand-orange" /> Plan Your Quest
            </h3>

            <form onSubmit={generateItinerary} className="space-y-6">
              {/* Destination */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Where to?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Munnar, Gokarna, Spiti Valley, Wayanad"
                    className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-brand-orange focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-white transition-all placeholder:text-zinc-600"
                    required
                  />
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Duration (Days)
                  </label>
                  <span className="text-xs font-mono font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">
                    {duration} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                  <span>2d</span>
                  <span>4d</span>
                  <span>6d</span>
                  <span>8d</span>
                  <span>10d</span>
                </div>
              </div>

              {/* Two Column details: Budget & Companions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Budget Tier
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-brand-orange focus:outline-none rounded-xl px-3 py-3 text-xs text-white transition-all"
                  >
                    <option value="budget">Backpacker / Budget</option>
                    <option value="moderate">Moderate / Comfort</option>
                    <option value="premium">Premium / Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Traveller Type
                  </label>
                  <select
                    value={travellers}
                    onChange={(e) => setTravellers(e.target.value)}
                    className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-brand-orange focus:outline-none rounded-xl px-3 py-3 text-xs text-white transition-all"
                  >
                    <option value="solo">Solo Nomad</option>
                    <option value="friends">Group of Friends</option>
                    <option value="couple">Couple Escape</option>
                    <option value="family">Family Trip</option>
                  </select>
                </div>
              </div>

              {/* Interests Checklist */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Interests & Vibe
                </label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((opt) => {
                    const isSelected = selectedInterests.includes(opt.id);
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => handleInterestToggle(opt.id)}
                        className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border transition-all ${
                          isSelected
                            ? "bg-brand-orange/10 border-brand-orange text-brand-orange font-semibold"
                            : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                        }`}
                      >
                        <span>{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-white text-zinc-950 hover:bg-brand-orange hover:text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-orange/15 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Plotting Custom Trail...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-brand-orange" />
                    Generate Custom Itinerary
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Plan Container */}
          <div className="lg:col-span-7 min-h-[450px]">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-zinc-900/20 border border-zinc-800 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center space-y-6 min-h-[450px]"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-orange animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Querying the Road Trip Matrix</h4>
                    <p className="text-zinc-500 text-xs mt-2 max-w-sm mx-auto font-light leading-relaxed">
                      Consulting local maps, unearthing clifftop vantage points, and packaging hidden homestays for an exceptional trip...
                    </p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-950/20 border border-red-900/30 text-red-400 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[450px]"
                >
                  <AlertTriangle className="w-12 h-12 text-red-500" />
                  <div>
                    <h4 className="text-white font-bold text-lg">Trip Generation Halted</h4>
                    <p className="text-zinc-400 text-xs mt-2 max-w-md mx-auto leading-relaxed">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-zinc-900 text-xs text-white border border-zinc-800 rounded-lg hover:bg-zinc-800 transition"
                  >
                    Retry Query
                  </button>
                </motion.div>
              )}

              {!loading && !error && !plan && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-zinc-900/20 border border-zinc-900 border-dashed rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[450px]"
                >
                  <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                    <Sparkles className="w-6 h-6 text-zinc-500" />
                  </div>
                  <div>
                    <h4 className="text-zinc-400 font-bold">Your Custom Matrix Awaits</h4>
                    <p className="text-zinc-600 text-xs mt-2 max-w-sm mx-auto font-light leading-relaxed">
                      Fill out the destination questionnaire on the left to instantly generate a day-by-day tailored travel plan with dynamic packing lists, safety briefs, and WhatsApp quoting tools.
                    </p>
                  </div>
                </motion.div>
              )}

              {!loading && !error && plan && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Title card banner */}
                  <div className="bg-gradient-to-r from-zinc-900 to-zinc-900/60 border border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <span className="px-2.5 py-1 bg-brand-emerald/15 text-brand-emerald text-[9px] font-mono uppercase tracking-wider rounded-md font-bold">
                        AI Complete
                      </span>
                    </div>

                    <h4 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      {plan.tripTitle}
                    </h4>
                    <p className="text-brand-orange font-mono text-xs mt-1.5 font-semibold uppercase tracking-wider">
                      {duration} Days / {duration - 1} Nights Tailored Quest
                    </p>
                    <p className="text-zinc-400 text-sm mt-3 font-light leading-relaxed">
                      {plan.vibeSummary}
                    </p>
                  </div>

                  {/* Day-by-Day Itinerary Dropdowns */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider pl-1 mb-2">
                      Day-By-Day Adventure Loop
                    </h5>

                    {plan.itinerary.map((day) => {
                      const isExpanded = expandedDay === day.dayNumber;
                      return (
                        <div
                          key={day.dayNumber}
                          className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden transition-all hover:border-zinc-700"
                        >
                          <button
                            onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                            className="w-full p-4 flex justify-between items-center bg-zinc-900/50 hover:bg-zinc-900 text-left transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-brand-orange text-white rounded-lg flex items-center justify-center font-mono text-xs font-bold">
                                D{day.dayNumber}
                              </span>
                              <div>
                                <h6 className="text-white text-sm font-bold">{day.title}</h6>
                                <p className="text-[11px] text-zinc-500 font-light truncate max-w-xs md:max-w-md">
                                  {day.placesVisited.join(" • ")}
                                </p>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-zinc-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-zinc-500" />
                            )}
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-5 border-t border-zinc-800/50 bg-zinc-950/40 text-xs md:text-sm space-y-4">
                                  {/* Activities List */}
                                  <div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                                      Key Activities
                                    </span>
                                    <ul className="space-y-1.5">
                                      {day.activities.map((act, i) => (
                                        <li key={i} className="flex items-start gap-2 text-zinc-300">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald mt-0.5 flex-shrink-0" />
                                          <span>{act}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Culinary Recom */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
                                    <div>
                                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                                        Meals & Culinary Recommendation
                                      </span>
                                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                                        {day.mealsRecommended}
                                      </p>
                                    </div>

                                    <div>
                                      <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block mb-1">
                                        Captain's Secret Tip
                                      </span>
                                      <p className="text-zinc-400 text-xs italic font-light leading-relaxed bg-brand-orange/5 p-2 rounded-lg border border-brand-orange/10">
                                        {day.localSecretTip}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {/* Packing & Budget Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Packing Essentials */}
                    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5">
                      <h6 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                        <Backpack className="w-4 h-4 text-brand-orange" /> Packing Essentials
                      </h6>
                      <ul className="text-xs space-y-2 text-zinc-400">
                        {plan.packingEssentials.map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Budget Estimate */}
                    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5">
                      <h6 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                        <DollarSign className="w-4 h-4 text-brand-emerald" /> Estimated Budget ({budget})
                      </h6>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-900">
                          <span className="text-[10px] text-zinc-500 block">Stays & Hostels</span>
                          <span className="font-semibold text-white mt-0.5 block">{plan.estimatedBudgetBreakdown.stay}</span>
                        </div>
                        <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-900">
                          <span className="text-[10px] text-zinc-500 block">Road Travel</span>
                          <span className="font-semibold text-white mt-0.5 block">{plan.estimatedBudgetBreakdown.travel}</span>
                        </div>
                        <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-900">
                          <span className="text-[10px] text-zinc-500 block">Activities</span>
                          <span className="font-semibold text-white mt-0.5 block">{plan.estimatedBudgetBreakdown.activities}</span>
                        </div>
                        <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-900">
                          <span className="text-[10px] text-zinc-500 block">Food & Drink</span>
                          <span className="font-semibold text-white mt-0.5 block">{plan.estimatedBudgetBreakdown.food}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Safety advisories */}
                  <div className="bg-amber-950/10 border border-amber-900/30 rounded-2xl p-4 flex gap-3 text-xs text-zinc-400">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-zinc-300 block mb-1">Safety Advisory Brief</span>
                      <p className="font-light leading-relaxed">
                        {plan.safetyAdvisories.join(". ")}
                      </p>
                    </div>
                  </div>

                  {/* Quoting & Contact CTA Block */}
                  <div className="bg-gradient-to-r from-brand-orange to-amber-600 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl shadow-brand-orange/10 relative overflow-hidden">
                    {/* Visual pattern overlay */}
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/5 rounded-full blur-[60px] pointer-events-none"></div>

                    <div className="space-y-1.5 relative z-10">
                      <h4 className="text-xl font-extrabold tracking-tight">Lock in this custom adventure?</h4>
                      <p className="text-white/80 text-xs font-light max-w-md leading-relaxed">
                        Enquire now on WhatsApp with this complete AI-generated itinerary. A RAASTA Travels captain will respond within minutes with a premium group price and availability!
                      </p>
                    </div>

                    <button
                      onClick={handleWhatsAppEnquiry}
                      className="w-full md:w-auto px-6 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg relative z-10 group cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-brand-emerald fill-brand-emerald group-hover:scale-110 transition-transform" />
                      Send Plan to WhatsApp
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
