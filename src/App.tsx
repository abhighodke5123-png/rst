/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Destinations from "./components/Destinations";
import UpcomingTrips from "./components/UpcomingTrips";
import CommunityReferral from "./components/CommunityReferral";
import AboutSection from "./components/AboutSection";
import TripQuiz from "./components/TripQuiz";
import AboutContact from "./components/AboutContact";
import MyBookingsLedger from "./components/MyBookingsLedger";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import TermsRegulationsModal from "./components/TermsRegulationsModal";
import CareersModal from "./components/CareersModal";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Admin from "./components/Admin";
import { Trip, Booking } from "./types";
import NotificationInbox from "./components/NotificationInbox";
import { TRIPS } from "./data";
import { SlidersHorizontal, Compass, HelpCircle, MessageSquareWarning, X, ShieldCheck } from "lucide-react";
import WhyChooseUs from "./components/WhyChooseUs";
import SocialFeed from "./components/SocialFeed";
import BlogHub from "./components/BlogHub";
import Reviews from "./components/Reviews";
import AmbientTrailAudio from "./components/AmbientTrailAudio";
import PrivacyAgreementPopup from "./components/PrivacyAgreementPopup";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export default function App() {
  // Master Active App View State
  const [view, setView] = useState<"home" | "login" | "signup" | "dashboard" | "admin">("home");

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);

  // Master Scheduled departures list state - synced from server API
  const [tripsList, setTripsList] = useState<Trip[]>(TRIPS);

  // Authenticated user's real bookings
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Active overlays controls
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<Trip | null>(null);
  const [initialFilterDestinationId, setInitialFilterDestinationId] = useState<string | undefined>(undefined);
  const [quizOpen, setQuizOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [privacyAgreementOpen, setPrivacyAgreementOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const [termsTab, setTermsTab] = useState<"terms" | "refunds" | "agreement">("terms");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [cookieConsent, setCookieConsent] = useState(true);

  useEffect(() => {
    // Check if Privacy Policy & Traveler Agreement has been acknowledged
    const acceptedPrivacyAgreement = localStorage.getItem("raasta_privacy_agreement_accepted");
    if (!acceptedPrivacyAgreement) {
      setPrivacyAgreementOpen(true);
    }

    const consent = localStorage.getItem("raastacookieconsent");
    if (!consent) setCookieConsent(false);
  }, []);

  const handleAcceptPrivacyAgreement = () => {
    localStorage.setItem("raasta_privacy_agreement_accepted", new Date().toISOString());
    localStorage.setItem("raastacookieconsent", "true");
    setPrivacyAgreementOpen(false);
    setCookieConsent(true);
  };

  const acceptCookies = () => {
    localStorage.setItem("raastacookieconsent", "true");
    setCookieConsent(true);
  };

  // 1. Synchronize user details from Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user doc from Firestore to get role
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          let role = "user";
          if (userDoc.exists()) {
            role = userDoc.data().role;
          } else {
            // Check if admin email
            role = (user.email?.includes("admin") || user.email?.includes("derek@raasta.com") || user.email?.includes("abhighodke5123@gmail.com") || user.email?.includes("raastatrips.in@gmail.com")) ? "admin" : "user";
            
            // Create user document if it doesn't exist
            await setDoc(doc(db, "users", user.uid), {
              id: user.uid,
              name: user.displayName || "User",
              email: user.email,
              role
            });
          }
          setCurrentUser({
            id: user.uid,
            name: user.displayName || "User",
            email: user.email || "",
            role
          });
        } catch (error) {
          console.error("Error fetching user role", error);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch live tours & user bookings (if authenticated) on load
  const syncServerLogData = async () => {
    try {
      // Fetch dynamic live departures list
      const tripsSnap = await getDocs(collection(db, "trips"));
      const firestoreTrips = tripsSnap.docs.map(doc => doc.data() as Trip);

      if (firestoreTrips.length > 0) {
        // Merge with our rich default catalog to ensure all 2026/2027 expeditions appear
        const mergedMap = new Map<string, Trip>();
        TRIPS.forEach(t => mergedMap.set(t.id, t));
        firestoreTrips.forEach(t => mergedMap.set(t.id, t));
        setTripsList(Array.from(mergedMap.values()));
      } else {
        setTripsList(TRIPS);
      }

      // Fetch bookings list (depending on login status)
      if (currentUser) {
        const q = query(collection(db, "bookings"), where("email", "==", currentUser.email));
        const bookingsSnap = await getDocs(q);
        const userBookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(userBookings);
      } else {
        // Retrieve local storage fallback bookings
        const localBookings = localStorage.getItem("raastabookings");
        if (localBookings) {
          try {
            setBookings(JSON.parse(localBookings));
          } catch {
            setBookings([]);
          }
        }
      }

      // Sync notification alerts count
      if (currentUser) {
        const notifQuery = query(collection(db, "notifications"), where("userId", "==", currentUser.id), where("isRead", "==", false));
        const notifSnap = await getDocs(notifQuery);
        setNotificationCount(notifSnap.size);
      }
    } catch (err) {
      console.warn("Server sync error (using local state):", err);
      setTripsList(TRIPS);
    }
  };

  useEffect(() => {
    syncServerLogData();
  }, [currentUser]);

  // Handle successful reservation
  const handleBookingSuccess = async (newBooking: Booking) => {
    try {
      if (currentUser) {
        await setDoc(doc(db, "bookings", newBooking.id), {
          ...newBooking,
          userId: currentUser.id
        });
      }
      const updated = [newBooking, ...bookings];
      setBookings(updated);
      localStorage.setItem("raastabookings", JSON.stringify(updated));

      // Decrement seats on current trip
      const targetTrip = tripsList.find(t => t.id === newBooking.tripId);
      if (targetTrip && targetTrip.seatsAvailable > 0) {
        const updatedSeats = Math.max(0, targetTrip.seatsAvailable - newBooking.numTravelers);
        const updatedTrip: Trip = {
          ...targetTrip,
          seatsAvailable: updatedSeats,
          status: updatedSeats <= 2 ? "Almost Full" : targetTrip.status
        };

        try {
          await setDoc(doc(db, "trips", targetTrip.id), updatedTrip);
        } catch {
          // Local fallback
        }

        setTripsList(prev => prev.map(t => t.id === targetTrip.id ? updatedTrip : t));
      }
    } catch (err) {
      console.error("Booking record persistence error", err);
    }

    setSelectedTripForBooking(null);
    setBookingsOpen(true);
  };

  // Switch to specific destination departures in the list
  const handleSelectDestinationForDepartures = (destId: string) => {
    setInitialFilterDestinationId(destId);
    const tripsSection = document.getElementById("trips");
    if (tripsSection) {
      tripsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-amber-400 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onQuizClick={() => setQuizOpen(true)}
        onBookingsClick={() => setBookingsOpen(true)}
        bookingCount={bookings.length}
        currentUser={currentUser}
        onAuthClick={() => setView("login")}
        onDashboardClick={() => setView(currentUser?.role === "admin" ? "admin" : "dashboard")}
        onLogout={async () => {
          await auth.signOut();
          setCurrentUser(null);
          setView("home");
        }}
        onLogoClick={() => setView("home")}
        hideNavAnchors={view !== "home"}
        onNotificationsClick={() => setIsNotificationsOpen(true)}
        notificationCount={notificationCount}
      />

      {/* Main View Router */}
      {view === "home" && (
        <main>
          {/* Hero Section with interactive destination preview */}
          <Hero
            onExploreClick={() => {
              const el = document.getElementById("trips");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onPackagesClick={() => {
              const el = document.getElementById("packages");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Curated Circuits / Destinations */}
          <Destinations
            onSelectDestinationForDepartures={handleSelectDestinationForDepartures}
          />

          {/* Upcoming Scheduled Departures */}
          <UpcomingTrips
            tripsList={tripsList}
            onBookTrip={(trip) => setSelectedTripForBooking(trip)}
            selectedTripForBooking={selectedTripForBooking}
            onCloseBookingForm={() => setSelectedTripForBooking(null)}
            onBookingSuccess={handleBookingSuccess}
            initialFilterDestinationId={initialFilterDestinationId}
            onClearInitialFilter={() => setInitialFilterDestinationId(undefined)}
          />

          {/* Why Travel With Us */}
          <WhyChooseUs />

          {/* Real Traveler Reviews */}
          <Reviews />

          {/* Social Community & Traveler Highlights */}
          <SocialFeed />

          {/* Travel Stories & Blog Hub */}
          <BlogHub />

          {/* Philosophy & Team */}
          <AboutSection />

          {/* Referral Community Program */}
          <CommunityReferral />

          {/* Contact, Operations & FAQs */}
          <AboutContact />

          {/* Ambient Trail Audio Player */}
          <AmbientTrailAudio />
        </main>
      )}

      {view === "login" && (
        <Login
          onSuccess={() => setView("home")}
          onSwitchToSignup={() => setView("signup")}
          onCancel={() => setView("home")}
        />
      )}

      {view === "signup" && (
        <Signup
          onSuccess={() => setView("home")}
          onSwitchToLogin={() => setView("login")}
          onCancel={() => setView("home")}
        />
      )}

      {view === "dashboard" && currentUser && (
        <Dashboard
          currentUser={currentUser}
          bookings={bookings}
          onBackToHome={() => setView("home")}
        />
      )}

      {view === "admin" && currentUser && (
        <Admin
          currentUser={currentUser}
          tripsList={tripsList}
          onUpdateTripsList={(updated) => setTripsList(updated)}
          onBackToHome={() => setView("home")}
        />
      )}

      {/* Pop-up Modals & Overlays */}
      <TripQuiz
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        onSelectDestination={handleSelectDestinationForDepartures}
      />

      <MyBookingsLedger
        isOpen={bookingsOpen}
        onClose={() => setBookingsOpen(false)}
        bookings={bookings}
        onCancelBooking={async (bookingId) => {
          try {
            await deleteDoc(doc(db, "bookings", bookingId));
            const updated = bookings.filter(b => b.id !== bookingId);
            setBookings(updated);
            localStorage.setItem("raastabookings", JSON.stringify(updated));
          } catch (err) {
            console.error("Error cancelling booking:", err);
          }
        }}
      />

      <PrivacyAgreementPopup
        isOpen={privacyAgreementOpen}
        onAccept={handleAcceptPrivacyAgreement}
        onOpenFullPolicy={() => {
          setPrivacyAgreementOpen(false);
          setPrivacyOpen(true);
        }}
        onOpenTerms={() => {
          setPrivacyAgreementOpen(false);
          setTermsTab("terms");
          setTermsOpen(true);
        }}
      />

      <PrivacyPolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />

      <TermsRegulationsModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        initialTab={termsTab}
      />

      <CareersModal
        isOpen={careersOpen}
        onClose={() => setCareersOpen(false)}
      />

      <NotificationInbox
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        userId={currentUser?.id}
        onClearCount={() => setNotificationCount(0)}
      />

      {/* Non-intrusive Cookie Consent Banner */}
      {!cookieConsent && !privacyAgreementOpen && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 p-5 rounded-2xl bg-[#0b0c10]/95 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              We use minimal cookies for secure booking sessions and authentication state. No third-party trackers are used.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={() => {
                setTermsTab("terms");
                setTermsOpen(true);
              }}
              className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
            >
              Learn More
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold font-display hover:bg-amber-300 cursor-pointer transition shadow-md shadow-amber-500/10"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#050608] border-t border-white/10 py-16 px-6 relative z-10 text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-black flex items-center justify-center font-black text-sm font-display">
                R
              </span>
              <span className="text-xl font-black text-white font-display tracking-tight">RAASTA</span>
            </div>
            <p className="text-zinc-400 leading-relaxed font-light mb-4">
              Handcrafted overland journeys, high-mountain passes, and intimate micro-group road expeditions across India.
            </p>
            <p className="text-[11px] text-zinc-300 font-mono">
              Govt. Registered Adventure Tour Operator
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 font-display text-sm tracking-wide">Expeditions</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => handleSelectDestinationForDepartures("spiti")} className="hover:text-amber-300 transition cursor-pointer">Spiti Valley High Desert</button></li>
              <li><button onClick={() => handleSelectDestinationForDepartures("ladakh")} className="hover:text-amber-300 transition cursor-pointer">Ladakh & Nubra Valley</button></li>
              <li><button onClick={() => handleSelectDestinationForDepartures("meghalaya")} className="hover:text-amber-300 transition cursor-pointer">Meghalaya Living Bridges</button></li>
              <li><button onClick={() => handleSelectDestinationForDepartures("goa")} className="hover:text-amber-300 transition cursor-pointer">Goa Coastal Heritage</button></li>
              <li><button onClick={() => handleSelectDestinationForDepartures("gokarna")} className="hover:text-amber-300 transition cursor-pointer">Gokarna Cliff Trek</button></li>
              <li><button onClick={() => handleSelectDestinationForDepartures("jaisalmer")} className="hover:text-amber-300 transition cursor-pointer">Thar Desert Caravan</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 font-display text-sm tracking-wide">Community & Trust</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => setCareersOpen(true)} className="hover:text-white transition cursor-pointer">Lead as a Trip Captain</button></li>
              <li><button onClick={() => setQuizOpen(true)} className="hover:text-white transition cursor-pointer">Interactive Route Matcher</button></li>
              <li><button onClick={() => { setTermsTab("refunds"); setTermsOpen(true); }} className="hover:text-white transition cursor-pointer">Cancellation & Refunds</button></li>
              <li><button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition cursor-pointer">Data Privacy (DPDP 2023)</button></li>
              <li><button onClick={() => { setTermsTab("terms"); setTermsOpen(true); }} className="hover:text-white transition cursor-pointer">Expedition Code of Conduct</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 font-display text-sm tracking-wide">Direct Operations</h4>
            <div className="space-y-3 font-mono text-zinc-300">
              <p>Helpline: +91 9226638440</p>
              <p>WhatsApp: +91 9226638440</p>
              <p className="text-zinc-400 font-sans text-[11px]">Operations: 10:00 AM – 8:00 PM IST</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Autumn/Winter 2026 Batches Open
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} RAASTA Travels & Overland Expeditions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition cursor-pointer">Privacy Policy</button>
            <button onClick={() => { setTermsTab("terms"); setTermsOpen(true); }} className="hover:text-white transition cursor-pointer">Terms & Conditions</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
