/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Booking } from "../types";
import {
  Compass,
  Calendar,
  Sparkles,
  Luggage,
  CloudSun,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight,
  MapPin,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Ticket,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardProps {
  user: { id: string; name: string; email: string; role: string };
  onLogout: () => void;
  onNavigateToHome: () => void;
  onReserveMore: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

import { collection, query, where, getDocs, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import TermsRegulationsModal from "./TermsRegulationsModal";

export default function Dashboard({ user, onLogout, onNavigateToHome, onReserveMore, onOpenNotifications, notificationCount }: DashboardProps) {
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsTab, setTermsTab] = useState<"terms" | "refunds" | "agreement">("terms");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "bookings"), where("email", "==", user.email));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => doc.data() as Booking);
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError("Server connection offline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [user.email]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you absolutely sure you want to cancel this road trip slot?")) {
      return;
    }

    setActionLoading(bookingId);
    try {
      const bookingDoc = await getDoc(doc(db, "bookings", bookingId));
      if (bookingDoc.exists()) {
        const bookingData = bookingDoc.data();
        const tripRef = doc(db, "trips", bookingData.tripId);
        const tripDoc = await getDoc(tripRef);
        if (tripDoc.exists()) {
           await updateDoc(tripRef, {
              seatsAvailable: tripDoc.data().seatsAvailable + bookingData.numTravelers
           });
        }
      }
      await deleteDoc(doc(db, "bookings", bookingId));
      // Remove locally from dashboard view
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      console.error(err);
      alert("Error reaching the server backend.");
    } finally {
      setActionLoading(null);
    }
  };

  // Generate dynamic preparation advice based on user's active departures
  const getPersonalizedPacklist = (tripName: string) => {
    const lower = tripName.toLowerCase();
    if (lower.includes("spiti") || lower.includes("valley") || lower.includes("himalaya")) {
      return {
        climate: "High-Altitude Dry Mountain Cold",
        items: [
          "Windproof thermal jackets & thick inner layer fleece",
          "High SPF 50 sunscreen & UV blocking sunglasses (prevent snow glare)",
          "Moisturizers and heavy-duty lip balms",
          "Acclimatization medicines & personal hydration flasks",
          "Heavy trekking boots with water protection"
        ],
        advice: "Ensure to hydrate consistently. Due to scarce atmospheric pressure at key passes (Key, Kunzum), take deep diaphragmatic breaths & rest on Day 1-2."
      };
    } else if (lower.includes("gokarna") || lower.includes("goa") || lower.includes("beach")) {
      return {
        climate: "Tropical Coastal Humidity & Monsoon Rain",
        items: [
          "Quick-dry outdoor t-shirts & light cotton apparel",
          "Salt-water resistant sandals with good trek grip",
          "Waterproof backpack sleeve & dry packs for cameras",
          "Eco-friendly insect repellents & sun protection",
          "Compact rain poncho or lightweight umbrella"
        ],
        advice: "Avoid heavy swimming during peak tides. Stick to well-trailed sandy pathways during evening cliff hikes and hydrate on fresh coconut water."
      };
    }
    return {
      climate: "Temperate Scenic Highway Roadtrip",
      items: [
        "Light jacket for air-conditioned cruiser shifts",
        "Compact power bank to charge photography gear",
        "Personal medical aids for motion sickness on curves",
        "Acoustic instrument or playlist setup for campfire nights"
      ],
      advice: "Take breaks to stretch during long high-way runs and support rural local organic micro-joints during pitstops."
    };
  };

  // Extract advice from first booked trip if any
  const firstBookedTrip = bookings[0];
  const preparations = firstBookedTrip
    ? getPersonalizedPacklist(firstBookedTrip.tripName)
    : null;

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col justify-between">
      {/* 1. Header Banner */}
      <nav className="border-b border-zinc-200 bg-white/95 py-4 px-6 fixed top-0 w-full z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={onNavigateToHome} className="flex items-center gap-3 group focus:outline-none cursor-pointer">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12 duration-350">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-extrabold tracking-widest text-black">RAASTA</span>
          </button>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
            <button onClick={onOpenNotifications} className="relative p-2 border border-zinc-200 bg-zinc-50/40 hover:bg-zinc-100 rounded-full text-zinc-350 hover:text-black transition cursor-pointer shrink-0" title="Concierge Outbox Mail Feed"><Mail className="w-4.5 h-4.5" />{notificationCount > 0 && <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-yellow-500 text-[9px] font-black text-black animate-bounce">{notificationCount}</span>}</button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-zinc-100/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-zinc-600 capitalize">{user.role} Space</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 border border-red-500/20 bg-red-500/5 hover:bg-red-600 hover:text-black transition rounded-xl text-red-400 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-24 pb-16">
        {/* Dynamic welcome message */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-50 p-6 sm:p-8 border border-zinc-200 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-widest select-none">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              Explorer Ledger Board
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black mt-1.5">
              Namaste, {user.name}
            </h1>
            <p className="text-zinc-600 text-xs mt-1 max-w-lg">
              Manage your confirmed seats, custom road trip package configurations, and personalized trail preparations guide below.
            </p>
          </div>

          <button
            onClick={onReserveMore}
            className="px-5 py-3 rounded-xl bg-white hover:bg-yellow-500 text-black text-xs font-bold uppercase tracking-widest transition duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
          >
            Explore More Departures
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dashboard Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Bookings area (Takes up 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <h3 className="text-lg font-bold tracking-tight text-black flex items-center gap-2">
                <Ticket className="w-5 h-5 text-yellow-500" />
                Active Seat Reservations ({bookings.length})
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Synchronized Dynamic Ledger</span>
            </div>

            {loading ? (
              <div className="py-24 text-center border border-zinc-200 bg-zinc-50/20 rounded-2.5xl">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-650" />
                <p className="mt-3 text-xs uppercase font-bold tracking-widest text-zinc-500">Syncing with backend...</p>
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-6">
                <AnimatePresence>
                  {bookings.map((b) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative bg-zinc-50 rounded-2.5xl p-6 border border-zinc-200 overflow-hidden shadow-xl"
                    >
                      {/* Ticket half cutouts on borders for premium ticketing look */}
                      <div className="absolute top-1/2 -left-3 h-6 w-6 bg-white border-r border-zinc-200 rounded-full -translate-y-1/2"></div>
                      <div className="absolute top-1/2 -right-3 h-6 w-6 bg-white border-l border-zinc-200 rounded-full -translate-y-1/2"></div>

                      <div className="flex flex-col sm:flex-row justify-between gap-6">
                        {/* Left Side: Details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between sm:justify-start items-center gap-4 border-b border-zinc-200/40 pb-2 mb-1">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                              TKT REF: {b.id}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 select-none">
                              <CheckCircle className="w-3.5 h-3.5" />
                              CONFIRMED
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xl font-black text-black leading-tight tracking-wide flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-zinc-500" />
                              {b.tripName}
                            </h4>
                            <p className="text-[11px] text-yellow-500 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5 select-none">
                              <Calendar className="w-4 h-4 text-zinc-500" />
                              {b.bookingDate} Launch
                            </p>
                          </div>

                          {/* Options and specs summary */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white/40 border border-zinc-200/60 p-4 rounded-xl text-xs">
                            <div>
                              <span className="text-[8px] text-zinc-600 block uppercase font-bold tracking-widest mb-1">
                                Primary Member
                              </span>
                              <span className="text-zinc-800 font-bold">{b.travelerName}</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-zinc-600 block uppercase font-bold tracking-widest mb-1">
                                Group Headcount
                              </span>
                              <span className="text-zinc-800 font-bold">{b.numTravelers} Members</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-zinc-600 block uppercase font-bold tracking-widest mb-1">
                                Services Level
                              </span>
                              <span className="text-yellow-500 font-bold">{b.tierSelected}</span>
                            </div>
                          </div>

                          {/* Addons toggling */}
                          {(b.addOns.photographer || b.addOns.premiumStay || b.addOns.localGuide) && (
                            <div>
                              <span className="text-[9px] uppercase font-bold text-zinc-600 block mb-1">
                                Custom Package Selections:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {b.addOns.photographer && (
                                  <span className="text-[9px] bg-zinc-100 border border-zinc-200 text-zinc-600 px-2.5 py-1 rounded-md font-medium uppercase">
                                    + Pro Camera Setup
                                  </span>
                                )}
                                {b.addOns.premiumStay && (
                                  <span className="text-[9px] bg-zinc-100 border border-zinc-200 text-zinc-600 px-2.5 py-1 rounded-md font-medium uppercase">
                                    + Luxury Stay Upgrade
                                  </span>
                                )}
                                {b.addOns.localGuide && (
                                  <span className="text-[9px] bg-zinc-100 border border-zinc-200 text-zinc-600 px-2.5 py-1 rounded-md font-medium uppercase">
                                    + Naturalist Guide
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Side: Cost, confirmation receipt & cancellation action */}
                        <div className="sm:w-44 border-t sm:border-t-0 sm:border-l border-zinc-200 pt-6 sm:pt-0 sm:pl-6 flex flex-row sm:flex-col justify-between items-center sm:items-end text-right">
                          <div className="text-left sm:text-right">
                            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold block mb-0.5">
                              Amount Settled
                            </span>
                            <span className="text-lg sm:text-xl font-black text-black block">
                              ₹{b.totalCost.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-zinc-600 block mt-0.5 font-medium">Synced via local cash API</span>
                          </div>

                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            disabled={actionLoading === b.id}
                            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-650 hover:text-black transition duration-200 text-red-400 text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                          >
                            {actionLoading === b.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5 shrink-0" />
                            )}
                            Cancel Seat
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-20 text-center border border-zinc-200 bg-zinc-50/20 rounded-3xl select-none">
                <Compass className="w-12 h-12 stroke-[1] mx-auto mb-4 text-zinc-700 animate-spin-slow" />
                <p className="text-xs uppercase font-extrabold tracking-widest text-zinc-500">No active voyages logged</p>
                <p className="text-[11px] text-zinc-600 mt-1 max-w-sm mx-auto px-6">
                  You haven't purchased or booked any slots yet. Head back to the departures list, choose your plan, and lock your slot!
                </p>
                <button
                  onClick={onReserveMore}
                  className="mt-6 px-4 py-2 border border-zinc-300 hover:border-white transition rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer"
                >
                  Browse Departures
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Area: preparation guide & weather advice */}
          <div className="space-y-6">
            <div className="border-b border-zinc-905 pb-4">
              <h3 className="text-lg font-bold tracking-tight text-black flex items-center gap-2">
                <Luggage className="w-5 h-5 text-yellow-500" />
                Preparation Portal
              </h3>
            </div>

            {preparations ? (
              <div className="space-y-6">
                {/* 1. Climate Info & Packing checklist */}
                <div className="bg-zinc-50 p-6 border border-zinc-200 rounded-3xl">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-3">
                    <CloudSun className="w-4 h-4" />
                    Trip Climate: {preparations.climate}
                  </div>

                  <h4 className="text-sm font-bold text-black mb-3">Recommended Packlist:</h4>
                  <ul className="space-y-2.5 text-xs text-zinc-600">
                    {preparations.items.map((item, id) => (
                      <li key={id} className="flex gap-2.5 items-start">
                        <span className="text-yellow-500 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 pt-4 border-t border-zinc-200/80 text-[11px] text-zinc-500 leading-relaxed flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                    <span>{preparations.advice}</span>
                  </div>
                </div>

                {/* 2. Safety checklist */}
                <div className="bg-white border border-zinc-200 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-black">RAASTA Safety Protocol</h4>
                      <p className="text-[10px] text-zinc-500">Intimate groups lead by certified captains</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Our safety buffer includes on-board first aid kits, emergency maps, local guide networks, and an active communication relay. All your specific food constraints have been shared with our kitchen crews.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-50 p-6 border border-zinc-200 rounded-3xl text-center text-zinc-500 text-xs py-10">
                <Luggage className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                <span>Reserve a road trip voyage above to get a personalized packing check-list and environment safety guidelines automatically generated for your destination.</span>
              </div>
            )}

            {/* Account Metadata / Security Box */}
            <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-200 text-xs text-zinc-500">
              <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider block mb-3">
                Secure Account Profile
              </span>
              <div className="space-y-2 font-medium">
                <div className="flex justify-between">
                  <span>Explorer ID:</span>
                  <span className="text-zinc-700 font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Email:</span>
                  <span className="text-zinc-700">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Connection Security:</span>
                  <span className="text-emerald-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Normal SSL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-zinc-50 border-t border-zinc-200 pt-8 pb-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© 2025 RAASTA Travels. Dynamic secure client session portal.</p>
          <div className="flex gap-4">
            <button onClick={() => { setTermsTab("agreement"); setTermsOpen(true); }} className="hover:text-zinc-600 transition cursor-pointer">Security Protocol</button>
            <button onClick={() => { setTermsTab("terms"); setTermsOpen(true); }} className="hover:text-zinc-600 transition cursor-pointer">User Terms</button>
          </div>
        </div>
      </footer>

      {/* Terms & Regulations Modal */}
      <TermsRegulationsModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        initialTab={termsTab}
      />
    </div>
  );
}
