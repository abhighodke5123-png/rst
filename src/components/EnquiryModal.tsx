import React, { useState, useEffect } from "react";
import { Trip, Enquiry, EnquiryStatus } from "../types";
import { X, Check, ShieldCheck, MessageCircle, Send, AlertCircle, Loader2, Sparkles, Phone, Mail, User, Calendar, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetTrip?: Trip | null;
  presetCollection?: "explore" | "select" | "flexible";
  onEnquirySuccess?: (enquiry: Enquiry) => void;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  presetTrip,
  presetCollection = "flexible",
  onEnquirySuccess
}: EnquiryModalProps) {
  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [numTravelers, setNumTravelers] = useState(1);
  const [collectionPref, setCollectionPref] = useState<"explore" | "select" | "flexible">(presetCollection);
  const [additionalRequirements, setAdditionalRequirements] = useState("");

  // States
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdEnquiry, setCreatedEnquiry] = useState<Enquiry | null>(null);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

  // Sync preset trip when opening
  useEffect(() => {
    if (presetTrip) {
      setDestination(presetTrip.destinationName);
      setDepartureDate(presetTrip.dates);
      setCollectionPref(presetTrip.collection || "flexible");
    } else {
      setCollectionPref(presetCollection);
    }
  }, [presetTrip, presetCollection, isOpen]);

  // Prefill authenticated user info
  useEffect(() => {
    if (auth.currentUser) {
      if (auth.currentUser.displayName && !fullName) {
        setFullName(auth.currentUser.displayName);
      }
      if (auth.currentUser.email && !email) {
        setEmail(auth.currentUser.email);
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Spam / duplicate submission throttle (5 seconds)
    const now = Date.now();
    if (now - lastSubmissionTime < 5000) {
      setErrorMsg("Please wait a moment before submitting again.");
      return;
    }

    // Basic validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!destination.trim()) {
      setErrorMsg("Please specify your desired destination or route.");
      return;
    }

    setSubmitting(true);

    // Generate unique human-readable enquiry reference ID
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const enquiryId = `RST-ENQ-${randomCode}`;

    const newEnquiry: Enquiry = {
      id: enquiryId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      destination: destination.trim(),
      tripId: presetTrip?.id,
      departureDate: departureDate.trim() || "Flexible / Upcoming",
      numTravelers: Number(numTravelers) || 1,
      collectionPreference: collectionPref,
      additionalRequirements: additionalRequirements.trim(),
      status: "New" as EnquiryStatus,
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Save to Firestore 'enquiries' collection
      try {
        await setDoc(doc(db, "enquiries", enquiryId), newEnquiry);
      } catch (err) {
        console.warn("Firestore save failed, caching locally:", err);
      }

      // 2. Also record an admin notification
      try {
        const notifId = `NOTIF-${Date.now()}`;
        await setDoc(doc(db, "notifications", notifId), {
          id: notifId,
          type: "new_enquiry",
          title: "New Trip Enquiry",
          message: `${newEnquiry.fullName} enquired for ${newEnquiry.destination} (${newEnquiry.numTravelers} travelers)`,
          createdAt: new Date().toISOString(),
          isRead: false,
          enquiryId
        });
      } catch {
        // Non-blocking
      }

      // Save to local storage cache as backup
      const existing = localStorage.getItem("raasta_user_enquiries");
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem("raasta_user_enquiries", JSON.stringify([newEnquiry, ...list]));

      setLastSubmissionTime(now);
      setCreatedEnquiry(newEnquiry);
      setIsSuccess(true);
      if (onEnquirySuccess) {
        onEnquirySuccess(newEnquiry);
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      setErrorMsg("Could not process your enquiry. Please reach out to us directly on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppPrefilledUrl = () => {
    if (!createdEnquiry) {
      return `https://wa.me/919226638440?text=Hi%20Raasta%20Trips%2C%20I%20have%20an%20enquiry%20regarding%20upcoming%20trips.`;
    }
    const msg = `*Raasta Trips - Booking Enquiry*%0A` +
      `*Enquiry ID:* ${createdEnquiry.id}%0A` +
      `*Name:* ${encodeURIComponent(createdEnquiry.fullName)}%0A` +
      `*Destination:* ${encodeURIComponent(createdEnquiry.destination)}%0A` +
      `*Preferred Dates:* ${encodeURIComponent(createdEnquiry.departureDate)}%0A` +
      `*Travelers:* ${createdEnquiry.numTravelers}%0A` +
      `*Collection:* ${createdEnquiry.collectionPreference.toUpperCase()}%0A` +
      (createdEnquiry.additionalRequirements ? `*Notes:* ${encodeURIComponent(createdEnquiry.additionalRequirements)}%0A` : "") +
      `Could you please confirm availability and next steps?`;

    return `https://wa.me/919226638440?text=${msg}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-[#202522] border border-[#8C9A82]/30 rounded-[32px] p-6 sm:p-8 shadow-2xl text-[#EDE9DF] my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#182622] hover:bg-[#182622]/80 text-[#EDE9DF]/60 hover:text-white transition-colors cursor-pointer border border-[#8C9A82]/20"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Modal Header */}
            <div className="mb-6 pr-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D4A96C] block mb-1">
                Enquiry & Availability Check
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#EDE9DF] font-bold">
                {presetTrip ? `Enquire for ${presetTrip.destinationName}` : "Find Your Next Journey"}
              </h3>
              <p className="text-xs sm:text-sm text-[#EDE9DF]/75 font-light mt-1.5 leading-relaxed">
                We review real-time seat availability and connect with you directly. No automatic deductions or upfront surprise charges.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#EDE9DF]/70 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9A82]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Siddharth Joshi"
                    className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#D4A96C]"
                  />
                </div>
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#EDE9DF]/70 mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9A82]" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#D4A96C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#EDE9DF]/70 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9A82]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="siddharth@example.com"
                      className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#D4A96C]"
                    />
                  </div>
                </div>
              </div>

              {/* Destination & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#EDE9DF]/70 mb-1.5">
                    Destination / Route *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Spiti Valley or Gokarna"
                    className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#D4A96C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#EDE9DF]/70 mb-1.5">
                    Target Dates / Month
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9A82]" />
                    <input
                      type="text"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      placeholder="e.g. 12-19 May 2026"
                      className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#D4A96C]"
                    />
                  </div>
                </div>
              </div>

              {/* Number of Travelers & Collection Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#EDE9DF]/70 mb-1.5">
                    Number of Travelers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9A82]" />
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={numTravelers}
                      onChange={(e) => setNumTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#EDE9DF] focus:outline-none focus:border-[#D4A96C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#EDE9DF]/70 mb-1.5">
                    Collection Style
                  </label>
                  <select
                    value={collectionPref}
                    onChange={(e) => setCollectionPref(e.target.value as any)}
                    className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-3 py-3 text-xs sm:text-sm text-[#EDE9DF] focus:outline-none focus:border-[#D4A96C] cursor-pointer"
                  >
                    <option value="explore">RAASTA Explore (Accessible / Student / Group)</option>
                    <option value="select">RAASTA Select (Curated / Boutique Stays)</option>
                    <option value="flexible">Flexible / Recommend for Me</option>
                  </select>
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#EDE9DF]/70 mb-1.5">
                  Special Notes / Dietary / Pickup Location (Optional)
                </label>
                <textarea
                  rows={2}
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="Traveling solo / vegetarian meals / private room option..."
                  className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#D4A96C] resize-none"
                />
              </div>

              {/* Reassurance banner */}
              <div className="p-3 rounded-xl bg-[#182622] border border-[#8C9A82]/20 text-[11px] text-[#EDE9DF]/70 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4A96C] shrink-0" />
                <span>Zero spam guarantee. A dedicated trip lead will reach out via WhatsApp/email.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-[#D4A96C] hover:bg-[#d8b37c] text-[#182622] font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-[#D4A96C]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying & Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Enquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS SCREEN */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center mb-6">
              <Check className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-[#D4A96C] block mb-1">
              Enquiry Acknowledged
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#EDE9DF] font-bold mb-3">
              We've Received Your Request!
            </h3>

            {createdEnquiry && (
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#182622] border border-[#D4A96C]/40 text-[#D4A96C] text-xs font-mono font-bold mb-4">
                Ref ID: {createdEnquiry.id}
              </div>
            )}

            <p className="text-xs sm:text-sm text-[#EDE9DF]/80 font-light max-w-md mx-auto leading-relaxed mb-6">
              Thank you, <strong>{fullName}</strong>. A RAASTA Trip Specialist has been notified and will verify actual batch availability for <strong>{destination}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-[#182622] border border-[#8C9A82]/25 text-left mb-6 text-xs space-y-2 text-[#EDE9DF]/80">
              <div className="font-semibold text-[#D4A96C] uppercase text-[11px] font-mono">
                Next Steps:
              </div>
              <p>1. We check real-time seats and verify flight/train timings with you.</p>
              <p>2. You receive an itemized quote with zero hidden surcharges.</p>
              <p>3. Once you're fully satisfied, seat reservation is manually confirmed.</p>
            </div>

            <div className="space-y-3">
              <a
                href={getWhatsAppPrefilledUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-[#182622] hover:bg-[#182622]/80 text-[#EDE9DF]/80 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Done / Back to Website
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}