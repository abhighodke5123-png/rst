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
import NomadLoyaltyTiers from "./NomadLoyaltyTiers";

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

      // Also merge any cached guest bookings if matching this user
      let localBookings: Booking[] = [];
      try {
        const cached = localStorage.getItem("raasta_guest_bookings");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            localBookings = parsed.filter((b: Booking) => b.email === user.email || !b.email);
          }
        }
      } catch (e) {
        // ignore
      }

      const combined = [...data];
      for (const lb of localBookings) {
        if (!combined.some(b => b.id === lb.id)) {
          combined.push(lb);
        }
      }

      setBookings(combined);
    } catch (err) {
      console.error(err);
      setError("Server connection offline.");
      try {
        const cached = localStorage.getItem("raasta_guest_bookings");
        if (cached) {
          setBookings(JSON.parse(cached));
        }
      } catch (e) {}
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
    <div className="min-h-screen bg-[#07080a] text-white font-sans flex flex-col justify-between">
      {/* 1. Header Banner */}
      <nav className="border-b border-white/10 bg-[#07080a]/90 py-4 px-6 fixed top-0 w-full z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={onNavigateToHome} className="flex items-center gap-3 group focus:outline-none cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 transition-transform group-hover:rotate-12 duration-300">
              <Compass className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-widest text-white font-display">RAASTA</span>
          </button>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 border border-white/10 bg-white/5 hover:bg-white/10 rounded-2xl text-zinc-300 hover:text-amber-400 transition cursor-pointer shrink-0"
              title="Concierge Outbox Mail Feed"
            >
              <Mail className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-black text-black animate-bounce">
                  {notificationCount}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 font-display text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
              <span className="text-zinc-300 capitalize">{user.role} Space</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white transition rounded-xl text-red-400 text-xs font-bold uppercase tracking-wider cursor-pointer font-display"
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
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0b0c10] p-6 sm:p-8 border border-white/10 rounded-[32px] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full filter blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest select-none font-display">
              <Compass className="w-3.5 h-3.5 animate-spin-slow text-amber-400" />
              Explorer Ledger Board
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1.5 font-display">
              Namaste, {user.name}
            </h1>
            <p className="text-zinc-400 text-xs mt-1 max-w-lg font-light leading-relaxed">
              Manage your confirmed seats, custom road trip package configurations, and personalized trail preparations guide below.
            </p>
          </div>

          <button
            onClick={onReserveMore}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-widest transition duration-300 flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 font-display"
          >
            Explore More Departures
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Nomad Loyalty Tiers Progress */}
        <div className="mb-10">
          <NomadLoyaltyTiers
            bookings={bookings}
            userName={user.name}
            userEmail={user.email}
            onExploreDepartures={onReserveMore}
          />
        </div>

        {/* Dashboard Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Bookings area (Takes up 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 font-display">
                <Ticket className="w-5 h-5 text-amber-400" />
                Active Seat Reservations ({bookings.length})
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Synchronized Dynamic Ledger</span>
            </div>

            {loading ? (
              <div className="py-24 text-center border border-white/10 bg-white/[0.02] rounded-3xl">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-400" />
                <p className="mt-3 text-xs uppercase font-bold tracking-widest text-zinc-400 font-display">Syncing with backend...</p>
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
                      className="relative bg-[#0b0c10] rounded-3xl p-6 border border-white/10 overflow-hidden shadow-xl"
                    >
                      {/* Ticket half cutouts on borders for luxury ticketing look */}
                      <div className="absolute top-1/2 -left-3 h-6 w-6 bg-[#07080a] border-r border-white/10 rounded-full -translate-y-1/2"></div>
                      <div className="absolute top-1/2 -right-3 h-6 w-6 bg-[#07080a] border-l border-white/10 rounded-full -translate-y-1/2"></div>

                      <div className="flex flex-col sm:flex-row justify-between gap-6">
                        {/* Left Side: Details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between sm:justify-start items-center gap-4 border-b border-white/10 pb-2 mb-1">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                              TKT REF: {b.id}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 select-none font-display">
                              <CheckCircle className="w-3.5 h-3.5" />
                              CONFIRMED
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xl font-black text-white leading-tight tracking-wide flex items-center gap-2 font-display">
                              <MapPin className="w-4 h-4 text-amber-400" />
                              {b.tripName}
                            </h4>
                            <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5 select-none font-display">
                              <Calendar className="w-4 h-4 text-amber-400/70" />
                              {b.bookingDate} Launch
                            </p>
                          </div>

                          {/* Options and specs summary */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-xs">
                            <div>
                              <span className="text-[8px] text-zinc-400 block uppercase font-bold tracking-widest mb-1 font-display">
                                Primary Member
                              </span>
                              <span className="text-white font-bold">{b.travelerName}</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-zinc-400 block uppercase font-bold tracking-widest mb-1 font-display">
                                Group Headcount
                              </span>
                              <span className="text-white font-bold">{b.numTravelers} Members</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-zinc-400 block uppercase font-bold tracking-widest mb-1 font-display">
                                Services Level
                              </span>
                              <span className="text-amber-400 font-bold">{b.tierSelected}</span>
                            </div>
                          </div>

                          {/* Addons toggling */}
                          {b.addOns && (b.addOns.photographer || b.addOns.premiumStay || b.addOns.localGuide) && (
                            <div>
                              <span className="text-[9px] uppercase font-bold text-amber-400/90 block mb-1 font-display">
                                Custom Package Selections:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {b.addOns?.photographer && (
                                  <span className="text-[9px] bg-white/5 border border-white/10 text-zinc-300 px-2.5 py-1 rounded-lg font-medium uppercase font-display">
                                    + Pro Camera Setup
                                  </span>
                                )}
                                {b.addOns?.premiumStay && (
                                  <span className="text-[9px] bg-white/5 border border-white/10 text-zinc-300 px-2.5 py-1 rounded-lg font-medium uppercase font-display">
                                    + Luxury Stay Upgrade
                                  </span>
                                )}
                                {b.addOns?.localGuide && (
                                  <span className="text-[9px] bg-white/5 border border-white/10 text-zinc-300 px-2.5 py-1 rounded-lg font-medium uppercase font-display">
                                    + Naturalist Guide
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Side: Cost, confirmation receipt & cancellation action */}
                        <div className="sm:w-44 border-t sm:border-t-0 sm:border-l border-white/10 pt-6 sm:pt-0 sm:pl-6 flex flex-row sm:flex-col justify-between items-center sm:items-end text-right">
                          <div className="text-left sm:text-right">
                            <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold block mb-0.5 font-display">
                              Amount Settled
                            </span>
                            <span className="text-lg sm:text-xl font-black text-amber-400 block font-display">
                              ₹{b.totalCost.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-zinc-500 block mt-0.5 font-medium">Synced via local cash API</span>
                          </div>

                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            disabled={actionLoading === b.id}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white transition duration-200 text-red-400 text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer font-display"
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
              <div className="py-20 text-center border border-white/10 bg-white/[0.02] rounded-3xl select-none">
                <Compass className="w-12 h-12 stroke-[1] mx-auto mb-4 text-zinc-600 animate-spin-slow" />
                <p className="text-xs uppercase font-extrabold tracking-widest text-amber-400 font-display">No active voyages logged</p>
                <p className="text-[11px] text-zinc-400 mt-1 max-w-sm mx-auto px-6 font-light">
                  You haven't reserved any slots yet. Head back to the departures list, choose your plan, and lock your slot!
                </p>
                <button
                  onClick={onReserveMore}
                  className="mt-6 px-5 py-2.5 bg-amber-400 text-black hover:bg-amber-300 transition rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer font-display"
                >
                  Browse Departures
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Area: preparation guide & weather advice */}
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 font-display">
                <Luggage className="w-5 h-5 text-amber-400" />
                Preparation Portal
              </h3>
            </div>

            {preparations ? (
              <div className="space-y-6">
                {/* 1. Climate Info & Packing checklist */}
                <div className="bg-[#0b0c10] p-6 border border-white/10 rounded-3xl">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3 font-display">
                    <CloudSun className="w-4 h-4" />
                    Trip Climate: {preparations.climate}
                  </div>

                  <h4 className="text-sm font-bold text-white mb-3 font-display">Recommended Packlist:</h4>
                  <ul className="space-y-2.5 text-xs text-zinc-300">
                    {preparations.items.map((item, id) => (
                      <li key={id} className="flex gap-2.5 items-start">
                        <span className="text-amber-400 font-bold">✓</span>
                        <span className="font-light">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-zinc-400 leading-relaxed flex gap-2 font-light">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{preparations.advice}</span>
                  </div>
                </div>

                {/* 2. Safety checklist */}
                <div className="bg-[#0b0c10] border border-white/10 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">RAASTA Safety Protocol</h4>
                      <p className="text-[10px] text-zinc-400">Intimate groups lead by certified captains</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Our safety buffer includes on-board first aid kits, emergency maps, local guide networks, and an active communication relay. All your specific food constraints have been shared with our kitchen crews.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#0b0c10] p-6 border border-white/10 rounded-3xl text-center text-zinc-400 text-xs py-10">
                <Luggage className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <span className="font-light">Reserve a road trip voyage above to get a personalized packing check-list and environment safety guidelines automatically generated for your destination.</span>
              </div>
            )}

            {/* Account Metadata / Security Box */}
            <div className="bg-[#0b0c10] p-5 rounded-3xl border border-white/10 text-xs text-zinc-400">
              <span className="text-[9px] uppercase font-bold text-amber-400/90 tracking-wider block mb-3 font-display">
                Secure Account Profile
              </span>
              <div className="space-y-2 font-light">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Explorer ID:</span>
                  <span className="text-zinc-300 font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Active Email:</span>
                  <span className="text-zinc-300">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Connection Security:</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Normal SSL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#07080a] border-t border-white/10 pt-8 pb-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© 2026 RAASTA Travels. Dynamic secure client session portal.</p>
          <div className="flex gap-4">
            <button onClick={() => { setTermsTab("agreement"); setTermsOpen(true); }} className="hover:text-amber-400 transition cursor-pointer">Security Protocol</button>
            <button onClick={() => { setTermsTab("terms"); setTermsOpen(true); }} className="hover:text-amber-400 transition cursor-pointer">User Terms</button>
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