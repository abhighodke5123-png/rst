/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Booking } from "../types";
import { X, Calendar, Ticket, Compass, CheckSquare, Trash2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MyBookingsLedgerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export default function MyBookingsLedger({
  isOpen,
  onClose,
  bookings,
  onCancelBooking
}: MyBookingsLedgerProps) {
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
            className="absolute inset-0 bg-white/85 backdrop-blur-sm pointer-events-auto"
          ></motion.div>

          {/* Right Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="relative bg-zinc-50 border-l border-zinc-200 w-full max-w-md h-full shadow-2xl flex flex-col justify-between z-10 text-black"
          >
            {/* Header drawer */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-sans">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-black">Travel Ledger</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5 select-none">
                    Active seat reservations ({bookings.length})
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-black transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="relative bg-white rounded-2.5xl p-5 border border-zinc-200 overflow-hidden flex flex-col justify-between shadow-lg"
                  >
                    {/* Tick cutout effect common in premium ticketing layouts */}
                    <div className="absolute top-1/2 -left-3 h-6 w-6 bg-zinc-50 border-r border-zinc-200 rounded-full -translate-y-1/2"></div>
                    <div className="absolute top-1/2 -right-3 h-6 w-6 bg-zinc-50 border-l border-zinc-200 rounded-full -translate-y-1/2"></div>

                    <div>
                      {/* Ticket Header */}
                      <div className="flex justify-between items-center border-b border-zinc-200/60 pb-3 mb-4 text-xs">
                        <span className="font-mono text-zinc-500 tracking-wider">CODE: {b.id}</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5" />
                          CONFIRMED
                        </span>
                      </div>

                      {/* Main departure details */}
                      <h4 className="text-lg font-extrabold text-black leading-tight uppercase tracking-wide">
                        {b.tripName}
                      </h4>
                      <p className="text-[11px] text-yellow-500 font-bold uppercase tracking-wider mt-1 mb-4 flex items-center gap-1.5 select-none">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        {b.bookingDate} Launch
                      </p>

                      {/* Attendee description */}
                      <div className="space-y-2 border-b border-zinc-200 pb-4 mb-4 text-xs text-zinc-600">
                        <div className="flex justify-between">
                          <span>Primary Representative:</span>
                          <span className="text-zinc-800 font-bold">{b.travelerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Headcount Seats:</span>
                          <span className="text-zinc-800 font-bold">{b.numTravelers} Members</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service Tier:</span>
                          <span className="text-zinc-800 font-semibold text-[11px]">{b.tierSelected}</span>
                        </div>

                        {/* Summary of toggled addons */}
                        {(b.addOns.photographer || b.addOns.premiumStay || b.addOns.localGuide) && (
                          <div className="pt-1.5">
                            <span className="text-[9px] uppercase font-bold text-zinc-600 block mb-1">Options:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {b.addOns.photographer && (
                                <span className="text-[9px] bg-zinc-100 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md font-medium uppercase">
                                  + Pro Media
                                </span>
                              )}
                              {b.addOns.premiumStay && (
                                <span className="text-[9px] bg-zinc-100 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md font-medium uppercase">
                                  + Private Suite
                                </span>
                              )}
                              {b.addOns.localGuide && (
                                <span className="text-[9px] bg-zinc-100 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md font-medium uppercase">
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
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold block mb-0.5">
                          Amount Settled
                        </span>
                        <span className="text-base sm:text-lg font-extrabold text-black">
                          ₹{b.totalCost.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-600 hover:text-black transition duration-200 text-red-400 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        Cancel Seat
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center select-none">
                  <Compass className="w-12 h-12 stroke-[1] mx-auto mb-4 text-zinc-700 animate-spin-slow" />
                  <p className="text-xs uppercase font-extrabold tracking-widest text-zinc-500">
                    No active voyages logged
                  </p>
                  <p className="text-[11px] text-zinc-650 mt-1 max-w-xs mx-auto">
                    Your scheduled road trips seats will automatically reflect inside this ledger secure panel once reserved.
                  </p>
                </div>
              )}
            </div>

            {/* Footer drawer panel */}
            <div className="p-6 border-t border-zinc-200 bg-white space-y-4">
              <div className="flex items-start gap-2.5 text-[10px] text-zinc-500 font-medium leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
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
