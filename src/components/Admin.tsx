/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Booking, Trip } from "../types";
import {
  ShieldAlert,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  Save,
  PlusCircle,
  Trash2,
  Edit2,
  X,
  LogOut,
  Mail,
  RefreshCw,
  Clock,
  Loader2,
  FileSpreadsheet,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminProps {
  user: { id: string; name: string; email: string; role: string };
  onLogout: () => void;
  onNavigateToHome: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

interface StatsMetrics {
  bookingsCount: number;
  totalRevenue: number;
  totalSeatsReservations: number;
  currentTripsCount: number;
  registeredUsersCount: number;
}

import { collection, query, where, getDocs, deleteDoc, doc, setDoc, updateDoc, writeBatch, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { TRIPS } from "../data";

export default function Admin({ user, onLogout, onNavigateToHome, onOpenNotifications, notificationCount }: AdminProps) {
  const [stats, setStats] = useState<StatsMetrics>({
    bookingsCount: 0,
    totalRevenue: 0,
    totalSeatsReservations: 0,
    currentTripsCount: 0,
    registeredUsersCount: 0
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Form States for creating a trip
  const [newTripDestId, setNewTripDestId] = useState("goa");
  const [newTripDestName, setNewTripDestName] = useState("");
  const [newTripDates, setNewTripDates] = useState("");
  const [newTripPrice, setNewTripPrice] = useState("");
  const [newTripSeats, setNewTripSeats] = useState("");
  const [newTripDesc, setNewTripDesc] = useState("");
  const [newTripStatus, setNewTripStatus] = useState("Seats Open");
  const [newTripCaptainName, setNewTripCaptainName] = useState("");
  const [newTripFlexibleDates, setNewTripFlexibleDates] = useState(false);

  // Form States for editing an existing trip
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editDates, setEditDates] = useState("");
  const [editSeatsTotal, setEditSeatsTotal] = useState("");
  const [editSeatsAvail, setEditSeatsAvail] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCaptainName, setEditCaptainName] = useState("");
  const [editFlexibleDates, setEditFlexibleDates] = useState(false);

  const loadAdminControlData = async () => {
    setSyncing(true);
    try {
      // 1. Fetch Metrics
      let tripsSnap = await getDocs(collection(db, "trips"));

      if (tripsSnap.empty) {
        const batch = writeBatch(db);
        TRIPS.forEach((t) => {
          batch.set(doc(db, "trips", t.id), t);
        });
        await batch.commit();
        tripsSnap = await getDocs(collection(db, "trips"));
      }

      const bookingsSnap = await getDocs(collection(db, "bookings"));
      const usersSnap = await getDocs(collection(db, "users"));
      
      const statsData = {
        bookingsCount: bookingsSnap.size,
        totalRevenue: bookingsSnap.docs.reduce((acc, doc) => acc + (doc.data().totalCost || 0), 0),
        totalSeatsReservations: bookingsSnap.docs.reduce((acc, doc) => acc + (doc.data().numTravelers || 0), 0),
        currentTripsCount: tripsSnap.size,
        registeredUsersCount: usersSnap.size
      };
      setStats(statsData);

      // 2. Fetch Bookings (passing role: 'admin')
      const bookingsData = bookingsSnap.docs.map(doc => doc.data() as Booking);
      setBookings(bookingsData);

      // 3. Fetch Master Trips list
      const tripsData = tripsSnap.docs.map(doc => doc.data() as Trip);
      setTrips(tripsData);
    } catch (err) {
      console.error("Error fetching admin control logs:", err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadAdminControlData();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm(`Permanently cancel reservation ${bookingId}? This replenishes trip seat capacities.`)) {
      return;
    }

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
      loadAdminControlData();
    } catch (err) {
      console.error(err);
      alert("Fail cancelation request.");
    }
  };

  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTripDestName || !newTripDates || !newTripPrice || !newTripSeats) {
      alert("Please fill in all core parameters.");
      return;
    }

    try {
      const tripRef = doc(collection(db, "trips"));
      await setDoc(tripRef, {
          id: tripRef.id,
          destinationId: newTripDestId,
          destinationName: newTripDestName,
          dates: newTripDates,
          price: Number(newTripPrice),
          seatsTotal: Number(newTripSeats),
          seatsAvailable: Number(newTripSeats),
          description: newTripDesc || "Handcrafted Premium Escapes Route",
          status: newTripStatus,
          captainName: newTripCaptainName || "RAASTA Captain",
          isFlexibleDates: newTripFlexibleDates
      });

      // Reset fields
      setNewTripDestName("");
      setNewTripDates("");
      setNewTripPrice("");
      setNewTripSeats("");
      setNewTripDesc("");
      setNewTripStatus("Seats Open");
      setNewTripCaptainName("");
      setNewTripFlexibleDates(false);

      // Reload data
      loadAdminControlData();
    } catch (err) {
      console.error(err);
      alert("Failed to insert new trip to backend.");
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!window.confirm("Are you sure you want to delete this scheduled road trip?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "trips", tripId));
      loadAdminControlData();
      if (editingTripId === tripId) {
        setEditingTripId(null);
      }
    } catch (err) {
      console.error(err);
      alert("Could not remove trip.");
    }
  };

  const handleStartEditing = (trip: Trip) => {
    setEditingTripId(trip.id);
    setEditPrice(trip.price.toString());
    setEditDates(trip.dates);
    setEditSeatsTotal(trip.seatsTotal.toString());
    setEditSeatsAvail(trip.seatsAvailable.toString());
    setEditStatus(trip.status);
    setEditDesc(trip.description);
    setEditCaptainName(trip.captainName || "RAASTA Captain");
    setEditFlexibleDates(trip.isFlexibleDates || false);
  };

  const handleSaveTripEdits = async (tripId: string) => {
    try {
      const existingTrip = trips.find((t) => t.id === tripId);
      const parsedPrice = Number(editPrice) || 0;
      const parsedSeatsTotal = Math.max(0, Number(editSeatsTotal) || 0);
      const parsedSeatsAvail = Math.min(parsedSeatsTotal, Math.max(0, Number(editSeatsAvail) || 0));

      const updatedPayload: Trip = {
        id: tripId,
        destinationId: existingTrip?.destinationId || "goa",
        destinationName: existingTrip?.destinationName || "RAASTA Trip Route",
        dates: editDates.trim() || existingTrip?.dates || "Upcoming",
        price: parsedPrice,
        originalPrice: existingTrip?.originalPrice || parsedPrice,
        seatsTotal: parsedSeatsTotal,
        seatsAvailable: parsedSeatsAvail,
        description: editDesc.trim().slice(0, 4900) || "Handcrafted RAASTA Escape",
        status: editStatus || "Seats Open",
        captainName: editCaptainName || "RAASTA Captain",
        isFlexibleDates: editFlexibleDates
      };

      await setDoc(doc(db, "trips", tripId), updatedPayload, { merge: true });
      setEditingTripId(null);
      await loadAdminControlData();
    } catch (err) {
      console.error("Failed to commit trip updates:", err);
      alert("Could not commit updates to backend server: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white font-sans flex flex-col justify-between">
      {/* Admin fixed top-bar nav */}
      <nav className="border-b border-white/10 bg-[#07080a]/90 py-4 px-6 fixed top-0 w-full z-45 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={onNavigateToHome} className="flex items-center gap-3 focus:outline-none cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Compass className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-widest text-white font-display">RAASTA</span>
            </button>
            <span className="text-amber-400/80 font-bold ml-1 text-xs select-none uppercase tracking-widest font-display">
              / Admin Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Simulated Concierge Mail outbox tool */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 border border-white/10 bg-white/5 hover:bg-white/10 rounded-2xl text-zinc-300 hover:text-amber-400 transition cursor-pointer shrink-0"
              title="System SMTP Mail Outbox Panel"
            >
              <Mail className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-black text-black select-none animate-bounce">
                  {notificationCount}
                </span>
              )}
            </button>
            <button
              onClick={loadAdminControlData}
              disabled={syncing}
              className="p-2.5 text-zinc-400 hover:text-amber-400 hover:bg-white/5 rounded-2xl border border-white/10 transition disabled:opacity-50 cursor-pointer"
              title="Reload dynamic data logs"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin text-amber-400" : ""}`} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white transition rounded-xl text-red-400 text-xs font-bold uppercase tracking-wider cursor-pointer font-display"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Admin Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-24 pb-16">
        {/* Title area */}
        <div className="mb-8 flex justify-between items-center bg-[#0b0c10] p-6 border border-white/10 rounded-[32px] shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest select-none font-display">
              <ShieldAlert className="w-4 h-4" />
              Secure RAASTA System Control Room
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1.5 tracking-tight text-white font-display">System Admin Console</h1>
            <p className="text-zinc-400 text-xs mt-0.5 font-light leading-relaxed">
              Live statistics overview, customer reservations tables, and direct tour inventory editing tools.
            </p>
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] bg-amber-400/10 border border-amber-400/20 text-amber-400 px-3.5 py-1.5 rounded-xl uppercase font-bold font-display">
            Status: Superuser Online
          </span>
        </div>

        {/* 1. Statistics Metrics Grid Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1 font-display">
              Confirmed Tickets
            </span>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-black text-white font-display">{stats.bookingsCount}</span>
              <FileSpreadsheet className="w-4 h-4 text-zinc-500" />
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1 font-display">
              Settle Revenue
            </span>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-black text-amber-400 font-display">₹{stats.totalRevenue.toLocaleString()}</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1 font-display">
              Active Headcount
            </span>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-black text-amber-400 font-display">{stats.totalSeatsReservations}</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1 font-display">
              Total Listed Trips
            </span>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-black text-white font-display">{stats.currentTripsCount}</span>
              <MapPin className="w-4 h-4 text-zinc-500" />
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-5 col-span-2 md:col-span-1 shadow-lg">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1 font-display">
              Registered Users
            </span>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-black text-white font-display">{stats.registeredUsersCount}</span>
              <Users className="w-4 h-4 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* 2. Split Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left split (Takes up 2 columns): Active reservations & listed tours */}
          <div className="lg:col-span-2 space-y-10">
            {/* Live bookings list section */}
            <div>
              <div className="border-b border-white/10 pb-3 mb-4 flex justify-between items-center">
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 font-display">
                  <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                  Live Booking Ledger
                </h3>
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Synchronized Real-Time Records</span>
              </div>

              {loading ? (
                <div className="py-12 text-center border border-white/10 bg-white/[0.02] rounded-2xl">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
                  <p className="mt-2 text-xs text-zinc-400 uppercase font-semibold font-display">Syncing bookings ledger...</p>
                </div>
              ) : bookings.length > 0 ? (
                <div className="overflow-x-auto border border-white/10 bg-[#0b0c10] rounded-2xl shadow-xl">
                  <table className="w-full text-xs text-left text-zinc-300">
                    <thead className="text-[10px] text-zinc-400 uppercase tracking-wider border-b border-white/10 bg-white/[0.02] font-display">
                      <tr>
                        <th className="px-5 py-4">Ticket ID</th>
                        <th className="px-5 py-4">Traveler Name</th>
                        <th className="px-5 py-4">Voyage Tour / Dates</th>
                        <th className="px-5 py-4">Seat Seats</th>
                        <th className="px-5 py-4">Price paid</th>
                        <th className="px-5 py-4 text-right">Ledger actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.03] transition">
                          <td className="px-5 py-4 font-mono font-bold text-amber-400 whitespace-nowrap">{b.id}</td>
                          <td className="px-5 py-4">
                            <p className="font-bold text-white">{b.travelerName}</p>
                            <p className="text-[10px] text-zinc-500">{b.email}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-zinc-200 text-[11px]">{b.tripName}</p>
                            <p className="text-[10px] text-amber-400/80">{b.bookingDate}</p>
                          </td>
                          <td className="px-5 py-4 font-semibold text-zinc-300">{b.numTravelers} Seats</td>
                          <td className="px-5 py-4 font-mono font-bold text-amber-400">₹{b.totalCost.toLocaleString()}</td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 px-2.5 py-1.5 rounded-lg border border-red-500/20 font-bold uppercase text-[9px] transition cursor-pointer font-display"
                            >
                              Cancel TKT
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center text-zinc-400 border border-white/10 bg-[#0b0c10] rounded-2xl text-xs font-semibold uppercase font-display">
                  No reservations are currently recorded in the database ledger.
                </div>
              )}
            </div>

            {/* Listed Trips/Departures Management List */}
            <div>
              <div className="border-b border-white/10 pb-3 mb-4">
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 font-display">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  Active Tour Packages & Seats Inventory
                </h3>
              </div>

              {loading ? (
                <div className="py-12 text-center border border-white/10 bg-white/[0.02] rounded-2xl">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
                </div>
              ) : trips.length > 0 ? (
                <div className="space-y-4">
                  {trips.map((t) => (
                    <div
                      key={t.id}
                      className={`p-5 rounded-2xl border ${
                        editingTripId === t.id ? "bg-[#0b0c10] border-amber-400/50 shadow-lg shadow-amber-500/10" : "bg-[#0b0c10] border-white/10"
                      } space-y-4 transition`}
                    >
                      {editingTripId === t.id ? (
                        /* Trip Edit UI Form */
                        <div className="space-y-4 text-xs">
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="font-bold uppercase tracking-wider text-amber-400 font-display">
                              Editing Trip: {t.destinationName}
                            </span>
                            <button
                              onClick={() => setEditingTripId(null)}
                              className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1 font-display">Dates Range</label>
                              <input
                                type="text"
                                value={editDates}
                                onChange={(e) => setEditDates(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400/50"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1 font-display">Base Price (INR)</label>
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400/50"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1 font-display">Seats Total Capacity</label>
                              <input
                                type="number"
                                value={editSeatsTotal}
                                onChange={(e) => setEditSeatsTotal(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400/50"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1 font-display">Seats Currently Available</label>
                              <input
                                type="number"
                                value={editSeatsAvail}
                                onChange={(e) => setEditSeatsAvail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400/50"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1 font-display">Seats Status Phrase</label>
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400/50"
                              >
                                <option value="Seats Open">Seats Open</option>
                                <option value="Selling Fast">Selling Fast</option>
                                <option value="Almost Full">Almost Full</option>
                                <option value="Filling Fast">Filling Fast</option>
                                <option value="Monsoon Special">Monsoon Special</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1 font-display">Brief Description</label>
                              <input
                                type="text"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400/50"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1 font-display">Lead Captain / Person</label>
                              <input
                                type="text"
                                value={editCaptainName}
                                onChange={(e) => setEditCaptainName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400/50"
                              />
                            </div>
                            <div className="flex items-center gap-2 select-none py-1.5 sm:col-span-2">
                              <input
                                type="checkbox"
                                id={`editFlexibleDates-${t.id}`}
                                checked={editFlexibleDates}
                                onChange={(e) => setEditFlexibleDates(e.target.checked)}
                                className="w-4 h-4 accent-amber-400 rounded border-white/10 cursor-pointer"
                              />
                              <label htmlFor={`editFlexibleDates-${t.id}`} className="text-[11px] font-bold text-zinc-300 cursor-pointer font-display">
                                Planned for Flexible Dates (TBD/Unscheduled window)
                              </label>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => setEditingTripId(null)}
                              className="px-3.5 py-1.5 border border-white/10 text-zinc-400 hover:text-white rounded-xl transition cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveTripEdits(t.id)}
                              className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-[10px] tracking-wider rounded-xl transition flex items-center gap-1 cursor-pointer font-display"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Save Modifications
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Standard Trip Display UI */
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white uppercase tracking-wide font-display">
                                {t.destinationName}
                              </h4>
                              <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400 uppercase">
                                ID: {t.id}
                              </span>
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 select-none font-display">
                                {t.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-amber-400/70" />
                              {t.dates} • <span className="font-bold text-amber-400 font-display">₹{t.price}</span>
                            </p>
                            <p className="text-[11px] text-zinc-400 mt-1.5 max-w-lg leading-relaxed font-light">{t.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2 select-none">
                              {t.captainName && (
                                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-300 font-medium">
                                  👤 Lead Person: {t.captainName}
                                </span>
                              )}
                              {t.isFlexibleDates && (
                                <span className="text-[10px] bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded text-amber-400 font-bold font-display">
                                  📅 Flexible Dates
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Dynamic visual seat balance scale & operations buttons */}
                          <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-3 text-right">
                            <div className="text-left sm:text-right">
                              <span className="text-[9px] text-zinc-400 uppercase font-bold block mb-0.5 select-none font-display">
                                Occupancy Ratio
                              </span>
                              <span className="text-xs font-bold text-zinc-200">
                                {t.seatsAvailable} of {t.seatsTotal} Seats Left
                              </span>
                              <div className="w-24 h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                                <div
                                  className="h-full bg-emerald-400"
                                  style={{ width: `${(t.seatsAvailable / t.seatsTotal) * 100}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleStartEditing(t)}
                                className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 border border-white/10 rounded-xl transition text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer font-display"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTrip(t.id)}
                                className="p-2 text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 rounded-xl transition text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer font-display"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-zinc-400 border border-white/10 bg-[#0b0c10] rounded-2xl text-xs font-bold uppercase font-display">
                  No dynamic trips listed.
                </div>
              )}
            </div>
          </div>

          {/* Right split (Takes up 1 column): Create a new Trip Form */}
          <div>
            <div className="border-b border-white/10 pb-3 mb-6">
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 font-display">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                Add New Voyage
              </h3>
            </div>

            <form onSubmit={handleAddTrip} className="bg-[#0b0c10] border border-white/10 p-6 rounded-[32px] space-y-4 text-xs shadow-2xl">
              <div>
                <label className="block text-[10px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 select-none font-display">
                  Core Destination Mapping
                </label>
                <select
                  value={newTripDestId}
                  onChange={(e) => {
                    setNewTripDestId(e.target.value);
                    setNewTripDestName(e.target.value === "goa" ? "Goa Monsoon Escapes" : e.target.value === "gokarna" ? "Gokarna Wild Trek" : "Spiti Valley Extreme");
                  }}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-amber-400/50"
                >
                  <option value="goa">Goa (Coastal Haven)</option>
                  <option value="gokarna">Gokarna (Backpacker Trail)</option>
                  <option value="spiti">Spiti Valley (Himalayan Peak)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
                  Trip Display Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spiti Valley Summer Expedition"
                  value={newTripDestName}
                  onChange={(e) => setNewTripDestName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-amber-400/50 placeholder-zinc-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
                  Scheduled Dates Range
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15 – 24 October 2026"
                  value={newTripDates}
                  onChange={(e) => setNewTripDates(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-amber-400/50 placeholder-zinc-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
                    Seats Capacity
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 12"
                    value={newTripSeats}
                    onChange={(e) => setNewTripSeats(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-amber-400/50 placeholder-zinc-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
                    Base Ticket Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="8500"
                    value={newTripPrice}
                    onChange={(e) => setNewTripPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-amber-400/50 placeholder-zinc-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
                  Lead Captain / Person
                </label>
                <input
                  type="text"
                  placeholder="e.g. Captain Vikram Singh"
                  value={newTripCaptainName}
                  onChange={(e) => setNewTripCaptainName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-amber-400/50 placeholder-zinc-500 font-sans"
                />
              </div>

              <div className="flex items-center gap-2 select-none py-1">
                <input
                  type="checkbox"
                  id="newTripFlexibleDates"
                  checked={newTripFlexibleDates}
                  onChange={(e) => setNewTripFlexibleDates(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 rounded border-white/10 cursor-pointer"
                />
                <label htmlFor="newTripFlexibleDates" className="text-[11px] font-bold text-zinc-300 cursor-pointer font-display">
                  Planned for Flexible Dates (TBD/Unscheduled)
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
                  Trip Status Alert
                </label>
                <select
                  value={newTripStatus}
                  onChange={(e) => setNewTripStatus(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-amber-400/50"
                >
                  <option value="Seats Open">Seats Open</option>
                  <option value="Selling Fast">Selling Fast</option>
                  <option value="Almost Full">Almost Full</option>
                  <option value="Filling Fast">Filling Fast</option>
                  <option value="Monsoon Special">Monsoon Special</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
                  Brief description
                </label>
                <textarea
                  placeholder="Add a detailed itinerary summary or trip highlights..."
                  value={newTripDesc}
                  rows={3}
                  onChange={(e) => setNewTripDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-amber-400/50 placeholder-zinc-500 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-amber-400 hover:bg-amber-300 text-black py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer font-display"
              >
                <PlusCircle className="w-4 h-4" />
                Add Voyage Departure
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-[#07080a] border-t border-white/10 pt-8 pb-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© 2026 RAASTA Travels. Secure System Admin Console.</p>
          <div className="flex gap-4 font-mono text-[10px]">
            <span>NODE_ENV: production</span>
            <span>PORT: 3000</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
