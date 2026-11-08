import React, { useState } from "react";
import { FAQS } from "../data";
import { ChevronDown, Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Search, Sparkles, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AboutContact() {
  const [activeFaq, setActiveFaq] = useState<string | null>(FAQS[0]?.id || null);
  const [faqSearch, setFaqSearch] = useState("");

  // Enquiry form states
  const [inqName, setInqName] = useState("");
  const [inqEmail, setInqEmail] = useState("");
  const [inqPhone, setInqPhone] = useState("");
  const [inqMsg, setInqMsg] = useState("");
  const [inqDest, setInqDest] = useState("Spiti Valley Expeditions");
  const [success, setSuccess] = useState(false);

  const toggleFaq = (id: string) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName || !inqEmail || !inqPhone) return;

    // Direct WhatsApp dispatch with proper formatting
    const message = `*Raasta Trips - Website Message*%0A` +
      `*Name:* ${encodeURIComponent(inqName)}%0A` +
      `*Email:* ${encodeURIComponent(inqEmail)}%0A` +
      `*Phone:* ${encodeURIComponent(inqPhone)}%0A` +
      `*Destination:* ${encodeURIComponent(inqDest)}%0A` +
      `*Message:* ${encodeURIComponent(inqMsg || "Looking for trip information")}`;

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
    <section id="contact" className="py-24 sm:py-32 px-6 bg-[#182622] relative border-t border-[#8C9A82]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#202522] border border-[#8C9A82]/30 text-[#D4A96C] text-xs font-semibold uppercase tracking-widest mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Assistance & FAQs</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#EDE9DF] tracking-tight">
            Frequently Asked <span className="italic text-[#D4A96C]">Questions</span>
          </h2>
          <p className="text-[#EDE9DF]/80 text-base sm:text-lg font-light leading-relaxed mt-4">
            Everything you need to know about safety protocols, micro-group caps, bookings, and life on the road with Raasta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: FAQ Accordion with Live Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9A82]" />
              <input
                type="text"
                placeholder="Search FAQs (e.g. solo traveler, refunds, high altitude)..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full bg-[#202522] border border-[#8C9A82]/30 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-[#EDE9DF] placeholder-[#EDE9DF]/40 focus:outline-none focus:border-[#D4A96C]"
              />
            </div>

            <div className="space-y-3.5">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = activeFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-[#202522] border border-[#8C9A82]/25 rounded-2xl overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 hover:bg-[#182622]/40 transition-colors cursor-pointer"
                      >
                        <span className="text-sm sm:text-base font-serif font-bold text-[#EDE9DF]">
                          {faq.question}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-[#D4A96C] transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#EDE9DF]/80 font-light leading-relaxed border-t border-[#8C9A82]/15 pt-3"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-[#202522] rounded-2xl text-xs text-[#EDE9DF]/60">
                  No matching question found. Feel free to contact our team directly below.
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Direct Contact Form & Operations Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Form */}
            <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[32px] p-7 sm:p-8 shadow-xl">
              <h3 className="text-2xl font-serif font-bold text-[#EDE9DF] mb-2">
                Talk to a <span className="italic text-[#D4A96C]">Trip Specialist</span>
              </h3>
              <p className="text-xs text-[#EDE9DF]/70 font-light leading-relaxed mb-6">
                Have specific dates or want a private group itinerary? Send a note and our founding leads will get back to you.
              </p>

              {success && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Redirecting to WhatsApp with your details...</span>
                </div>
              )}

              <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-4 py-3 text-xs text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#D4A96C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Phone *"
                    value={inqPhone}
                    onChange={(e) => setInqPhone(e.target.value)}
                    className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-4 py-3 text-xs text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#D4A96C]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={inqEmail}
                    onChange={(e) => setInqEmail(e.target.value)}
                    className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-4 py-3 text-xs text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#D4A96C]"
                  />
                </div>

                <div>
                  <select
                    value={inqDest}
                    onChange={(e) => setInqDest(e.target.value)}
                    className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-3 py-3 text-xs text-[#EDE9DF] focus:outline-none focus:border-[#D4A96C] cursor-pointer"
                  >
                    <option value="Spiti Valley Expeditions">Spiti Valley High Desert (Himachal)</option>
                    <option value="Ladakh & Nubra Valley">Ladakh & Nubra Valley (Himalayas)</option>
                    <option value="Meghalaya Highlands">Meghalaya Rainforest & Living Bridges</option>
                    <option value="Gokarna & Karwar">Gokarna & Karwar Coastal Trail</option>
                    <option value="Jaisalmer Desert Caravans">Jaisalmer & Thar Desert Caravan</option>
                    <option value="Goa Coastal Heritage">Goa Offbeat Coastal & Heritage</option>
                    <option value="Custom Group Itinerary">Custom Corporate or Private Group</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your group size, tentative month, or preferences..."
                    value={inqMsg}
                    onChange={(e) => setInqMsg(e.target.value)}
                    className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-4 py-3 text-xs text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#D4A96C] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#D4A96C] hover:bg-[#d8b37c] text-[#182622] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message & Connect</span>
                </button>
              </form>
            </div>

            {/* Direct Contact Credentials Card */}
            <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[28px] p-6 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4A96C] block">
                Direct Operations Desk
              </span>
              <div className="space-y-3 text-xs text-[#EDE9DF]/80">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+91 9226638440 (Phone & WhatsApp)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#D4A96C] shrink-0" />
                  <span>raastatrips.in@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#8C9A82] shrink-0" />
                  <span>Operations: 9:00 AM – 8:30 PM IST (Mon – Sat)</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
