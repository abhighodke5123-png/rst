/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CollectionsSection from "./components/CollectionsSection";
import UpcomingTrips from "./components/UpcomingTrips";
import Destinations from "./components/Destinations";
import WhyChooseUs from "./components/WhyChooseUs";
import Reviews from "./components/Reviews";
import MeetTheTeam from "./components/MeetTheTeam";
import AboutSection from "./components/AboutSection";
import AboutContact from "./components/AboutContact";
import TripDetailView from "./components/TripDetailView";
import EnquiryModal from "./components/EnquiryModal";
import StickyWhatsAppButton from "./components/StickyWhatsAppButton";
import MyBookingsLedger from "./components/MyBookingsLedger";
import TripQuiz from "./components/TripQuiz";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import TermsRegulationsModal from "./components/TermsRegulationsModal";
import CareersModal from "./components/CareersModal";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Admin from "./components/Admin";
import NotificationInbox from "./components/NotificationInbox";
import AmbientTrailAudio from "./components/AmbientTrailAudio";
import PrivacyAgreementPopup from "./components/PrivacyAgreementPopup";
import { Trip, Booking, Destination, Enquiry } from "./types";
import { TRIPS, DESTINATIONS } from "./data";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export default function App() {
  const [view, setView] = useState<"home" | "trip-detail" | "login" | "signup" | "dashboard" | "admin">("home");
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [tripsList, setTripsList] = useState<Trip[]>(TRIPS);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Detailed Trip View State
  const [selectedTripForDetail, setSelectedTripForDetail] = useState<Trip | null>(null);

  // Enquiry Modal State
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryPresetTrip, setEnquiryPresetTrip] = useState<Trip | null>(null);
  const [enquiryPresetCollection, setEnquiryPresetCollection] = useState<"explore" | "select" | "flexible">("flexible");

  // Filters State
  const [initialFilterDestinationId, setInitialFilterDestinationId] = useState<string | undefined>(undefined);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<"all" | "explore" | "select">("all");

  // Overlays
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

  // Synchronize user from Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          let role = "user";
          if (userDoc.exists()) {
            role = userDoc.data().role;
          } else {
            role =
              user.email?.includes("admin") ||
              user.email?.includes("abhighodke5123@gmail.com") ||
              user.email?.includes("raastatrips.in@gmail.com")
                ? "admin"
                : "user";

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

  // Synchronize departures list and user bookings
  const syncServerData = async () => {
    try {
      const tripsSnap = await getDocs(collection(db, "trips"));
      const firestoreTrips = tripsSnap.docs.map((doc) => doc.data() as Trip);

      if (firestoreTrips.length > 0) {
        const mergedMap = new Map<string, Trip>();
        TRIPS.forEach((t) => mergedMap.set(t.id, t));
        firestoreTrips.forEach((t) => mergedMap.set(t.id, t));
        setTripsList(Array.from(mergedMap.values()));
      } else {
        setTripsList(TRIPS);
      }

      if (currentUser) {
        const q = query(collection(db, "bookings"), where("email", "==", currentUser.email));
        const bookingsSnap = await getDocs(q);
        const userBookings = bookingsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(userBookings);

        const notifQuery = query(collection(db, "notifications"), where("userId", "==", currentUser.id), where("isRead", "==", false));
        const notifSnap = await getDocs(notifQuery);
        setNotificationCount(notifSnap.size);
      }
    } catch (err) {
      console.warn("Firestore sync fallback to curated catalog:", err);
      setTripsList(TRIPS);
    }
  };

  useEffect(() => {
    syncServerData();
  }, [currentUser]);

  // Open Enquiry modal for a specific trip
  const handleOpenEnquiryForTrip = (trip: Trip) => {
    setEnquiryPresetTrip(trip);
    setEnquiryPresetCollection(trip.collection || "flexible");
    setIsEnquiryModalOpen(true);
  };

  // Open Enquiry modal for a collection stream
  const handleOpenEnquiryForCollection = (col: "explore" | "select") => {
    setEnquiryPresetTrip(null);
    setEnquiryPresetCollection(col);
    setIsEnquiryModalOpen(true);
  };

  // Open dedicated Trip Detail view
  const handleOpenTripDetail = (trip: Trip) => {
    setSelectedTripForDetail(trip);
    setView("trip-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle destination select to filter upcoming departures
  const handleSelectDestinationForDepartures = (destId: string) => {
    setInitialFilterDestinationId(destId);
    if (view !== "home") setView("home");
    setTimeout(() => {
      const tripsSection = document.getElementById("trips");
      if (tripsSection) {
        tripsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Handle destination "View Route" to open matching trip detail
  const handleViewDestinationDetails = (destId: string) => {
    const matchingTrip = tripsList.find((t) => t.destinationId === destId) || tripsList[0];
    handleOpenTripDetail(matchingTrip);
  };

  return (
    <div className="min-h-screen bg-[#182622] text-[#EDE9DF] selection:bg-[#D4A96C] selection:text-[#182622] font-sans">
      
      {/* Universal Navigation */}
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
        onLogoClick={() => {
          setView("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onEnquireClick={() => {
          setEnquiryPresetTrip(null);
          setEnquiryPresetCollection("flexible");
          setIsEnquiryModalOpen(true);
        }}
        hideNavAnchors={view !== "home"}
        onNotificationsClick={() => setIsNotificationsOpen(true)}
        notificationCount={notificationCount}
      />

      {/* VIEW 1: HOME PAGE */}
      {view === "home" && (
        <main>
          {/* Section B: Hero Section */}
          <Hero
            onExploreClick={() => {
              const el = document.getElementById("trips");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onTalkToRaasta={() => {
              window.open(
                "https://wa.me/919226638440?text=Hi%20Raasta%20Trips%2C%20I%20would%20like%20to%20know%20more%20about%20your%20upcoming%20journeys.",
                "_blank"
              );
            }}
            onSelectDestination={handleSelectDestinationForDepartures}
          />

          {/* Section D: Travel Collections (RAASTA EXPLORE vs RAASTA SELECT) */}
          <CollectionsSection
            onSelectCollection={(col) => {
              setSelectedCollectionFilter(col);
              const el = document.getElementById("trips");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onEnquireClick={handleOpenEnquiryForCollection}
          />

          {/* Section C: Upcoming Departures */}
          <UpcomingTrips
            tripsList={tripsList}
            onViewTripDetails={handleOpenTripDetail}
            onEnquireTrip={handleOpenEnquiryForTrip}
            initialFilterDestinationId={initialFilterDestinationId}
            onClearInitialFilter={() => setInitialFilterDestinationId(undefined)}
            selectedCollectionFilter={selectedCollectionFilter}
            onSetCollectionFilter={(col) => setSelectedCollectionFilter(col)}
          />

          {/* Section E: Why Choose Raasta (4 Pillars) */}
          <WhyChooseUs />

          {/* Section F: Destinations */}
          <Destinations
            onSelectDestinationForDepartures={handleSelectDestinationForDepartures}
            onViewDestinationDetails={handleViewDestinationDetails}
          />

          {/* Section G: Traveller Stories (Verified Testimonials) */}
          <Reviews />

          {/* Section H: Meet The Team */}
          <MeetTheTeam />

          {/* About Section (The Story & Philosophy) */}
          <AboutSection />

          {/* Section I & J: Direct Contact Desk & Curated FAQs */}
          <AboutContact />

          {/* Ambient Trail Audio */}
          <AmbientTrailAudio />

          {/* Sticky Floating WhatsApp Support Button */}
          <StickyWhatsAppButton />
        </main>
      )}

      {/* VIEW 2: DEDICATED TRIP DETAIL PAGE (All 15 Sections) */}
      {view === "trip-detail" && selectedTripForDetail && (
        <TripDetailView
          trip={selectedTripForDetail}
          destination={DESTINATIONS.find((d) => d.id === selectedTripForDetail.destinationId)}
          allTripsForDestination={tripsList.filter((t) => t.destinationId === selectedTripForDetail.destinationId)}
          onBack={() => {
            setView("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onEnquireNow={handleOpenEnquiryForTrip}
          onSelectOtherTrip={(otherTrip) => {
            setSelectedTripForDetail(otherTrip);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {/* VIEW 3: AUTHENTICATION (Login / Signup) */}
      {view === "login" && (
        <Login
          onSuccess={() => setView("home")}
          onNavigateToSignup={() => setView("signup")}
          onBack={() => setView("home")}
        />
      )}

      {view === "signup" && (
        <Signup
          onSuccess={() => setView("home")}
          onNavigateToLogin={() => setView("login")}
          onBack={() => setView("home")}
        />
      )}

      {/* VIEW 4: USER DASHBOARD */}
      {view === "dashboard" && currentUser && (
        <Dashboard
          user={currentUser}
          onLogout={async () => {
            await auth.signOut();
            setCurrentUser(null);
            setView("home");
          }}
          onNavigateToHome={() => setView("home")}
          onReserveMore={() => {
            setView("home");
            setTimeout(() => {
              const el = document.getElementById("trips");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          notificationCount={notificationCount}
        />
      )}

      {/* VIEW 5: ADMIN PORTAL */}
      {view === "admin" && (
        <Admin
          currentUser={currentUser}
          tripsList={tripsList}
          onUpdateTripsList={(updated) => setTripsList(updated)}
          onBackToHome={() => setView("home")}
        />
      )}

      {/* ENQUIRY FIRST WORKFLOW MODAL */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        presetTrip={enquiryPresetTrip}
        presetCollection={enquiryPresetCollection}
        onEnquirySuccess={(enq) => {
          // Sync server data
          syncServerData();
        }}
      />

      {/* OVERLAYS & MODALS */}
      <TripQuiz
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        onSelectMatchingDestination={handleSelectDestinationForDepartures}
      />

      <MyBookingsLedger
        isOpen={bookingsOpen}
        onClose={() => setBookingsOpen(false)}
        bookings={bookings}
        onCancelBooking={async (bookingId) => {
          try {
            await deleteDoc(doc(db, "bookings", bookingId));
            const updated = bookings.filter((b) => b.id !== bookingId);
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

      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />

      <TermsRegulationsModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        initialTab={termsTab}
      />

      <CareersModal isOpen={careersOpen} onClose={() => setCareersOpen(false)} />

      <NotificationInbox
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        currentUser={currentUser}
      />

      {/* Cookie banner */}
      {!cookieConsent && !privacyAgreementOpen && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 p-5 rounded-2xl bg-[#202522]/95 backdrop-blur-xl border border-[#8C9A82]/30 shadow-2xl flex flex-col gap-3">
          <p className="text-xs text-[#EDE9DF]/80 font-light leading-relaxed">
            We use minimal cookies for secure booking sessions and authentication state. No third-party trackers are used.
          </p>
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={() => {
                setTermsTab("terms");
                setTermsOpen(true);
              }}
              className="text-[11px] text-[#EDE9DF]/60 hover:text-white underline cursor-pointer"
            >
              Learn More
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-1.5 rounded-xl bg-[#D4A96C] text-[#182622] text-xs font-bold hover:bg-[#d8b37c] cursor-pointer transition shadow-md"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* SECTION J: FOOTER */}
      <footer className="bg-[#101916] border-t border-[#8C9A82]/20 py-16 px-6 relative z-10 text-xs text-[#EDE9DF]/70">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Registration */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-xl bg-[#D4A96C] text-[#182622] flex items-center justify-center font-bold text-base font-serif">
                R
              </span>
              <span className="text-xl font-serif font-bold text-[#EDE9DF] tracking-tight">
                RAASTA TRIPS
              </span>
            </div>
            <p className="text-xs text-[#D4A96C] font-mono uppercase tracking-wider mb-3">
              Find Your Way. Make Your Story.
            </p>
            <p className="text-[#EDE9DF]/70 leading-relaxed font-light mb-4">
              Handcrafted overland journeys, high-altitude trans-Himalayan passes, and intimate micro-group road expeditions across India.
            </p>
            <p className="text-[11px] text-[#8C9A82] font-mono">
              Govt. Registered Adventure Tour Operator
            </p>
          </div>

          {/* Column 2: Expedition Circuits */}
          <div>
            <h4 className="text-[#EDE9DF] font-serif font-bold mb-4 text-sm tracking-wide">Expedition Routes</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleSelectDestinationForDepartures("spiti")}
                  className="hover:text-[#D4A96C] transition cursor-pointer text-left"
                >
                  Spiti Valley High Desert
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelectDestinationForDepartures("ladakh")}
                  className="hover:text-[#D4A96C] transition cursor-pointer text-left"
                >
                  Ladakh & Nubra Ridge
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelectDestinationForDepartures("meghalaya")}
                  className="hover:text-[#D4A96C] transition cursor-pointer text-left"
                >
                  Meghalaya Rainforest Living Bridges
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelectDestinationForDepartures("gokarna")}
                  className="hover:text-[#D4A96C] transition cursor-pointer text-left"
                >
                  Gokarna & Karwar Coastal Trail
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelectDestinationForDepartures("jaisalmer")}
                  className="hover:text-[#D4A96C] transition cursor-pointer text-left"
                >
                  Thar Desert Caravan & Dunes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Policies */}
          <div>
            <h4 className="text-[#EDE9DF] font-serif font-bold mb-4 text-sm tracking-wide">Community & Trust</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setCareersOpen(true)} className="hover:text-white transition cursor-pointer">
                  Lead as a Trip Captain
                </button>
              </li>
              <li>
                <button onClick={() => setQuizOpen(true)} className="hover:text-white transition cursor-pointer">
                  Route Matcher Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setTermsTab("refunds");
                    setTermsOpen(true);
                  }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Cancellation & Refund Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition cursor-pointer">
                  Data Privacy (DPDP 2023 Compliant)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setTermsTab("terms");
                    setTermsOpen(true);
                  }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Expedition Code of Conduct
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Operations */}
          <div>
            <h4 className="text-[#EDE9DF] font-serif font-bold mb-4 text-sm tracking-wide">Direct Operations</h4>
            <div className="space-y-3 font-mono text-xs text-[#EDE9DF]/80">
              <p>Helpline: +91 9226638440</p>
              <p>WhatsApp: +91 9226638440</p>
              <p>Email: raastatrips.in@gmail.com</p>
              <p className="text-[11px] text-[#8C9A82] font-sans">Desk: 9:00 AM – 8:30 PM IST</p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#8C9A82]/20">
              <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                2026–2027 Batches Open
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-[#8C9A82]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} RAASTA TRIPS & Overland Expeditions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition cursor-pointer">
              Privacy Policy
            </button>
            <button
              onClick={() => {
                setTermsTab("terms");
                setTermsOpen(true);
              }}
              className="hover:text-white transition cursor-pointer"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}