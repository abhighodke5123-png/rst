import React, { useState } from "react";
import { FAQS } from "../data";
import { ChevronDown, Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Search, Sparkles, Clock, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AboutContact() {
  const [activeFaq, setActiveFaq] = useState<string | null>(FAQS[0]?.id || null);
  const [faqSearch, setFaqSearch] = useState("");

  // Inquiry form states
  const [inqName, setInqName] = useState("");
  const [inqEmail, setInqEmail] = useState("");
  const [inqPhone, setInqPhone] = useState("");
  const [inqMsg, setInqMsg] = useState("");
  const [inqDest, setInqDest] = useState("Goa Beach & Party Escape");
  const [success, setSuccess] = useState(false);

  const toggleFaq = (id: string) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName || !inqEmail || !inqPhone) return;

    // Direct WhatsApp dispatch
    const message = `*Raasta Road Trip Inquiry*%0A*Name:* ${encodeURIComponent(inqName)}%0A*Email:* ${encodeURIComponent(inqEmail)}%0A*Phone:* ${encodeURIComponent(inqPhone)}%0A*Destination:* ${encodeURIComponent(inqDest)}%0A*Message:* ${encodeURIComponent(inqMsg || "Looking for trip details")}`;
    window.open(`https://wa.me/919226638440?text=${message}`, "_blank");

    setSuccess(true);
    setInqName("");
    setInqEmail("");
    setInqPhone("");
    setInqMsg("");

    setTimeout(() => {
      setSuccess(false);
    }, 4500);
  };

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <section id="contact" className="py-32 px-6 bg-[#07080a] relative border-t border-white/5 overflow-hidden">
      {/* Visual lighting */}
      <div className="absolute left-1/3 top-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block font-display">
            Direct Operations & FAQs
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display leading-tight">
            Frequently Asked <span className="font-editorial text-amber-300 font-normal italic text-5xl sm:text-6xl md:text-7xl">Questions</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mt-4 font-light">
            Everything you need to know about safety protocols, 4x4 captain standards, gear recommendations, and joining the Raasta family.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Interactive FAQ Accordion with Live Search */}
          <div className="lg:col-span-7 space-y-6">
            {/* Search FAQ Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search FAQs (e.g., solo traveler, refund policy, high altitude permits)..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 transition-colors"
              />
            </div>

            {/* FAQs List */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = activeFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="glass border border-white/10 rounded-[28px] overflow-hidden transition-all duration-300 hover:border-white/20"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full text-left p-6 flex justify-between items-center gap-6 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <span className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
                          {faq.question}
                        </span>
                        <div
                          className={`p-2 rounded-full border shrink-0 transition-colors ${
                            isOpen ? "bg-amber-400 text-black border-amber-400" : "bg-white/5 text-zinc-400 border-white/10"
                          }`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-6 text-sm text-zinc-300 leading-relaxed font-light border-t border-white/5 pt-4">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 glass border border-white/10 rounded-[28px] text-center text-zinc-500">
                  <p className="text-sm font-display text-white">No matching questions found.</p>
                  <button
                    onClick={() => setFaqSearch("")}
                    className="text-xs text-amber-400 underline font-bold mt-2 cursor-pointer uppercase tracking-wider"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Direct Contact Form & Helpline Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Fast WhatsApp & Call Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://wa.me/919226638440?text=Hi%20RAASTA,%20I'd%20like%20to%20inquire%20about%20upcoming%20trips!"
                target="_blank"
                rel="noreferrer"
                className="glass border border-white/10 rounded-[24px] p-5 hover:border-[#25D366]/40 transition group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 bg-[#25D366]/10 text-[#25D366] rounded-xl">
                    <MessageSquare className="w-5 h-5" />
                  </span>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest font-display">Instant</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5 font-display">WhatsApp Ops</h4>
                  <p className="text-xs text-zinc-400 font-mono">+91 9226638440</p>
                </div>
              </a>

              <a
                href="tel:+919226638440"
                className="glass border border-white/10 rounded-[24px] p-5 hover:border-amber-400/40 transition group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 bg-amber-400/10 text-amber-400 rounded-xl">
                    <Phone className="w-5 h-5" />
                  </span>
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest font-display">Direct</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5 font-display">Helpline</h4>
                  <p className="text-xs text-zinc-400 font-mono">+91 9226638440</p>
                </div>
              </a>
            </div>

            {/* Custom Trip Inquiry Box */}
            <div className="glass border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="p-2 bg-amber-400/10 text-amber-400 rounded-xl">
                  <Send className="w-4 h-4" />
                </span>
                <h3 className="text-xl font-black text-white font-display">Custom Trip Inquiry</h3>
              </div>

              <p className="text-xs text-zinc-400 mb-6 font-light">
                Planning a bespoke private charter, corporate offsite, or college expedition? Reach our route planners directly.
              </p>

              {success && (
                <div className="mb-6 p-4 glass border-emerald-400/40 text-emerald-400 text-xs font-semibold rounded-2xl flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Inquiry dispatched to WhatsApp! Our road captain will reach out shortly.</span>
                </div>
              )}

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 font-display">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    placeholder="e.g. Rohith Verma"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 font-display">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={inqEmail}
                      onChange={(e) => setInqEmail(e.target.value)}
                      placeholder="rohith@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 font-display">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={inqPhone}
                      onChange={(e) => setInqPhone(e.target.value)}
                      placeholder="9226638440"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 font-display">
                    Preferred Route or Destination
                  </label>
                  <select
                    value={inqDest}
                    onChange={(e) => setInqDest(e.target.value)}
                    className="w-full bg-[#12141c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/60"
                  >
                    <option value="Goa Beach & Party Escape">Goa Beach & Party Escape</option>
                    <option value="Gokarna Beach Trek Combo">Gokarna Beach Trek Combo</option>
                    <option value="Spiti Valley High Altitude Expedition">Spiti Valley High Altitude Expedition</option>
                    <option value="Custom Private Route">Custom Private Route (Group / Corporate)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 font-display">
                    Message / Special Requests
                  </label>
                  <textarea
                    rows={3}
                    value={inqMsg}
                    onChange={(e) => setInqMsg(e.target.value)}
                    placeholder="Number of travelers, tentative dates, or custom route requests..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60 resize-none font-light"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-widest transition shadow-lg shadow-amber-500/20 cursor-pointer font-display"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Send Instant Inquiry via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
