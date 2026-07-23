/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Trip, Booking } from "../types";
import { X, Calculator, ShieldCheck, MessageSquare, ExternalLink, Check } from "lucide-react";
import { motion } from "motion/react";
import { collection, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

interface BookingFormProps {
  trip: Trip;
  onClose: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
}

export default function BookingForm({ trip, onClose, onBookingSuccess }: BookingFormProps) {
  // Traveler Details Form
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [numTravelers, setNumTravelers] = useState(1);

  // Errors & Loading state
  const [errorMess, setErrorMess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Success & Redirect State
  const [isSuccess, setIsSuccess] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  // Prefill user details from Firebase Auth if available
  useEffect(() => {
    if (auth.currentUser) {
      if (auth.currentUser.displayName) {
        setFormName(auth.currentUser.displayName);
      }
      if (auth.currentUser.email) {
        setFormEmail(auth.currentUser.email);
      }
    }
  }, []);

  const baseCost = trip.price || 8999;
  const grandTotal = baseCost * numTravelers;

  // Handle direct WhatsApp Booking Submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMess("");
    setSubmitting(true);

    if (!formName.trim()) {
      setErrorMess("Please enter traveler's full name.");
      setSubmitting(false);
      return;
    }
    if (!formEmail.trim() || !formEmail.includes("@")) {
      setErrorMess("Please enter a valid email address.");
      setSubmitting(false);
      return;
    }
    if (!formPhone.trim() || formPhone.length < 8) {
      setErrorMess("Please enter a valid phone or mobile number.");
      setSubmitting(false);
      return;
    }
    if (numTravelers > trip.seatsAvailable) {
      setErrorMess(`Only ${trip.seatsAvailable} seats are available for this departure.`);
      setSubmitting(false);
      return;
    }

    const fallbackId = "RST-" + Math.floor(100000 + Math.random() * 900000);

    try {
      // 1. Create a Booking Document
      const bookingId = doc(collection(db, "bookings")).id || fallbackId;
      const newBooking = {
        id: bookingId,
        tripId: trip.id,
        tripName: trip.destinationName,
        travelerName: formName,
        email: formEmail.toLowerCase(),
        phone: formPhone,
        numTravelers: numTravelers,
        tierSelected: "Standard Package",
        addOns: {
          photographer: false,
          premiumStay: false,
          localGuide: false,
        },
        totalCost: grandTotal,
        bookingDate: trip.dates,
        status: "Confirmed",
        paymentId: "wa_direct_" + bookingId.slice(0, 5).toUpperCase(),
        paymentMethod: "WhatsApp Booking",
        paymentStatus: "Pending Confirmation"
      };

      // Try writing to database (with catch, so database connection / auth doesn't block the booking)
      try {
        const bookingRef = doc(db, "bookings", bookingId);
        await setDoc(bookingRef, newBooking);

        // 2. Decrement remaining seats count on trip
        const tripRef = doc(db, "trips", trip.id);
        const tripDoc = await getDoc(tripRef);
        if (tripDoc.exists()) {
          const tripData = tripDoc.data();
          await updateDoc(tripRef, {
            seatsAvailable: Math.max(0, (tripData.seatsAvailable || trip.seatsAvailable) - numTravelers)
          });
        }

        // 3. Add Custom Notification to Firestore
        const notifRef = doc(collection(db, "notifications"));
        await setDoc(notifRef, {
          id: notifRef.id,
          recipientEmail: formEmail.toLowerCase(),
          recipientName: formName,
          subject: `🎟️ RAASTA Booking Ticket Generated: [${newBooking.id}]`,
          bodyHtml: `<h3>WhatsApp Booking Generated</h3><p>Your WhatsApp ticket for ${trip.destinationName} has been initialized under reference code: <strong>${newBooking.id}</strong>.</p><p>We are waiting to confirm details with you on WhatsApp!</p>`,
          bodyText: `Your booking reference for ${trip.destinationName} is ${newBooking.id}. We are waiting to chat on WhatsApp!`,
          timestamp: new Date().toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          }),
          type: "booking",
          read: false
        });
      } catch (dbErr) {
        console.warn("Database sync skipped or failed. Proceeding via local / WhatsApp flow:", dbErr);
        // Fallback: Store guest booking in localStorage so it's preserved locally
        try {
          const cached = localStorage.getItem("raasta_guest_bookings");
          const guestBookings = cached ? JSON.parse(cached) : [];
          guestBookings.push(newBooking);
          localStorage.setItem("raasta_guest_bookings", JSON.stringify(guestBookings));
        } catch (storageErr) {
          console.error("Local storage sync failed:", storageErr);
        }
      }

      // 4. Construct WhatsApp Pre-filled message text
      const msgText = `Hi RAASTA! 🎒 I'd like to book a seat on the upcoming *${trip.destinationName}* caravan!

🚙 *Departure Info*:
• *Dates*: ${trip.dates}

👤 *Traveler Profile*:
• *Name*: ${formName}
• *Email*: ${formEmail}
• *Phone*: ${formPhone}
• *Seats to Reserve*: ${numTravelers} member(s)

💵 *Total Amount*: ₹${grandTotal.toLocaleString("en-IN")}
🎟️ *Booking Ref Code*: ${newBooking.id}

Looking forward to our epic road trip caravan! Let me know how to pay and lock this in. Thanks!`;

      // 5. Open WhatsApp in new tab (may be blocked by popup blocker, so we ALSO show a direct button)
      const encodedText = encodeURIComponent(msgText);
      const generatedUrl = `https://wa.me/919322309802?text=${encodedText}`;
      setWhatsappUrl(generatedUrl);
      setSuccessBooking(newBooking as any);
      setIsSuccess(true);

      try {
        window.open(generatedUrl, "_blank");
      } catch (popupErr) {
        console.warn("Popup block prevented auto-opening WhatsApp. Direct link is available.", popupErr);
      }
    } catch (err: any) {
      setErrorMess(err.message || "Failed to initialize booking details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Dark overlay backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      ></div>

      {/* Booking Dialog Body */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="relative glass border border-white/10 rounded-[32px] w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl z-20 flex flex-col custom-scrollbar"
      >
        {isSuccess ? (
          <div className="p-8 sm:p-10 flex flex-col items-center text-center">
            {/* Green glowing circle with tick */}
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_35px_rgba(16,185,129,0.25)] animate-pulse">
              <Check className="w-10 h-10 stroke-[2.5]" />
            </div>

            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              Expedition Initialized!
            </h3>
            <p className="text-sm text-zinc-400 font-light max-w-sm mb-6">
              Your seat reservation reference code is <span className="font-mono text-brand-orange font-bold text-base">{successBooking?.id}</span>.
            </p>

            {/* Receipt Summary Card */}
            <div className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl mb-8 text-left space-y-3.5 text-xs text-zinc-300">
              <div className="flex justify-between items-baseline pb-2 border-b border-white/5">
                <span className="text-zinc-500 uppercase tracking-wider font-bold text-[9px]">Expedition Route</span>
                <span className="text-white font-bold text-right">{trip.destinationName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-500 uppercase tracking-wider font-bold text-[9px]">Launch Date</span>
                <span className="text-white font-semibold">{trip.dates}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-500 uppercase tracking-wider font-bold text-[9px]">Traveler Profile</span>
                <span className="text-white font-semibold">{formName} ({numTravelers} seat{numTravelers > 1 ? "s" : ""})</span>
              </div>
              <div className="flex justify-between text-sm pt-1">
                <span className="text-zinc-400 font-bold">Total Amount Due</span>
                <span className="text-brand-orange font-extrabold text-lg">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Direct WhatsApp Actions */}
            <div className="w-full space-y-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] select-none text-center"
              >
                <MessageSquare className="w-5 h-5 fill-current shrink-0" />
                <span>Chat on WhatsApp to Confirm</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>

              <p className="text-[11px] text-zinc-500 leading-relaxed max-w-md mx-auto">
                If the WhatsApp tab didn't open automatically, please click the green button above to message our road-trip caravan coordinator and secure your booking.
              </p>
            </div>

            {/* Secondary Exit CTA */}
            <div className="pt-8 mt-4 border-t border-white/5 w-full">
              <button
                type="button"
                onClick={() => {
                  if (successBooking) {
                    onBookingSuccess(successBooking);
                  } else {
                    onClose();
                  }
                }}
                className="px-8 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center w-full"
              >
                Done (Go to My Bookings)
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header bar */}
            <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Configure Expedition Entry
            </h3>
            <p className="text-sm text-zinc-400 mt-2 font-light">
              Departing: <span className="text-brand-orange font-semibold">{trip.destinationName}</span> • {trip.dates}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5 relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMess && (
          <div className="mx-6 sm:mx-8 mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-2xl text-center">
            {errorMess}
          </div>
        )}

        <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Enter Details Section */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">
                Primary Traveler Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Abhi Ghodke"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-zinc-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">
                  Phone / Mobile
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. raastatrips.in@gmail.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">
                Number of Travelers
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={numTravelers <= 1}
                  onClick={() => setNumTravelers(numTravelers - 1)}
                  className="w-12 h-12 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 rounded-2xl flex items-center justify-center font-bold text-white transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-lg text-white">
                  {numTravelers}
                </span>
                <button
                  type="button"
                  disabled={numTravelers >= trip.seatsAvailable}
                  onClick={() => setNumTravelers(numTravelers + 1)}
                  className="w-12 h-12 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 rounded-2xl flex items-center justify-center font-bold text-white transition-colors cursor-pointer"
                >
                  +
                </button>
                <span className="text-xs text-brand-orange font-semibold tracking-wide ml-2">
                  {trip.seatsAvailable} seats available
                </span>
              </div>
            </div>
          </div>

          {/* Amount Box in the End */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-white/5 transition-transform duration-500 group-hover:scale-110">
              <Calculator className="w-32 h-32 stroke-[1]" />
            </div>
            <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-4 relative z-10">
              Booking Pricing
            </h4>
            <div className="text-sm space-y-3 text-zinc-300 relative z-10 font-light">
              <div className="flex justify-between">
                <span>Base Cost per seat</span>
                <span className="font-semibold text-white">₹{baseCost.toLocaleString("en-IN")}</span>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-baseline text-white">
                <span className="text-sm font-bold tracking-wide">Total Amount ({numTravelers} traveler{numTravelers > 1 ? "s" : ""})</span>
                <span className="text-2xl font-bold text-brand-orange">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Secure guarantees */}
          <div className="flex items-center gap-3 text-[10px] sm:text-xs text-zinc-400 font-semibold bg-white/5 p-4 rounded-2xl border border-white/10 justify-center">
            <ShieldCheck className="w-5 h-5 text-brand-emerald shrink-0" />
            <span className="uppercase tracking-wider">Confirmed via Direct WhatsApp Concierge</span>
          </div>

          {/* Button controllers */}
          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer text-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Booking...</span>
                </>
              ) : (
                <span>Confirm & Book on WhatsApp</span>
              )}
            </button>
          </div>
        </form>
        </>
        )}
      </motion.div>
    </div>
  );
}
