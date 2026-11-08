import React, { useState, useEffect } from "react";
import { Booking, Trip, Enquiry, EnquiryStatus } from "../types";
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
  Compass,
  Download,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Search,
  Filter,
  Eye,
  Send,
  Layers,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, query, where, getDocs, deleteDoc, doc, setDoc, updateDoc, writeBatch, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { TRIPS } from "../data";

interface AdminProps {
  currentUser: { id: string; name: string; email: string; role: string } | null;
  tripsList: Trip[];
  onUpdateTripsList: (updated: Trip[]) => void;
  onBackToHome: () => void;
}

type AdminTab = "analytics" | "enquiries" | "trips" | "departures" | "bookings" | "reports";

export default function Admin({
  currentUser,
  tripsList,
  onUpdateTripsList,
  onBackToHome
}: AdminProps) {
  // Gate check: only admins allowed
  const isAdmin = currentUser?.role === "admin";

  const [activeTab, setActiveTab] = useState<AdminTab>("enquiries");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Trip[]>(tripsList);

  // Enquiry filters & selected enquiry
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>("All");
  const [enquirySearchTerm, setEnquirySearchTerm] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [internalNoteDraft, setInternalNoteDraft] = useState("");
  const [followUpDateDraft, setFollowUpDateDraft] = useState("");
  const [assignedMemberDraft, setAssignedMemberDraft] = useState("");

  // Trip editing states
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editDates, setEditDates] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editSeatsTotal, setEditSeatsTotal] = useState("");
  const [editSeatsAvail, setEditSeatsAvail] = useState("");
  const [editStatus, setEditStatus] = useState("Seats Open");
  const [editCollection, setEditCollection] = useState<"explore" | "select">("explore");
  const [editDesc, setEditDesc] = useState("");
  const [editOverview, setEditOverview] = useState("");

  // New Trip form state
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [newTripDestId, setNewTripDestId] = useState("spiti");
  const [newTripDestName, setNewTripDestName] = useState("");
  const [newTripCollection, setNewTripCollection] = useState<"explore" | "select">("explore");
  const [newTripDates, setNewTripDates] = useState("");
  const [newTripDuration, setNewTripDuration] = useState("5 Days / 4 Nights");
  const [newTripPrice, setNewTripPrice] = useState("12999");
  const [newTripSeats, setNewTripSeats] = useState("14");
  const [newTripDesc, setNewTripDesc] = useState("");
  const [newTripOverview, setNewTripOverview] = useState("");
  const [newTripStatus, setNewTripStatus] = useState("Seats Open");

  // Load all operational data from Firestore
  const loadAdminData = async () => {
    setSyncing(true);
    try {
      // 1. Fetch Enquiries
      let enquiriesData: Enquiry[] = [];
      try {
        const enqSnap = await getDocs(collection(db, "enquiries"));
        enquiriesData = enqSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Enquiry));
      } catch (err) {
        console.warn("Firestore enquiries load error, checking local storage:", err);
        const cached = localStorage.getItem("raasta_user_enquiries");
        if (cached) {
          enquiriesData = JSON.parse(cached);
        }
      }
      setEnquiries(enquiriesData);

      // 2. Fetch Trips
      let tripsData: Trip[] = [];
      try {
        const tripsSnap = await getDocs(collection(db, "trips"));
        if (!tripsSnap.empty) {
          tripsData = tripsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Trip));
        } else {
          tripsData = TRIPS;
        }
      } catch {
        tripsData = TRIPS;
      }
      setTrips(tripsData);
      onUpdateTripsList(tripsData);

      // 3. Fetch Bookings
      try {
        const bookingsSnap = await getDocs(collection(db, "bookings"));
        const bData = bookingsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(bData);
      } catch {
        setBookings([]);
      }
    } catch (err) {
      console.error("Admin data synchronization error:", err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Update Enquiry Status & Notes
  const handleUpdateEnquiry = async (
    enquiryId: string,
    newStatus: EnquiryStatus,
    notes?: string,
    followUp?: string,
    assigned?: string
  ) => {
    try {
      const updatePayload: Partial<Enquiry> = {
        status: newStatus,
        ...(notes !== undefined && { internalNotes: notes }),
        ...(followUp !== undefined && { followUpDate: followUp }),
        ...(assigned !== undefined && { assignedTo: assigned })
      };

      await updateDoc(doc(db, "enquiries", enquiryId), updatePayload);

      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, ...updatePayload } : e))
      );

      if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, ...updatePayload } : null));
      }
    } catch (err) {
      console.error("Failed to update enquiry:", err);
      // Fallback update in state
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === enquiryId
            ? {
                ...e,
                status: newStatus,
                internalNotes: notes ?? e.internalNotes,
                followUpDate: followUp ?? e.followUpDate,
                assignedTo: assigned ?? e.assignedTo
              }
            : e
        )
      );
    }
  };

  // Start editing a trip
  const handleStartEditingTrip = (t: Trip) => {
    setEditingTripId(t.id);
    setEditPrice(t.price.toString());
    setEditDates(t.dates);
    setEditDuration(t.duration || "5 Days / 4 Nights");
    setEditSeatsTotal(t.seatsTotal.toString());
    setEditSeatsAvail(t.seatsAvailable.toString());
    setEditStatus(t.status);
    setEditCollection(t.collection || "explore");
    setEditDesc(t.description);
    setEditOverview(t.overview || "");
  };

  // Save trip edits
  const handleSaveTripEdits = async (tripId: string) => {
    const existing = trips.find((t) => t.id === tripId);
    if (!existing) return;

    const parsedPrice = Number(editPrice) || existing.price;
    const parsedSeatsTotal = Number(editSeatsTotal) || existing.seatsTotal;
    const parsedSeatsAvail = Math.min(parsedSeatsTotal, Number(editSeatsAvail) || 0);

    const updated: Trip = {
      ...existing,
      price: parsedPrice,
      dates: editDates.trim() || existing.dates,
      duration: editDuration.trim() || existing.duration,
      seatsTotal: parsedSeatsTotal,
      seatsAvailable: parsedSeatsAvail,
      status: editStatus,
      collection: editCollection,
      description: editDesc.trim(),
      overview: editOverview.trim()
    };

    try {
      await setDoc(doc(db, "trips", tripId), updated, { merge: true });
      const newTrips = trips.map((t) => (t.id === tripId ? updated : t));
      setTrips(newTrips);
      onUpdateTripsList(newTrips);
      setEditingTripId(null);
    } catch (err) {
      console.error("Error updating trip:", err);
      alert("Failed to commit trip updates: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Create new trip
  const handleCreateNewTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripDestName || !newTripDates) return;

    const newTripId = `trip-${newTripDestId}-${Date.now().toString().slice(-4)}`;
    const created: Trip = {
      id: newTripId,
      destinationId: newTripDestId,
      destinationName: newTripDestName.trim(),
      collection: newTripCollection,
      dates: newTripDates.trim(),
      duration: newTripDuration.trim(),
      price: Number(newTripPrice) || 9999,
      seatsTotal: Number(newTripSeats) || 14,
      seatsAvailable: Number(newTripSeats) || 14,
      status: newTripStatus,
      description: newTripDesc.trim() || "Handcrafted RAASTA Expedition",
      overview: newTripOverview.trim(),
      category: "Adventure",
      published: true
    };

    try {
      await setDoc(doc(db, "trips", newTripId), created);
      const updatedList = [created, ...trips];
      setTrips(updatedList);
      onUpdateTripsList(updatedList);
      setIsCreatingTrip(false);
      setNewTripDestName("");
      setNewTripDates("");
      setNewTripDesc("");
    } catch (err) {
      console.error("Error creating trip:", err);
      alert("Could not save new trip: " + String(err));
    }
  };

  // Export Enquiries as CSV
  const exportEnquiriesCSV = () => {
    if (enquiries.length === 0) {
      alert("No enquiry records to export.");
      return;
    }

    const headers = [
      "Enquiry ID",
      "Full Name",
      "Phone",
      "Email",
      "Destination",
      "Dates",
      "Travelers",
      "Collection",
      "Status",
      "Created At",
      "Assigned To",
      "Internal Notes"
    ];

    const rows = enquiries.map((e) => [
      `"${e.id}"`,
      `"${e.fullName}"`,
      `"${e.phone}"`,
      `"${e.email}"`,
      `"${e.destination}"`,
      `"${e.departureDate}"`,
      e.numTravelers,
      `"${e.collectionPreference}"`,
      `"${e.status}"`,
      `"${e.createdAt}"`,
      `"${e.assignedTo || ""}"`,
      `"${(e.internalNotes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `raasta_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = enquiryStatusFilter === "All" || e.status === enquiryStatusFilter;
    const matchesSearch =
      e.fullName.toLowerCase().includes(enquirySearchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(enquirySearchTerm.toLowerCase()) ||
      e.destination.toLowerCase().includes(enquirySearchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(enquirySearchTerm.toLowerCase()) ||
      e.phone.includes(enquirySearchTerm);
    return matchesStatus && matchesSearch;
  });

  // Access denied screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#182622] text-[#EDE9DF] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#202522] border border-rose-500/30 rounded-[32px] p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#EDE9DF] mb-2">Restricted Access</h2>
          <p className="text-xs sm:text-sm text-[#EDE9DF]/70 font-light leading-relaxed mb-6">
            You must be signed in with an authorized RAASTA Administrator account to view this operations portal.
          </p>
          <button
            onClick={onBackToHome}
            className="w-full py-3.5 rounded-2xl bg-[#D4A96C] text-[#182622] font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#182622] text-[#EDE9DF] flex flex-col font-sans">
      
      {/* Top Admin Bar */}
      <header className="border-b border-[#8C9A82]/20 bg-[#202522]/95 backdrop-blur-xl py-4 px-6 fixed top-0 w-full z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={onBackToHome} className="flex items-center gap-3 cursor-pointer text-left">
              <div className="w-9 h-9 rounded-xl bg-[#D4A96C] text-[#182622] flex items-center justify-center font-bold text-base shadow-md font-serif">
                R
              </div>
              <div>
                <span className="text-lg font-serif font-bold text-[#EDE9DF]">RAASTA TRIPS</span>
                <span className="text-[10px] text-[#D4A96C] font-mono block uppercase">Admin Command Center</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              disabled={syncing}
              className="p-2.5 rounded-xl bg-[#182622] text-[#EDE9DF]/70 hover:text-[#D4A96C] border border-[#8C9A82]/30 transition cursor-pointer"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin text-[#D4A96C]" : ""}`} />
            </button>

            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#182622] hover:bg-[#182622]/80 text-[#EDE9DF] border border-[#8C9A82]/30 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
            >
              <span>View Site</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-28 pb-20">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#202522] border border-[#8C9A82]/25 mb-8">
          {[
            { id: "enquiries", label: "Enquiry Pipeline", count: enquiries.length },
            { id: "analytics", label: "Dashboard Metrics" },
            { id: "trips", label: "Trip Catalog", count: trips.length },
            { id: "departures", label: "Departures & Seats" },
            { id: "bookings", label: "Confirmed Ledger", count: bookings.length },
            { id: "reports", label: "Export & Reports" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[#D4A96C] text-[#182622] font-bold shadow-md"
                  : "text-[#EDE9DF]/70 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id ? "bg-[#182622] text-[#D4A96C]" : "bg-[#182622] text-[#EDE9DF]/60"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: ENQUIRY PIPELINE */}
        {/* ============================================================== */}
        {activeTab === "enquiries" && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="bg-[#202522] border border-[#8C9A82]/25 p-5 rounded-[28px] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9A82]" />
                <input
                  type="text"
                  placeholder="Search by customer name, email, phone, or Ref ID..."
                  value={enquirySearchTerm}
                  onChange={(e) => setEnquirySearchTerm(e.target.value)}
                  className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl pl-11 pr-4 py-2.5 text-xs text-[#EDE9DF] placeholder-[#EDE9DF]/40 focus:outline-none focus:border-[#D4A96C]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                {["All", "New", "Contacted", "Quotation Sent", "Confirmed", "Cancelled", "Closed"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      enquiryStatusFilter === st
                        ? "bg-[#EDE9DF] text-[#182622]"
                        : "bg-[#182622] text-[#EDE9DF]/60 hover:text-white border border-[#8C9A82]/20"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={exportEnquiriesCSV}
                className="px-4 py-2.5 rounded-xl bg-[#182622] hover:bg-[#182622]/80 text-[#D4A96C] border border-[#D4A96C]/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Enquiries Table */}
            <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[28px] overflow-hidden shadow-2xl">
              {filteredEnquiries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#EDE9DF]/80">
                    <thead className="bg-[#182622] text-[10px] uppercase font-mono tracking-widest text-[#D4A96C] border-b border-[#8C9A82]/20">
                      <tr>
                        <th className="p-4">Ref ID</th>
                        <th className="p-4">Traveler Info</th>
                        <th className="p-4">Destination & Dates</th>
                        <th className="p-4">Stream</th>
                        <th className="p-4">Travelers</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#8C9A82]/15">
                      {filteredEnquiries.map((enq) => {
                        const getStatusBadge = (s: EnquiryStatus) => {
                          switch (s) {
                            case "New":
                              return "bg-amber-400/20 text-amber-300 border-amber-400/40";
                            case "Contacted":
                              return "bg-sky-400/20 text-sky-300 border-sky-400/40";
                            case "Quotation Sent":
                              return "bg-purple-400/20 text-purple-300 border-purple-400/40";
                            case "Confirmed":
                              return "bg-emerald-400/20 text-emerald-300 border-emerald-400/40";
                            case "Cancelled":
                              return "bg-rose-400/20 text-rose-300 border-rose-400/40";
                            case "Closed":
                              return "bg-zinc-400/20 text-zinc-300 border-zinc-400/40";
                            default:
                              return "bg-zinc-500/20 text-zinc-300";
                          }
                        };

                        const formattedPhone = enq.phone.replace(/\D/g, "");
                        const waLink = `https://wa.me/${formattedPhone}?text=Hi%20${encodeURIComponent(enq.fullName)}%2C%20this%20is%20RAASTA%20Trips%20regarding%20your%20enquiry%20(${enq.id})%20for%20${encodeURIComponent(enq.destination)}.`;

                        return (
                          <tr key={enq.id} className="hover:bg-[#182622]/40 transition-colors">
                            <td className="p-4 font-mono font-bold text-[#D4A96C]">{enq.id}</td>
                            <td className="p-4">
                              <div className="font-semibold text-[#EDE9DF]">{enq.fullName}</div>
                              <div className="text-[11px] text-[#EDE9DF]/60 font-mono">{enq.phone}</div>
                              <div className="text-[10px] text-[#EDE9DF]/40">{enq.email}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-[#EDE9DF]">{enq.destination}</div>
                              <div className="text-[11px] text-[#D4A96C] font-mono">{enq.departureDate}</div>
                            </td>
                            <td className="p-4 font-mono uppercase text-[10px]">
                              {enq.collectionPreference}
                            </td>
                            <td className="p-4 font-mono">{enq.numTravelers}</td>
                            <td className="p-4">
                              <select
                                value={enq.status}
                                onChange={(e) => handleUpdateEnquiry(enq.id, e.target.value as EnquiryStatus)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border uppercase cursor-pointer ${getStatusBadge(
                                  enq.status
                                )}`}
                              >
                                <option value="New" className="bg-[#202522] text-white">New</option>
                                <option value="Contacted" className="bg-[#202522] text-white">Contacted</option>
                                <option value="Quotation Sent" className="bg-[#202522] text-white">Quotation Sent</option>
                                <option value="Confirmed" className="bg-[#202522] text-white">Confirmed</option>
                                <option value="Cancelled" className="bg-[#202522] text-white">Cancelled</option>
                                <option value="Closed" className="bg-[#202522] text-white">Closed</option>
                              </select>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold hover:bg-emerald-500 hover:text-black transition"
                                title="Open WhatsApp chat with prefilled context"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>

                              <button
                                onClick={() => {
                                   setSelectedEnquiry(enq);
                                   setInternalNoteDraft(enq.internalNotes || "");
                                   setFollowUpDateDraft(enq.followUpDate || "");
                                   setAssignedMemberDraft(enq.assignedTo || "");
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#182622] text-[#EDE9DF] border border-[#8C9A82]/30 text-[11px] font-semibold hover:border-[#D4A96C]"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#D4A96C]" />
                                <span>Details</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-[#EDE9DF]/60 text-xs">
                  No enquiry records found matching your filters.
                </div>
              )}
            </div>

            {/* Selected Enquiry Detailed Drawer / Modal */}
            <AnimatePresence>
              {selectedEnquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl bg-[#202522] border border-[#8C9A82]/30 rounded-[32px] p-8 text-[#EDE9DF] shadow-2xl max-h-[90vh] overflow-y-auto"
                  >
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="absolute top-6 right-6 p-2 rounded-full bg-[#182622] text-[#EDE9DF]/60 hover:text-white border border-[#8C9A82]/20"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4A96C] block mb-1">
                        Enquiry Management Record
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-[#EDE9DF]">
                        {selectedEnquiry.fullName} — Ref: {selectedEnquiry.id}
                      </h3>
                      <span className="text-xs text-[#EDE9DF]/60 font-mono block mt-1">
                        Submitted: {new Date(selectedEnquiry.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#182622] border border-[#8C9A82]/20 text-xs mb-6">
                      <div>
                        <span className="text-[#EDE9DF]/50 block">Destination:</span>
                        <span className="font-semibold text-[#EDE9DF]">{selectedEnquiry.destination}</span>
                      </div>
                      <div>
                        <span className="text-[#EDE9DF]/50 block">Target Dates:</span>
                        <span className="font-semibold text-[#D4A96C]">{selectedEnquiry.departureDate}</span>
                      </div>
                      <div>
                        <span className="text-[#EDE9DF]/50 block">Number of Travelers:</span>
                        <span className="font-semibold text-[#EDE9DF]">{selectedEnquiry.numTravelers}</span>
                      </div>
                      <div>
                        <span className="text-[#EDE9DF]/50 block">Collection Preference:</span>
                        <span className="font-semibold text-[#EDE9DF] uppercase">{selectedEnquiry.collectionPreference}</span>
                      </div>
                      <div>
                        <span className="text-[#EDE9DF]/50 block">Phone:</span>
                        <span className="font-mono text-[#EDE9DF]">{selectedEnquiry.phone}</span>
                      </div>
                      <div>
                        <span className="text-[#EDE9DF]/50 block">Email:</span>
                        <span className="font-mono text-[#EDE9DF]">{selectedEnquiry.email}</span>
                      </div>
                    </div>

                    {selectedEnquiry.additionalRequirements && (
                      <div className="p-4 rounded-2xl bg-[#182622] border border-[#8C9A82]/20 text-xs mb-6">
                        <span className="text-[10px] font-mono text-[#D4A96C] uppercase block mb-1">
                          Customer Notes / Special Requests:
                        </span>
                        <p className="text-[#EDE9DF]/80 font-light">{selectedEnquiry.additionalRequirements}</p>
                      </div>
                    )}

                    {/* Operational controls */}
                    <div className="space-y-4 pt-4 border-t border-[#8C9A82]/20">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-[#EDE9DF]/60 mb-1">
                            Assign Team Lead:
                          </label>
                          <input
                            type="text"
                            value={assignedMemberDraft}
                            onChange={(e) => setAssignedMemberDraft(e.target.value)}
                            placeholder="e.g. Siddharth Rao"
                            className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-3 py-2 text-xs text-[#EDE9DF]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-[#EDE9DF]/60 mb-1">
                            Follow-Up Date:
                          </label>
                          <input
                            type="text"
                            value={followUpDateDraft}
                            onChange={(e) => setFollowUpDateDraft(e.target.value)}
                            placeholder="e.g. 15 Nov 2026"
                            className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-3 py-2 text-xs text-[#EDE9DF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#EDE9DF]/60 mb-1">
                          Internal Notes & Quotation Details:
                        </label>
                        <textarea
                          rows={3}
                          value={internalNoteDraft}
                          onChange={(e) => setInternalNoteDraft(e.target.value)}
                          placeholder="Client prefers double occupancy / sent itinerary quote via WhatsApp..."
                          className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl p-3 text-xs text-[#EDE9DF] resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => setSelectedEnquiry(null)}
                          className="px-4 py-2 rounded-xl bg-[#182622] text-[#EDE9DF]/70 text-xs font-semibold uppercase"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={async () => {
                            await handleUpdateEnquiry(
                              selectedEnquiry.id,
                              selectedEnquiry.status,
                              internalNoteDraft,
                              followUpDateDraft,
                              assignedMemberDraft
                            );
                            alert("Enquiry record updated successfully.");
                            setSelectedEnquiry(null);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#D4A96C] text-[#182622] font-bold text-xs uppercase tracking-wider"
                        >
                          Save Record
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: DASHBOARD METRICS */}
        {/* ============================================================== */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[28px] p-6 shadow-xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#EDE9DF]/60 block mb-1">
                  Total Enquiries
                </span>
                <div className="text-3xl font-serif font-bold text-[#D4A96C]">{enquiries.length}</div>
                <div className="text-[11px] text-emerald-400 mt-2 font-mono">
                  {enquiries.filter((e) => e.status === "New").length} New Awaiting Review
                </div>
              </div>

              <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[28px] p-6 shadow-xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#EDE9DF]/60 block mb-1">
                  Active Expeditions
                </span>
                <div className="text-3xl font-serif font-bold text-[#EDE9DF]">{trips.length}</div>
                <div className="text-[11px] text-[#D4A96C] mt-2 font-mono">
                  {trips.filter((t) => t.collection === "select").length} Select / {trips.filter((t) => t.collection === "explore").length} Explore
                </div>
              </div>

              <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[28px] p-6 shadow-xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#EDE9DF]/60 block mb-1">
                  Confirmed Bookings
                </span>
                <div className="text-3xl font-serif font-bold text-emerald-400">{bookings.length}</div>
                <div className="text-[11px] text-[#EDE9DF]/60 mt-2 font-mono">Manual Verification Active</div>
              </div>

              <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[28px] p-6 shadow-xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#EDE9DF]/60 block mb-1">
                  Enquiry Pipeline Conversion
                </span>
                <div className="text-3xl font-serif font-bold text-[#D4A96C]">
                  {enquiries.length > 0
                    ? `${Math.round(
                        (enquiries.filter((e) => e.status === "Confirmed").length / enquiries.length) * 100
                      )}%`
                    : "0%"}
                </div>
                <div className="text-[11px] text-[#EDE9DF]/60 mt-2 font-mono">Enquiry-First Model</div>
              </div>
            </div>

            {/* Operational Quality Assurance Standard */}
            <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[32px] p-8 shadow-xl">
              <h3 className="text-xl font-serif font-bold text-[#EDE9DF] mb-4">
                Operational Integrity Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#EDE9DF]/80">
                <div className="p-4 rounded-2xl bg-[#182622] border border-[#8C9A82]/20">
                  <div className="font-semibold text-[#D4A96C] mb-1 font-mono uppercase text-[11px]">1. No Fake Bookings</div>
                  <p className="font-light leading-relaxed">
                    All reservations must proceed through genuine availability verification with route captains before payment details are shared.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#182622] border border-[#8C9A82]/20">
                  <div className="font-semibold text-[#D4A96C] mb-1 font-mono uppercase text-[11px]">2. 14-Seat Microgroup Cap</div>
                  <p className="font-light leading-relaxed">
                    Vehicles must never exceed 14 passengers to ensure luggage space, oxygen access, and pristine trail etiquette.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#182622] border border-[#8C9A82]/20">
                  <div className="font-semibold text-[#D4A96C] mb-1 font-mono uppercase text-[11px]">3. 24-Hour SLA</div>
                  <p className="font-light leading-relaxed">
                    Every new enquiry submitted via web or WhatsApp must receive a human response within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TRIP CATALOG MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === "trips" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#EDE9DF]">Expedition Catalog</h3>
                <p className="text-xs text-[#EDE9DF]/60">Manage trip streams, pricing, and itinerary overviews.</p>
              </div>

              <button
                onClick={() => setIsCreatingTrip(!isCreatingTrip)}
                className="px-4 py-2.5 rounded-xl bg-[#D4A96C] text-[#182622] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Trip</span>
              </button>
            </div>

            {/* Create Trip Form */}
            {isCreatingTrip && (
              <form
                onSubmit={handleCreateNewTrip}
                className="bg-[#202522] border border-[#D4A96C]/40 rounded-[32px] p-6 sm:p-8 space-y-4 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-serif font-bold text-[#EDE9DF]">Create New Expedition Departure</h4>
                  <button
                    type="button"
                    onClick={() => setIsCreatingTrip(false)}
                    className="p-1 rounded-full text-[#EDE9DF]/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#EDE9DF]/60 mb-1">Destination Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Spiti Valley High Desert"
                      value={newTripDestName}
                      onChange={(e) => setNewTripDestName(e.target.value)}
                      className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-3 py-2 text-xs text-[#EDE9DF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#EDE9DF]/60 mb-1">Collection Style</label>
                    <select
                      value={newTripCollection}
                      onChange={(e) => setNewTripCollection(e.target.value as any)}
                      className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-3 py-2 text-xs text-[#EDE9DF]"
                    >
                      <option value="explore">RAASTA Explore (Accessible / Student)</option>
                      <option value="select">RAASTA Select (Curated / Boutique)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#EDE9DF]/60 mb-1">Departure Dates *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10 - 17 Jun 2026"
                      value={newTripDates}
                      onChange={(e) => setNewTripDates(e.target.value)}
                      className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-3 py-2 text-xs text-[#EDE9DF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#EDE9DF]/60 mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 8 Days / 7 Nights"
                      value={newTripDuration}
                      onChange={(e) => setNewTripDuration(e.target.value)}
                      className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-3 py-2 text-xs text-[#EDE9DF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#EDE9DF]/60 mb-1">Price per person (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newTripPrice}
                      onChange={(e) => setNewTripPrice(e.target.value)}
                      className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-3 py-2 text-xs text-[#EDE9DF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#EDE9DF]/60 mb-1">Total Seats (Max 14)</label>
                    <input
                      type="number"
                      max={14}
                      value={newTripSeats}
                      onChange={(e) => setNewTripSeats(e.target.value)}
                      className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-3 py-2 text-xs text-[#EDE9DF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#EDE9DF]/60 mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={newTripDesc}
                    onChange={(e) => setNewTripDesc(e.target.value)}
                    placeholder="Brief card summary..."
                    className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-xl px-3 py-2 text-xs text-[#EDE9DF]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#D4A96C] text-[#182622] font-bold text-xs uppercase tracking-wider"
                >
                  Publish Trip
                </button>
              </form>
            )}

            {/* Trips List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trips.map((t) => {
                const isEditing = editingTripId === t.id;
                return (
                  <div
                    key={t.id}
                    className="bg-[#202522] border border-[#8C9A82]/25 rounded-[28px] p-6 shadow-xl flex flex-col justify-between"
                  >
                    {!isEditing ? (
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            t.collection === "select"
                              ? "bg-[#D4A96C]/20 text-[#D4A96C] border border-[#D4A96C]/40"
                              : "bg-[#8C9A82]/20 text-[#EDE9DF] border border-[#8C9A82]/40"
                          }`}>
                            {t.collection === "select" ? "RAASTA SELECT" : "RAASTA EXPLORE"}
                          </span>
                          <span className="text-xs font-mono text-emerald-400">{t.status}</span>
                        </div>

                        <h4 className="text-xl font-serif font-bold text-[#EDE9DF] mb-1">{t.destinationName}</h4>
                        <div className="text-xs text-[#D4A96C] font-mono mb-3">{t.dates} • {t.duration}</div>
                        <p className="text-xs text-[#EDE9DF]/75 font-light leading-relaxed mb-4">{t.description}</p>

                        <div className="flex items-center justify-between text-xs py-3 border-t border-[#8C9A82]/20">
                          <div>
                            <span className="text-[10px] text-[#EDE9DF]/50 block">Price</span>
                            <span className="font-serif font-bold text-lg text-[#D4A96C]">₹{t.price.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#EDE9DF]/50 block">Capacity</span>
                            <span className="font-mono text-[#EDE9DF]">{t.seatsAvailable} / {t.seatsTotal} Open</span>
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEditingTrip(t)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#182622] hover:bg-[#182622]/80 text-[#D4A96C] border border-[#8C9A82]/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Editing Form */
                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-mono text-[#D4A96C] uppercase font-bold">Edit Trip</span>
                          <button onClick={() => setEditingTripId(null)} className="text-[#EDE9DF]/50 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] text-[#EDE9DF]/60 font-mono">Price (₹)</label>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-lg p-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#EDE9DF]/60 font-mono">Dates</label>
                            <input
                              type="text"
                              value={editDates}
                              onChange={(e) => setEditDates(e.target.value)}
                              className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-lg p-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#EDE9DF]/60 font-mono">Duration</label>
                            <input
                              type="text"
                              value={editDuration}
                              onChange={(e) => setEditDuration(e.target.value)}
                              className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-lg p-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#EDE9DF]/60 font-mono">Status</label>
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-lg p-2 text-xs text-[#EDE9DF]"
                            >
                              <option value="Seats Open">Seats Open</option>
                              <option value="Selling Fast">Selling Fast</option>
                              <option value="Almost Full">Almost Full</option>
                              <option value="Monsoon Special">Monsoon Special</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#EDE9DF]/60 font-mono">Seats Available</label>
                            <input
                              type="number"
                              value={editSeatsAvail}
                              onChange={(e) => setEditSeatsAvail(e.target.value)}
                              className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-lg p-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#EDE9DF]/60 font-mono">Stream</label>
                            <select
                              value={editCollection}
                              onChange={(e) => setEditCollection(e.target.value as any)}
                              className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-lg p-2 text-xs text-[#EDE9DF]"
                            >
                              <option value="explore">RAASTA Explore</option>
                              <option value="select">RAASTA Select</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#EDE9DF]/60 font-mono">Description</label>
                          <textarea
                            rows={2}
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full bg-[#182622] border border-[#8C9A82]/30 rounded-lg p-2 text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditingTripId(null)}
                            className="px-3 py-1.5 rounded-lg bg-[#182622] text-xs font-semibold uppercase"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveTripEdits(t.id)}
                            className="px-4 py-1.5 rounded-lg bg-[#D4A96C] text-[#182622] font-bold text-xs uppercase"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: DEPARTURE INVENTORY */}
        {/* ============================================================== */}
        {activeTab === "departures" && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#EDE9DF]">Departure Dates & Seat Capacity</h3>
            <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[28px] overflow-hidden">
              <table className="w-full text-left text-xs text-[#EDE9DF]/80">
                <thead className="bg-[#182622] text-[10px] uppercase font-mono tracking-widest text-[#D4A96C] border-b border-[#8C9A82]/20">
                  <tr>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Departure Dates</th>
                    <th className="p-4">Stream</th>
                    <th className="p-4">Total Seats</th>
                    <th className="p-4">Available</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8C9A82]/15">
                  {trips.map((t) => (
                    <tr key={t.id} className="hover:bg-[#182622]/40">
                      <td className="p-4 font-semibold text-[#EDE9DF]">{t.destinationName}</td>
                      <td className="p-4 text-[#D4A96C] font-mono">{t.dates}</td>
                      <td className="p-4 uppercase font-mono text-[10px]">{t.collection}</td>
                      <td className="p-4 font-mono">{t.seatsTotal}</td>
                      <td className="p-4 font-mono text-emerald-400 font-bold">{t.seatsAvailable}</td>
                      <td className="p-4 font-mono text-xs">{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: CONFIRMED BOOKINGS */}
        {/* ============================================================== */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#EDE9DF]">Confirmed Traveler Ledger</h3>
            <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[28px] overflow-hidden">
              {bookings.length > 0 ? (
                <table className="w-full text-left text-xs text-[#EDE9DF]/80">
                  <thead className="bg-[#182622] text-[10px] uppercase font-mono tracking-widest text-[#D4A96C] border-b border-[#8C9A82]/20">
                    <tr>
                      <th className="p-4">Booking ID</th>
                      <th className="p-4">Traveler Name</th>
                      <th className="p-4">Expedition</th>
                      <th className="p-4">Seats</th>
                      <th className="p-4">Total (₹)</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#8C9A82]/15">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#182622]/40">
                        <td className="p-4 font-mono font-bold text-[#D4A96C]">{b.id}</td>
                        <td className="p-4">
                          <div className="font-semibold text-[#EDE9DF]">{b.travelerName}</div>
                          <div className="text-[10px] text-[#EDE9DF]/50">{b.email}</div>
                        </td>
                        <td className="p-4 font-semibold">{b.tripName}</td>
                        <td className="p-4 font-mono">{b.numTravelers}</td>
                        <td className="p-4 font-mono font-bold text-[#D4A96C]">₹{b.totalCost?.toLocaleString()}</td>
                        <td className="p-4 font-mono text-emerald-400 font-semibold">{b.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-xs text-[#EDE9DF]/60">
                  No confirmed bookings recorded yet. Enquiries must be manually verified and confirmed.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: REPORTS & EXPORT */}
        {/* ============================================================== */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#EDE9DF]">Operational Reports & Data Exports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[28px] p-8 shadow-xl">
                <FileSpreadsheet className="w-8 h-8 text-[#D4A96C] mb-4" />
                <h4 className="text-lg font-serif font-bold text-[#EDE9DF] mb-2">Export Customer Enquiries</h4>
                <p className="text-xs text-[#EDE9DF]/70 font-light leading-relaxed mb-6">
                  Download all enquiry records including contact info, destination, dates, travelers, and internal notes as a CSV spreadsheet.
                </p>
                <button
                  onClick={exportEnquiriesCSV}
                  className="px-5 py-3 rounded-xl bg-[#D4A96C] text-[#182622] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Enquiries CSV ({enquiries.length} records)</span>
                </button>
              </div>

              <div className="bg-[#202522] border border-[#8C9A82]/25 rounded-[28px] p-8 shadow-xl">
                <FileSpreadsheet className="w-8 h-8 text-emerald-400 mb-4" />
                <h4 className="text-lg font-serif font-bold text-[#EDE9DF] mb-2">Export Trip Departures Catalog</h4>
                <p className="text-xs text-[#EDE9DF]/70 font-light leading-relaxed mb-6">
                  Download active trip inventory, seat counts, pricing, and stream classifications for accounting and logistics planning.
                </p>
                <button
                  onClick={() => {
                    const headers = ["Trip ID", "Destination", "Collection", "Dates", "Duration", "Price", "Seats Total", "Seats Avail", "Status"];
                    const rows = trips.map((t) => [
                      `"${t.id}"`,
                      `"${t.destinationName}"`,
                      `"${t.collection}"`,
                      `"${t.dates}"`,
                      `"${t.duration}"`,
                      t.price,
                      t.seatsTotal,
                      t.seatsAvailable,
                      `"${t.status}"`
                    ]);
                    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `raasta_departures_${new Date().toISOString().slice(0, 10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-5 py-3 rounded-xl bg-[#182622] text-[#EDE9DF] border border-[#8C9A82]/30 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:border-[#D4A96C]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Departures CSV ({trips.length} routes)</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}