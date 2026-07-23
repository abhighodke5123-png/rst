/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FAQS } from "../data";
import { ChevronDown, Mail, Phone, MapPin, Send, CheckSquare, X, Info, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AboutContact() {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  // Inquiry form states
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inqName, setInqName] = useState("");
  const [inqEmail, setInqEmail] = useState("");
  const [inqMsg, setInqMsg] = useState("");
  const [inqDest, setInqDest] = useState("spiti");
  const [success, setSuccess] = useState(false);

  const toggleFaq = (id: string) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName || !inqEmail || !inqMsg) return;

    setSuccess(true);
    setInqName("");
    setInqEmail("");
    setInqMsg("");
    setInquiryOpen(false);

    setTimeout(() => {
      setSuccess(false);
    }, 4500);
  };

  return (
    <section id="about" className="py-32 px-6 bg-[#040404] relative border-t border-white/5">
      {/* Background accents */}
      <div className="absolute left-1/3 top-1/4 w-[500px] h-[500px] bg-brand-emerald/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Brand Philosophy Context Column */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                About the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-emerald">RAASTA movement.</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mt-6 font-light">
                We design unscripted highway journeys for individuals seeking comfort, tightly bound traveler families, and genuine environmental reverence.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed mt-4 font-light">
                Over 2,500 travelers have navigated our cliff routes, deep Himalayan loops, and tropical coastlines. We are committed to leaving every place cleaner than we found it.
              </p>
            </div>
          </div>

          {/* Accordion FAQ Area Row column */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Frequently Asked <br/><span className="text-zinc-500">Questions.</span>
              </h3>
            </div>

            {success && (
              <div className="p-5 glass border-brand-emerald/30 text-brand-emerald text-sm font-medium rounded-2xl flex items-center gap-3 animate-fade-in">
                <CheckSquare className="w-5 h-5 shrink-0" />
                <span>Success! Inquiry details have been logged. A custom route manager will contact you within 6 hours.</span>
              </div>
            )}

            <div className="space-y-4">
              {FAQS.map((faq) => {
                const isOpen = activeFaq === faq.id;
                
                return (
                  <div
                    key={faq.id}
                    className="glass border border-white/10 rounded-[24px] overflow-hidden transition-all duration-300 hover:border-white/20"
                  >
                    {/* Header bar trigger click */}
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left p-6 sm:p-8 flex justify-between items-center gap-6 hover:bg-white/5 transition-colors duration-300"
                    >
                      <span className="text-base sm:text-lg font-semibold text-white tracking-wide">
                        {faq.question}
                      </span>
                      <div className={`p-2 rounded-full border border-white/10 transition-colors ${isOpen ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-400'}`}>
                        <ChevronDown
                          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Answer collapsible details */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 sm:px-8 pb-8 text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CUSTOM INQUIRY OVERLAY MODAL */}
      <AnimatePresence>
        {inquiryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInquiryOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass border border-white/10 rounded-[40px] p-8 w-full max-w-xl shadow-2xl relative z-10"
            >
              <button
                onClick={() => setInquiryOpen(false)}
                className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 p-3 rounded-full text-zinc-400 hover:text-white transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8 flex items-center gap-4">
                <div className="p-3 bg-brand-orange/20 border border-brand-orange/30 rounded-2xl text-brand-orange">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Charter Custom Caravan</h3>
                  <p className="text-sm text-zinc-400 mt-1 font-light">Submit customized loops, private family dates, or special group specs.</p>
                </div>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-2 tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abhi"
                      value={inqName}
                      onChange={(e) => setInqName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-2xl text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-2 tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. raastatrips.in@gmail.com"
                      value={inqEmail}
                      onChange={(e) => setInqEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-2xl text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-500 mb-2 tracking-wider">
                    Targeted Destination Route
                  </label>
                  <select
                    value={inqDest}
                    onChange={(e) => setInqDest(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-2xl text-sm text-white focus:outline-none appearance-none"
                  >
                    <option value="goa" className="bg-[#040404]">Goa Loop (Monsoon Rain Specials)</option>
                    <option value="gokarna" className="bg-[#040404]">Gokarna Cliff Path</option>
                    <option value="spiti" className="bg-[#040404]">Spiti High-Altitude circuit</option>
                    <option value="custom" className="bg-[#040404]">Completely Custom Uncharted Path</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-500 mb-2 tracking-wider">
                    Custom specifications / dates
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="e.g. Seeking personal SUVs for 6 members, corporate outing on late November..."
                    value={inqMsg}
                    onChange={(e) => setInqMsg(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-2xl text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-zinc-600 resize-none"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setInquiryOpen(false)}
                    className="px-6 py-3.5 rounded-2xl border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-2xl bg-white text-black hover:bg-zinc-200 text-sm font-bold transition-colors"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
