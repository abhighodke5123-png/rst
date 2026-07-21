/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Trip, Booking } from "../types";
import { X, Check, Calculator, Info, ShieldCheck, Sparkles } from "lucide-react";
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
  const [selectedTier, setSelectedTier] = useState("adventure"); // default to interactive Tier

  // Addons flags
  const [addPhoto, setAddPhoto] = useState(false);
  const [addStay, setAddStay] = useState(false);
  const [addGuide, setAddGuide] = useState(false);

  // Errors & Loading state
  const [errorMess, setErrorMess] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  // Tier pricing lookup
  const getTierPrice = () => {
    if (selectedTier === "explorer") return 4999;
    if (selectedTier === "premium-expedition") return 14999;
    return trip.price || 8999; // Adventure tier
  };

  const getTierName = () => {
    if (selectedTier === "explorer") return "Explorer Package";
    if (selectedTier === "premium-expedition") return "Premium Expedition Package";
    return "Adventure Package";
  };

  // Live calculation variables
  const baseCost = getTierPrice();
  const addonPhotoPrice = addPhoto ? 1500 : 0;
  const addonStayPrice = addStay ? 3000 : 0;
  const addonGuidePrice = addGuide ? 2000 : 0;
  const singleCost = baseCost + addonPhotoPrice + addonStayPrice + addonGuidePrice;
  const grandTotal = singleCost * numTravelers;

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

    try {
      // 1. Create a Booking Document in Firestore for user dashboard integration
      const bookingRef = doc(collection(db, "bookings"));
      const newBooking = {
        id: bookingRef.id,
        tripId: trip.id,
        tripName: trip.destinationName,
        travelerName: formName,
        email: formEmail.toLowerCase(),
        phone: formPhone,
        numTravelers: numTravelers,
        tierSelected: getTierName(),
        addOns: {
          photographer: addPhoto,
          premiumStay: addStay,
          localGuide: addGuide,
        },
        totalCost: grandTotal,
        bookingDate: trip.dates,
        status: "Confirmed",
        paymentId: "wa_direct_" + bookingRef.id.slice(0, 5).toUpperCase(),
        paymentMethod: "WhatsApp Booking",
        paymentStatus: "Pending Confirmation"
      };

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

      // 4. Construct WhatsApp Pre-filled message text
      const msgText = `Hi RAASTA! 🎒 I'd like to book a seat on the upcoming *${trip.destinationName}* caravan!

🚙 *Departure Info*:
• *Dates*: ${trip.dates}

👤 *Traveler Profile*:
• *Name*: ${formName}
• *Email*: ${formEmail}
• *Phone*: ${formPhone}
• *Seats to Reserve*: ${numTravelers} member(s)

📦 *Service Tier & Upgrades*:
• *Package Tier*: ${getTierName()}
${addPhoto ? "• [Add-on] Personal Photographer (+₹1,500)\n" : ""}${addStay ? "• [Add-on] Single Suite Upgrade (+₹3,000)\n" : ""}${addGuide ? "• [Add-on] Private Naturalist Guide (+₹2,000)\n" : ""}
💵 *Estimated Total Amount*: ₹${grandTotal.toLocaleString("en-IN")}
🎟️ *Booking Ref Code*: ${newBooking.id}

Looking forward to our epic road trip caravan! Let me know how to pay and lock this in. Thanks!`;

      // 5. Open WhatsApp in new tab
      const encodedText = encodeURIComponent(msgText);
      const whatsappUrl = `https://wa.me/919322309802?text=${encodedText}`;
      window.open(whatsappUrl, "_blank");

      // 6. Callback and close
      onBookingSuccess(newBooking as any);
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
        className="relative glass border border-white/10 rounded-[32px] w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl z-20 flex flex-col custom-scrollbar"
      >
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

        <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-8 flex-1">
          {/* Traveler basic logs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. abhi@raasta.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-zinc-600"
              />
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
                  {trip.seatsAvailable} berths left
                </span>
              </div>
            </div>
          </div>

          {/* Package Tier pricing */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-3">
              Select Package Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "explorer", name: "Explorer", price: 4999, desc: "Shared Stays" },
                { id: "adventure", name: "Adventure", price: trip.price || 8999, desc: "Boutique Stays" },
                { id: "premium-expedition", name: "Premium", price: 14999, desc: "Luxury Camp" },
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`p-4 rounded-2xl cursor-pointer text-center transition-all duration-300 flex flex-col justify-between border ${
                    selectedTier === tier.id
                      ? "border-brand-emerald bg-brand-emerald/10 text-brand-emerald"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span className={`text-sm font-bold block select-none ${selectedTier === tier.id ? 'text-white' : ''}`}>
                    {tier.name}
                  </span>
                  <span className={`block text-base font-bold mt-2 ${selectedTier === tier.id ? 'text-brand-emerald' : 'text-zinc-300'}`}>
                    ₹{tier.price.toLocaleString("en-IN")}
                  </span>
                  <span className="block text-[10px] uppercase tracking-widest font-semibold mt-2 opacity-80">
                    {tier.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Optional enhancements */}
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">
              Optional Add-on upgrades
            </label>
            
            <div
              onClick={() => setAddPhoto(!addPhoto)}
              className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-300 border ${
                addPhoto ? "border-brand-blue bg-brand-blue/10" : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${addPhoto ? "border-brand-blue bg-brand-blue text-white" : "border-zinc-500"}`}>
                  {addPhoto && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <span className={`text-sm font-semibold block ${addPhoto ? 'text-white' : 'text-zinc-300'}`}>Personal Photographer Upgrade</span>
                  <span className="text-xs text-zinc-500 block font-light mt-1">Media captain to shoot high-resolution cinematic video highlights</span>
                </div>
              </div>
              <span className={`text-sm font-bold shrink-0 ml-4 ${addPhoto ? 'text-brand-blue' : 'text-white'}`}>+₹1,500</span>
            </div>

            <div
              onClick={() => setAddStay(!addStay)}
              className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-300 border ${
                addStay ? "border-brand-blue bg-brand-blue/10" : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${addStay ? "border-brand-blue bg-brand-blue text-white" : "border-zinc-500"}`}>
                  {addStay && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <span className={`text-sm font-semibold block ${addStay ? 'text-white' : 'text-zinc-300'}`}>Single Suite Accommodation</span>
                  <span className="text-xs text-zinc-500 block font-light mt-1">Upgrade from twin sharing to entirely private luxury valley suite</span>
                </div>
              </div>
              <span className={`text-sm font-bold shrink-0 ml-4 ${addStay ? 'text-brand-blue' : 'text-white'}`}>+₹3,000</span>
            </div>

            <div
              onClick={() => setAddGuide(!addGuide)}
              className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-300 border ${
                addGuide ? "border-brand-blue bg-brand-blue/10" : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${addGuide ? "border-brand-blue bg-brand-blue text-white" : "border-zinc-500"}`}>
                  {addGuide && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <span className={`text-sm font-semibold block ${addGuide ? 'text-white' : 'text-zinc-300'}`}>Private Naturalist / Guide</span>
                  <span className="text-xs text-zinc-500 block font-light mt-1">Dedicated 1-on-1 guided walks, cave crawlers, and scenic trails specialists</span>
                </div>
              </div>
              <span className={`text-sm font-bold shrink-0 ml-4 ${addGuide ? 'text-brand-blue' : 'text-white'}`}>+₹2,000</span>
            </div>
          </div>

          {/* Dynamic Invoice Estimator Box */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-white/5 transition-transform duration-500 group-hover:scale-110">
              <Calculator className="w-32 h-32 stroke-[1]" />
            </div>
            <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-4 relative z-10">
              Fare Breakdown Itemized Invoice
            </h4>
            <div className="text-sm space-y-3 text-zinc-300 relative z-10 font-light">
              <div className="flex justify-between">
                <span>{getTierName()} base (₹{baseCost.toLocaleString("en-IN")} x {numTravelers})</span>
                <span className="font-semibold text-white">₹{(baseCost * numTravelers).toLocaleString("en-IN")}</span>
              </div>

              {(addPhoto || addStay || addGuide) && (
                <div className="pt-3 border-t border-white/10 space-y-2 text-sm text-zinc-400">
                  <span className="block text-xs uppercase font-bold text-zinc-500 mb-2 tracking-wider">Premium Addons:</span>
                  {addPhoto && (
                    <div className="flex justify-between">
                      <span>• Media Captain Upgrade</span>
                      <span>+₹{(addonPhotoPrice * numTravelers).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {addStay && (
                    <div className="flex justify-between">
                      <span>• Private Suite Upgrade</span>
                      <span>+₹{(addonStayPrice * numTravelers).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {addGuide && (
                    <div className="flex justify-between">
                      <span>• Private Naturalist Guide</span>
                      <span>+₹{(addonGuidePrice * numTravelers).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-between items-baseline text-white">
                <span className="text-sm font-bold tracking-wide">Grand Total Amount</span>
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
          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4">
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
      </motion.div>
    </div>
  );
}
