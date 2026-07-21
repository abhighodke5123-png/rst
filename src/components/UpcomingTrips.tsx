/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Trip, Booking } from "../types";
import { TRIPS } from "../data";
import { Calendar, Users, SlidersHorizontal, MapPin, Tag, Search, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import BookingForm from "./BookingForm";

interface UpcomingTripsProps {
  tripsList: Trip[];
  onBookTrip: (trip: Trip) => void;
  selectedTripForBooking: Trip | null;
  onCloseBookingForm: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
  initialFilterDestinationId?: string;
  onClearInitialFilter?: () => void;
}

export default function UpcomingTrips({
  tripsList,
  onBookTrip,
  selectedTripForBooking,
  onCloseBookingForm,
  onBookingSuccess,
  initialFilterDestinationId,
  onClearInitialFilter
}: UpcomingTripsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const statuses = ["All", "Seats Open", "Selling Fast", "Almost Full", "Monsoon Special"];

  // Filter our scheduled departures
  const filteredTrips = tripsList.filter((trip) => {
    // 1. Check destination filter (passed down from Deep Dive triggers)
    if (initialFilterDestinationId && trip.destinationId !== initialFilterDestinationId) {
      return false;
    }

    // 2. Search matches
    const matchesSearch =
      trip.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.dates.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Status matches
    const matchesStatus = statusFilter === "All" || trip.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section id="trips" className="py-32 px-6 bg-[#040404] relative">
      {/* Decorative vertical lines to emulate the RAASTA road path */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 border-dashed pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto relative z-10"
      >
        
        {/* Header Block */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Upcoming <br/>
            <span className="text-zinc-500">Departures.</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed font-light">
            Reserve your seat on our next handcrafted expeditions. To protect local ecosystems, we curate tiny microgroups with custom-equipped vehicles.
          </p>

          {/* Active Deep Dive Destination Filter Alert */}
          {initialFilterDestinationId && (
            <div className="mt-6 inline-flex items-center gap-3.5 px-5 py-3 rounded-full border border-brand-orange/20 bg-brand-orange/10 text-brand-orange text-sm font-medium">
              <span>
                Showing: {tripsList.find(t => t.destinationId === initialFilterDestinationId)?.destinationName.split(" ")[0]} Route
              </span>
              <button
                onClick={onClearInitialFilter}
                className="font-bold underline hover:text-white transition uppercase text-xs tracking-wider cursor-pointer ml-2"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Filters Controls Card */}
        <div className="glass p-4 rounded-3xl mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search dates, destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Availability Status list filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
            <div className="flex flex-wrap gap-2 p-1.5 w-full md:w-auto">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                    statusFilter === st
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Departures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => {
                // Color style mapping for status badges
                const getStatusStyle = (status: string) => {
                  switch (status) {
                    case "Selling Fast":
                    case "Almost Full":
                      return "bg-brand-orange/20 text-brand-orange border-brand-orange/30";
                    case "Monsoon Special":
                      return "bg-brand-blue/20 text-brand-blue border-brand-blue/30";
                    default:
                      return "bg-brand-emerald/20 text-brand-emerald border-brand-emerald/30";
                  }
                };

                return (
                  <motion.div
                    layout
                    key={trip.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="group relative glass rounded-[32px] p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05] flex flex-col justify-between"
                  >
                    <div>
                      {/* Top status bar */}
                      <div className="flex justify-between items-center mb-6">
                        <span className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(trip.status)}`}>
                          {trip.status}
                        </span>
                        
                        <div className="flex flex-col items-end">
                          {trip.originalPrice && (
                            <span className="text-xs text-zinc-500 line-through font-normal mb-0.5">
                              ₹{trip.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <div className="flex items-center gap-1.5 text-white text-sm font-semibold">
                            <Tag className="w-4 h-4 text-brand-orange" />
                            <span>₹{trip.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Title information */}
                      <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                        {trip.destinationName}
                      </h3>

                      {/* Dates and location */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-white text-sm font-medium">
                          <Calendar className="w-5 h-5 text-brand-blue" />
                          <span>{trip.dates}</span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-400 text-sm">
                          <MapPin className="w-5 h-5" />
                          <span>Expedition Loop</span>
                        </div>
                      </div>

                      <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-light">
                        {trip.description}
                      </p>
                    </div>

                    {/* Inventory control meters */}
                    <div className="pt-6 border-t border-white/10">
                      {trip.seatsAvailable > 0 ? (
                        <button
                          onClick={() => onBookTrip(trip)}
                          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
                        >
                          <Users className="w-5 h-5" />
                          Reserve Seat
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-4 rounded-2xl bg-white/5 text-zinc-500 font-semibold text-sm cursor-not-allowed"
                        >
                          Waitlist Only
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center text-zinc-500 glass rounded-[32px]">
                <Search className="w-12 h-12 stroke-[1] mx-auto mb-4 text-zinc-600" />
                <p className="text-base font-semibold">No scheduled caravans found</p>
                <p className="text-sm text-zinc-500 mt-2">Try resetting the filters.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* RENDER RESERVATION SHEET IN PORTAL / OVERLAY FLOW */}
      <AnimatePresence>
        {selectedTripForBooking && (
          <BookingForm
            trip={selectedTripForBooking}
            onClose={onCloseBookingForm}
            onBookingSuccess={onBookingSuccess}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
