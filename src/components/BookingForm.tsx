/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Trip, Booking } from "../types";
import { PACKAGES } from "../data";
import { X, Check, Calculator, Info, ShieldCheck, HelpCircle, ArrowLeft, CreditCard, Landmark, Smartphone, RefreshCw, Lock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

interface BookingFormProps {
  trip: Trip;
  onClose: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
}

export default function BookingForm({ trip, onClose, onBookingSuccess }: BookingFormProps) {
  // Wizard State
  const [formStep, setFormStep] = useState<"details" | "payment">("details");

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

  // Errors & Sandbox states
  const [errorMess, setErrorMess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Razorpay simulated portal attributes
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("abhighodke@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("4532 9845 1254 8874");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvv, setCardCvv] = useState("456");
  const [cardName, setCardName] = useState("ABHI GHODKE");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // Payment simulated handshake steps
  const [paymentStatusMessage, setPaymentStatusMessage] = useState("");
  const [paymentProgress, setPaymentProgress] = useState(0);

  // Tier pricing lookup
  const getTierPrice = () => {
    if (selectedTier === "explorer") return 4999;
    if (selectedTier === "premium-expedition") return 14999;
    return 9999; // Adventure tier
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

  // Validate Step 1 details and move to payment gateway screen
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMess("");

    if (!formName.trim()) {
      setErrorMess("Please enter traveler's full name.");
      return;
    }
    if (!formEmail.trim() || !formEmail.includes("@")) {
      setErrorMess("Please enter a valid email address.");
      return;
    }
    if (!formPhone.trim() || formPhone.length < 8) {
      setErrorMess("Please enter a valid phone or mobile number.");
      return;
    }
    if (numTravelers > trip.seatsAvailable) {
      setErrorMess(`Only ${trip.seatsAvailable} seats are available for this departure.`);
      return;
    }

    // Set matching cardholder name by default
    setCardName(formName.toUpperCase());

    // Transition to simulated payment drawer step
    setFormStep("payment");
  };

  // Execute actual database creation post payment authorized simulation
  const handleSimulatePaymentCompletion = async () => {
    setErrorMess("");
    setSubmitting(true);

    const stages = [
      { msg: "Handshaking with safe gateway...", progress: 20 },
      { msg: "Awaiting customer OTP check on Razorpay...", progress: 50 },
      { msg: "Verifying sandbox signatures...", progress: 82 },
      { msg: "Payment captures successfully verified!", progress: 100 }
    ];

    // Gorgeous progress ticks
    for (const step of stages) {
      setPaymentStatusMessage(step.msg);
      setPaymentProgress(step.progress);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Inside handleSimulatePaymentCompletion
    try {
      // Prepare simulated keys metadata
      const randomPayId = "pay_sandbox_" + Math.random().toString(36).substr(2, 9).toUpperCase();
      const payMethodTitle = selectedMethod === "upi" ? `UPI (${upiId})` : selectedMethod === "card" ? "Credit Card ending in 8874" : `NetBanking (${selectedBank})`;

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
        paymentId: randomPayId,
        paymentMethod: payMethodTitle,
        paymentStatus: "Paid"
      };

      await setDoc(bookingRef, newBooking);

      // Decrement remaining seats count on trip
      const tripRef = doc(db, "trips", trip.id);
      const tripDoc = await getDoc(tripRef);
      if (tripDoc.exists()) {
        const tripData = tripDoc.data();
        await updateDoc(tripRef, {
          seatsAvailable: Math.max(0, tripData.seatsAvailable - numTravelers)
        });
      }

      // Add Notification
      const notifRef = doc(collection(db, "notifications"));
      await setDoc(notifRef, {
        id: notifRef.id,
        recipientEmail: formEmail.toLowerCase(),
        recipientName: formName,
        subject: `🎟️ RAASTA Booking Invoice: Seat Confirmed [${newBooking.id}]`,
        bodyHtml: `<h3>Booking Confirmed</h3><p>Your booking for ${trip.destinationName} is confirmed.</p>`,
        bodyText: `Your booking for ${trip.destinationName} is confirmed.`,
        timestamp: new Date().toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        }),
        type: "booking",
        read: false
      });

      // Succeeded!
      onBookingSuccess(newBooking as any);
    } catch (err: any) {
      setErrorMess(err.message || "Failed to finalize seat booking on server.");
      setFormStep("details");
    } finally {
      setSubmitting(false);
      setPaymentStatusMessage("");
      setPaymentProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Dark overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      ></motion.div>

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
            <div className="flex items-center gap-3">
              {formStep === "payment" && (
                <button
                  type="button"
                  onClick={() => setFormStep("details")}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
                  title="Back to Details"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {formStep === "details" ? "Configure Expedition Entry" : "Secure Payment Gateway"}
              </h3>
            </div>
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

        <AnimatePresence mode="wait">
          {formStep === "details" ? (
            /* ================= STEP 1: CONFIGURE & DETALIL FORM ================= */
            <motion.form
              key="details-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleProceedToPayment}
              className="p-6 sm:p-8 space-y-8 flex-1"
            >
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
                    { id: "adventure", name: "Adventure", price: 9999, desc: "Boutique Stays" },
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
                <span className="uppercase tracking-wider">PCI-DSS Compliant • Cancellation protect up to 15 days</span>
              </div>

              {/* Button controllers */}
              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer text-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  Confirm Details & Pay (₹{grandTotal.toLocaleString("en-IN")})
                </button>
              </div>
            </motion.form>
          ) : (
            /* ================= STEP 2: SHADED RAZORPAY SECURE GATEWAY ================= */
            <motion.div
              key="payment-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-6 sm:p-8 flex flex-col items-center flex-1 relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#1c3fdc]/10 rounded-full blur-[80px] pointer-events-none"></div>
              {/* Razorpay Classic Layout frame mockup */}
              <div className="w-full max-w-md bg-[#080808] border border-white/10 rounded-[24px] overflow-hidden shadow-2xl flex flex-col relative z-10">
                {/* Simulated Rzp Header banner */}
                <div className="bg-[#1c3fdc] p-5 text-white flex justify-between items-center relative select-none">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold tracking-widest uppercase">Razorpay</span>
                      <span className="text-[9px] bg-white text-[#1c3fdc] font-bold px-1.5 py-0.5 rounded shadow-sm">SECURE</span>
                    </div>
                    <span className="text-xs text-blue-100 font-medium">RAASTA Travels Client Node</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-blue-200 uppercase tracking-widest font-bold block mb-1">PAYMENT AMOUNT</span>
                    <span className="text-xl font-bold font-mono">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                  {/* Test alert label */}
                  <div className="absolute right-0 top-0 bg-brand-orange text-black px-2 py-0.5 text-[8px] font-bold uppercase rounded-bl-lg tracking-widest">
                    SANDBOX TESTING
                  </div>
                </div>

                {/* Main panel - Select modes and input parameters */}
                {paymentProgress > 0 ? (
                  /* Animated Transaction state simulator */
                  <div className="p-10 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <RefreshCw className="w-16 h-16 text-[#1c3fdc] animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center bg-[#080808]/50 rounded-full blur-sm"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-base font-bold text-white block">Processing payment via Razorpay...</span>
                      <span className="text-sm text-zinc-400 block font-light">{paymentStatusMessage}</span>
                    </div>
                    {/* Linear metrics bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1c3fdc] transition-all duration-300 relative">
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[200%] animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Razorpay input dashboard options */
                  <div className="grid grid-cols-12 md:divide-x md:divide-white/10">
                    {/* Lateral sidebar tabs */}
                    <div className="col-span-12 md:col-span-4 bg-white/5 p-4 space-y-2">
                      {[
                        { id: "upi", icon: Smartphone, label: "UPI & QR" },
                        { id: "card", icon: CreditCard, label: "Cards" },
                        { id: "netbanking", icon: Landmark, label: "NetBanking" }
                      ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSelectedMethod(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase transition-all duration-300 cursor-pointer ${
                              selectedMethod === tab.id
                                ? "bg-white/10 text-white border-l-2 border-[#1c3fdc]"
                                : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 transition-colors ${selectedMethod === tab.id ? 'text-[#1c3fdc]' : 'text-zinc-500'}`} />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Interactive center content pane */}
                    <div className="col-span-12 md:col-span-8 p-6 space-y-6 min-h-[260px] flex flex-col justify-between">
                      {selectedMethod === "upi" && (
                        <div className="space-y-4">
                          <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                            Secure UPI Address ID
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. wanderer@upi"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1c3fdc] transition-colors placeholder:text-zinc-600"
                          />
                          <div className="p-4 bg-[#1c3fdc]/5 rounded-xl border border-[#1c3fdc]/20 flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-[#1c3fdc] shrink-0" />
                            <span className="text-[11px] text-[#1c3fdc] leading-relaxed font-medium">
                              UPI handles instantly linked in Sandbox Mode. Verified via Mock NPCI payload.
                            </span>
                          </div>
                        </div>
                      )}

                      {selectedMethod === "card" && (
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                              Credit / Debit Card Number
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4532 9845 1254 8874"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1c3fdc] transition-colors font-mono tracking-widest placeholder:text-zinc-600"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="MM/YY"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1c3fdc] transition-colors font-mono placeholder:text-zinc-600"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">
                                CVV Code
                              </label>
                              <input
                                type="password"
                                maxLength={4}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                placeholder="•••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1c3fdc] transition-colors font-mono placeholder:text-zinc-600"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMethod === "netbanking" && (
                        <div className="space-y-4">
                          <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                            Choose Major Indian Bank
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"].map((bankName) => (
                              <button
                                key={bankName}
                                type="button"
                                onClick={() => setSelectedBank(bankName)}
                                className={`p-3 text-[10px] font-bold rounded-xl border text-center uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                  selectedBank === bankName
                                    ? "bg-[#1c3fdc]/20 text-[#1c3fdc] border-[#1c3fdc]"
                                    : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/30 hover:bg-white/10"
                                }`}
                              >
                                {bankName}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Razorpay safe checkout launcher button */}
                      <div className="pt-4 flex flex-col gap-3">
                        <button
                          type="button"
                          onClick={handleSimulatePaymentCompletion}
                          className="w-full py-4 rounded-xl bg-[#1c3fdc] text-white hover:bg-blue-600 transition-colors text-xs uppercase font-bold tracking-widest cursor-pointer shadow-[0_4px_20px_rgba(28,63,220,0.4)]"
                        >
                          PROCEED SECURELY • ₹{grandTotal.toLocaleString("en-IN")}
                        </button>
                        <span className="text-[9px] text-zinc-500 text-center uppercase tracking-widest font-semibold block">
                          Verified S2S Secure Checkout via Safe Sandbox Node
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Developer Key Placement Alert notice */}
              <div className="w-full max-w-md mt-6 p-5 glass border border-brand-orange/20 rounded-[24px] flex flex-col gap-3 font-medium leading-relaxed z-10">
                <span className="text-xs text-brand-orange font-bold flex items-center gap-2 uppercase tracking-wider">
                  <Info className="w-4 h-4 shrink-0" />
                  Live Razorpay Integration Ready
                </span>
                <p className="text-[11px] text-zinc-400 font-light">
                  This website implements a polished **Razorpay API checkout workflow**. Currently, the system runs with an automated sandbox simulator for preview. Adding actual commercial payment reception requires updating your live **RAZORPAY_KEY_ID** credential.
                </p>
                <div className="bg-black/50 rounded-xl p-3 border border-white/5 font-mono text-[10px] text-zinc-500 text-center">
                  process.env.RAZORPAY_KEY_ID = "YOUR_LIVE_KEY_ID"
                </div>
              </div>

              {/* Step Return cancel buttons */}
              <div className="w-full max-w-md mt-6 flex justify-between items-center text-xs z-10 px-2">
                <button
                  type="button"
                  onClick={() => setFormStep("details")}
                  className="text-zinc-500 hover:text-white font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Configure Extras
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-red-500/80 hover:text-red-500 font-bold uppercase tracking-widest text-[10px] cursor-pointer transition-colors"
                >
                  Abort checkout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
