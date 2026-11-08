/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Booking } from "../types";
import { X, Calendar, Ticket, Compass, CheckSquare, Trash2, ShieldCheck, Mountain, Crown, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MyBookingsLedgerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onOpenDashboard?: () => void;
}

export default function MyBookingsLedger({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onOpenDashboard
}: MyBookingsLedgerProps) {
  const tripCount = bookings.length;
  const tierName = tripCount >= 5 ? "Legend" : tripCount >= 2 ? "Wanderer" : "Explorer";
  const TierIcon = tripCount >= 5 ? Crown : tripCount >= 2 ? Mountain : Compass;
  const nextTarget = tripCount < 2 ? 2 : tripCount < 5 ? 5 : null;
  const tripsUntilNext = nextTarget ? nextTarget - tripCount : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Dark backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto"
          ></motion.div>

          {/* Right Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="relative bg-[#0b0c10] border-l border-white/10 w-full max-w-md h-full shadow-2xl flex flex-col justify-between z-10 text-white"
          >
            {/* Header drawer */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400/10 border border-amber-400/20 rounded-2xl text-amber-400">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white font-display">Travel Ledger</h3>
                  <p className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider mt-0.5 select-none font-display">
                    Active seat reservations ({bookings.length})
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition border border-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nomad Status Quick Bar */}
            <div className="px-6 py-3.5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${tripCount >= 5 ? "bg-amber-400/20 text-amber-300" : tripCount >= 2 ? "bg-emerald-400/20 text-emerald-300" : "bg-amber-400/15 text-amber-400"}`}>
                  <TierIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Nomad Tier</span>
                  <span className="font-bold text-white font-display">{tierName} Status</span>
                </div>
              </div>

              <div className="text-right">
                {nextTarget ? (
                  <span className="text-[11px] text-zinc-400 font-light">
                    <strong className="text-amber-400 font-mono font-bold tabular-nums">{tripsUntilNext}</strong> more to {tripCount < 2 ? "Wanderer" : "Legend"}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-400 font-display uppercase tracking-wider">
                    Apex Legend
                  </span>
                )}
              </div>
            </div>

            {/* List scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="relative bg-white/[0.03] rounded-3xl p-5 border border-white/10 overflow-hidden flex flex-col justify-between shadow-lg"
                  >
                    {/* Tick cutout effect common in luxury ticketing layouts */}
                    <div className="absolute top-1/2 -left-3 h-6 w-6 bg-[#0b0c10] border-r border-white/10 rounded-full -translate-y-1/2"></div>
                    <div className="absolute top-1/2 -right-3 h-6 w-6 bg-[#0b0c10] border-l border-white/10 rounded-full -translate-y-1/2"></div>

                    <div>
                      {/* Ticket Header */}
                      <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4 text-xs">
                        <span className="font-mono text-zinc-400 tracking-wider">CODE: {b.id}</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1 font-display">
                          <CheckSquare className="w-3.5 h-3.5" />
                          CONFIRMED
                        </span>
                      </div>

                      {/* Main departure details */}
                      <h4 className="text-lg font-black text-white leading-tight uppercase tracking-wide font-display">
                        {b.tripName}
                      </h4>
                      <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider mt-1 mb-4 flex items-center gap-1.5 select-none font-display">
                        <Calendar className="w-4 h-4 text-amber-400/70" />
                        {b.bookingDate} Launch
                      </p>

                      {/* Attendee description */}
                      <div className="space-y-2 border-b border-white/10 pb-4 mb-4 text-xs text-zinc-300">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Primary Representative:</span>
                          <span className="text-white font-bold">{b.travelerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Total Headcount Seats:</span>
                          <span className="text-white font-bold">{b.numTravelers} Members</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Service Tier:</span>
                          <span className="text-amber-400 font-semibold text-[11px]">{b.tierSelected}</span>
                        </div>

                        {/* Summary of toggled addons */}
                        {b.addOns && (b.addOns.photographer || b.addOns.premiumStay || b.addOns.localGuide) && (
                          <div className="pt-1.5">
                            <span className="text-[9px] uppercase font-bold text-amber-400/90 block mb-1 font-display">Options:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {b.addOns?.photographer && (
                                <span className="text-[9px] bg-white/5 border border-white/10 text-zinc-300 px-2 py-0.5 rounded-md font-medium uppercase font-display">
                                  + Pro Media
                                </span>
                              )}
                              {b.addOns?.premiumStay && (
                                <span className="text-[9px] bg-white/5 border border-white/10 text-zinc-300 px-2 py-0.5 rounded-md font-medium uppercase font-display">
                                  + Private Suite
                                </span>
                              )}
                              {b.addOns?.localGuide && (
                                <span className="text-[9px] bg-white/5 border border-white/10 text-zinc-300 px-2 py-0.5 rounded-md font-medium uppercase font-display">
                                  + Naturalist Escort
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ticket Footer (Total Price & Cancelation button) */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold block mb-0.5 font-display">
                          Amount Settled
                        </span>
                        <span className="text-base sm:text-lg font-black text-amber-400 font-display">
                          ₹{b.totalCost.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white transition duration-200 text-red-400 text-[10px] font-bold uppercase tracking-wider cursor-pointer font-display"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        Cancel Seat
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center select-none">
                  <Compass className="w-12 h-12 stroke-[1] mx-auto mb-4 text-zinc-600 animate-spin-slow" />
                  <p className="text-xs uppercase font-extrabold tracking-widest text-amber-400 font-display">
                    No active voyages logged
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1 max-w-xs mx-auto font-light">
                    Your scheduled road trips seats will automatically reflect inside this ledger secure panel once reserved.
                  </p>
                </div>
              )}
            </div>

            {/* Footer drawer panel */}
            <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-3.5">
              {onOpenDashboard && (
                <button
                  onClick={onOpenDashboard}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer font-display shadow-lg shadow-amber-500/20"
                >
                  <Award className="w-4 h-4" />
                  <span>View Full Nomad Loyalty Dashboard</span>
                </button>
              )}

              <div className="flex items-start gap-2.5 text-[10px] text-zinc-400 font-light leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  All listings are encrypted and synchronized locally within your sandbox browser environment database.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}